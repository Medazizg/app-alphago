import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-netinfo/netinfo';
import { Order } from '@/types';
import { OrderService } from './orders';

interface PendingAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retryCount: number;
}

class OfflineService {
  private static readonly PENDING_ACTIONS_KEY = 'alphago_pending_actions';
  private static readonly CACHED_ORDERS_KEY = 'alphago_cached_orders';
  private static readonly MAX_RETRY_COUNT = 3;
  
  static async cachePendingAction(action: Omit<PendingAction, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    try {
      const pendingActions = await this.getPendingActions();
      const newAction: PendingAction = {
        ...action,
        id: Date.now().toString(),
        timestamp: Date.now(),
        retryCount: 0,
      };
      
      pendingActions.push(newAction);
      await AsyncStorage.setItem(this.PENDING_ACTIONS_KEY, JSON.stringify(pendingActions));
    } catch (error) {
      console.error('Error caching pending action:', error);
    }
  }
  
  static async getPendingActions(): Promise<PendingAction[]> {
    try {
      const stored = await AsyncStorage.getItem(this.PENDING_ACTIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting pending actions:', error);
      return [];
    }
  }
  
  static async cacheOrders(orders: Order[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CACHED_ORDERS_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Error caching orders:', error);
    }
  }
  
  static async getCachedOrders(): Promise<Order[]> {
    try {
      const stored = await AsyncStorage.getItem(this.CACHED_ORDERS_KEY);
      if (!stored) return [];
      
      const orders = JSON.parse(stored);
      // Convert date strings back to Date objects
      return orders.map((order: any) => ({
        ...order,
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt),
      }));
    } catch (error) {
      console.error('Error getting cached orders:', error);
      return [];
    }
  }
  
  static async syncPendingActions(): Promise<void> {
    const isConnected = await this.isOnline();
    if (!isConnected) return;
    
    const pendingActions = await this.getPendingActions();
    const failedActions: PendingAction[] = [];
    
    for (const action of pendingActions) {
      try {
        await this.executePendingAction(action);
      } catch (error) {
        console.error('Error executing pending action:', error);
        
        if (action.retryCount < this.MAX_RETRY_COUNT) {
          failedActions.push({
            ...action,
            retryCount: action.retryCount + 1,
          });
        } else {
          console.warn('Max retry count reached for action:', action);
        }
      }
    }
    
    // Update pending actions with failed ones
    await AsyncStorage.setItem(this.PENDING_ACTIONS_KEY, JSON.stringify(failedActions));
  }
  
  private static async executePendingAction(action: PendingAction): Promise<void> {
    switch (action.type) {
      case 'create':
        await OrderService.createOrder(action.data);
        break;
      case 'update':
        await OrderService.updateOrder(action.data.id, action.data.updates);
        break;
      case 'delete':
        await OrderService.deleteOrder(action.data.id);
        break;
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }
  
  static async isOnline(): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected === true;
  }
  
  static setupNetworkListener(onConnect: () => void, onDisconnect: () => void): () => void {
    return NetInfo.addEventListener(state => {
      if (state.isConnected) {
        onConnect();
        // Auto-sync when coming back online
        this.syncPendingActions();
      } else {
        onDisconnect();
      }
    });
  }
  
  static async clearCache(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.PENDING_ACTIONS_KEY,
        this.CACHED_ORDERS_KEY,
      ]);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
  
  // Offline-first order operations
  static async createOrderOffline(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const tempId = `temp_${Date.now()}`;
    const order: Order = {
      ...orderData,
      id: tempId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Cache the action for later sync
    await this.cachePendingAction({
      type: 'create',
      data: orderData,
    });
    
    // Update local cache
    const cachedOrders = await this.getCachedOrders();
    cachedOrders.unshift(order);
    await this.cacheOrders(cachedOrders);
    
    return tempId;
  }
  
  static async updateOrderOffline(orderId: string, updates: Partial<Order>): Promise<void> {
    // Cache the action for later sync
    await this.cachePendingAction({
      type: 'update',
      data: { id: orderId, updates },
    });
    
    // Update local cache
    const cachedOrders = await this.getCachedOrders();
    const orderIndex = cachedOrders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
      cachedOrders[orderIndex] = {
        ...cachedOrders[orderIndex],
        ...updates,
        updatedAt: new Date(),
      };
      await this.cacheOrders(cachedOrders);
    }
  }
  
  static async deleteOrderOffline(orderId: string): Promise<void> {
    // Cache the action for later sync
    await this.cachePendingAction({
      type: 'delete',
      data: { id: orderId },
    });
    
    // Update local cache
    const cachedOrders = await this.getCachedOrders();
    const filteredOrders = cachedOrders.filter(order => order.id !== orderId);
    await this.cacheOrders(filteredOrders);
  }
}

export default OfflineService;
