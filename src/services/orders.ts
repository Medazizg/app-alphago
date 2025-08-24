import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  limit,
  startAfter,
  Timestamp,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { Order } from '@/types';

export class OrderService {
  static async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date();
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
      });
      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to create order: ${error}`);
    }
  }

  static async updateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      throw new Error(`Failed to update order: ${error}`);
    }
  }

  static async deleteOrder(orderId: string): Promise<void> {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await deleteDoc(orderRef);
    } catch (error) {
      throw new Error(`Failed to delete order: ${error}`);
    }
  }

  static async getOrder(orderId: string): Promise<Order | null> {
    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (!orderDoc.exists()) {
        return null;
      }

      const data = orderDoc.data();
      return {
        id: orderDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Order;
    } catch (error) {
      throw new Error(`Failed to get order: ${error}`);
    }
  }

  static async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, 'orders'),
        where('createdBy', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Order[];
    } catch (error) {
      throw new Error(`Failed to get user orders: ${error}`);
    }
  }

  static async getAllOrders(
    filters?: {
      status?: Order['status'];
      zoneCode?: string;
      startDate?: Date;
      endDate?: Date;
    },
    pagination?: {
      limitCount?: number;
      lastDoc?: QueryDocumentSnapshot;
    }
  ): Promise<{ orders: Order[]; lastDoc?: QueryDocumentSnapshot }> {
    try {
      let q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));

      // Apply filters
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters?.zoneCode) {
        q = query(q, where('zoneCode', '==', filters.zoneCode));
      }
      if (filters?.startDate) {
        q = query(q, where('createdAt', '>=', Timestamp.fromDate(filters.startDate)));
      }
      if (filters?.endDate) {
        q = query(q, where('createdAt', '<=', Timestamp.fromDate(filters.endDate)));
      }

      // Apply pagination
      if (pagination?.limitCount) {
        q = query(q, limit(pagination.limitCount));
      }
      if (pagination?.lastDoc) {
        q = query(q, startAfter(pagination.lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Order[];

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      return { orders, lastDoc };
    } catch (error) {
      throw new Error(`Failed to get orders: ${error}`);
    }
  }

  static subscribeToUserOrders(
    userId: string,
    callback: (orders: Order[]) => void
  ): () => void {
    const q = query(
      collection(db, 'orders'),
      where('createdBy', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Order[];
      callback(orders);
    });
  }

  static subscribeToAllOrders(
    callback: (orders: Order[]) => void,
    filters?: {
      status?: Order['status'];
      zoneCode?: string;
    }
  ): () => void {
    let q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));

    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.zoneCode) {
      q = query(q, where('zoneCode', '==', filters.zoneCode));
    }

    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Order[];
      callback(orders);
    });
  }

  static async searchOrders(
    searchTerm: string,
    searchType: 'phone' | 'orderId' | 'customerName' = 'phone'
  ): Promise<Order[]> {
    try {
      let q;
      
      switch (searchType) {
        case 'phone':
          q = query(
            collection(db, 'orders'),
            where('customerPhone', '>=', searchTerm),
            where('customerPhone', '<=', searchTerm + '\uf8ff'),
            orderBy('customerPhone'),
            orderBy('createdAt', 'desc')
          );
          break;
        case 'orderId':
          // For order ID search, get specific document
          const orderDoc = await getDoc(doc(db, 'orders', searchTerm));
          if (orderDoc.exists()) {
            const data = orderDoc.data();
            return [{
              id: orderDoc.id,
              ...data,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            }] as Order[];
          }
          return [];
        case 'customerName':
          q = query(
            collection(db, 'orders'),
            where('customerName', '>=', searchTerm),
            where('customerName', '<=', searchTerm + '\uf8ff'),
            orderBy('customerName'),
            orderBy('createdAt', 'desc')
          );
          break;
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Order[];
    } catch (error) {
      throw new Error(`Failed to search orders: ${error}`);
    }
  }

  static async getOrderStats(
    startDate?: Date,
    endDate?: Date,
    zoneCode?: string
  ): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    revenue: number;
  }> {
    try {
      let q = query(collection(db, 'orders'));

      if (startDate) {
        q = query(q, where('createdAt', '>=', Timestamp.fromDate(startDate)));
      }
      if (endDate) {
        q = query(q, where('createdAt', '<=', Timestamp.fromDate(endDate)));
      }
      if (zoneCode) {
        q = query(q, where('zoneCode', '==', zoneCode));
      }

      const querySnapshot = await getDocs(q);
      
      let total = 0;
      let pending = 0;
      let inProgress = 0;
      let completed = 0;
      let cancelled = 0;
      let revenue = 0;

      querySnapshot.docs.forEach(doc => {
        const order = doc.data() as Order;
        total++;
        
        switch (order.status) {
          case 'pending':
            pending++;
            break;
          case 'in_progress':
            inProgress++;
            break;
          case 'done':
            completed++;
            revenue += order.priceTND;
            break;
          case 'cancelled':
            cancelled++;
            break;
        }
      });

      return {
        total,
        pending,
        inProgress,
        completed,
        cancelled,
        revenue,
      };
    } catch (error) {
      throw new Error(`Failed to get order stats: ${error}`);
    }
  }
}
