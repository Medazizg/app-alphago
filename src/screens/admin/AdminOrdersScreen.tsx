import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { Search, Filter, Plus } from 'lucide-react-native';
import { LoadingSpinner, Input, Button } from '@/components/ui';
import { OrderCard } from '@/components/common/OrderCard';
import { OrderService } from '@/services/orders';
import { ZoneService } from '@/services/zones';
import { useAppStore } from '@/store';
import { Order, Zone, RootStackParamList } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/constants/theme';

type AdminOrdersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AdminOrdersScreen() {
  const navigation = useNavigation<AdminOrdersScreenNavigationProp>();
  const { t } = useTranslation();
  const { user, setLoading } = useAppStore();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLocalLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'phone' | 'orderId' | 'customerName'>('phone');
  const [filters, setFilters] = useState({
    status: 'all' as Order['status'] | 'all',
    zoneCode: 'all',
  });
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadInitialData();
      setupRealtimeListener();
      
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }, [])
  );

  const loadInitialData = async () => {
    try {
      setLocalLoading(true);
      await Promise.all([
        loadOrders(),
        loadZones(),
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert(t('common.error'), 'Failed to load orders');
    } finally {
      setLocalLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const filterOptions: any = {};
      
      if (filters.status !== 'all') {
        filterOptions.status = filters.status;
      }
      if (filters.zoneCode !== 'all') {
        filterOptions.zoneCode = filters.zoneCode;
      }
      
      const { orders } = await OrderService.getAllOrders(filterOptions, { limitCount: 100 });
      setOrders(orders);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadZones = async () => {
    try {
      const zonesData = await ZoneService.getAllZones();
      setZones(zonesData);
    } catch (error) {
      console.error('Error loading zones:', error);
    }
  };

  const setupRealtimeListener = () => {
    const unsubscribeFn = OrderService.subscribeToAllOrders((allOrders) => {
      let filteredOrders = allOrders;
      
      if (filters.status !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === filters.status);
      }
      if (filters.zoneCode !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.zoneCode === filters.zoneCode);
      }
      
      setOrders(filteredOrders);
    }, filters.status !== 'all' ? { status: filters.status } : undefined);
    
    setUnsubscribe(() => unsubscribeFn);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await loadOrders();
      return;
    }
    
    try {
      setLocalLoading(true);
      const searchResults = await OrderService.searchOrders(searchQuery.trim(), searchType);
      setOrders(searchResults);
    } catch (error) {
      Alert.alert(t('common.error'), 'Search failed');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleFilterChange = async () => {
    await loadOrders();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleOrderPress = (order: Order) => {
    navigation.navigate('OrderDetail', { orderId: order.id! });
  };

  const handleUpdateOrderStatus = async (order: Order, newStatus: Order['status']) => {
    if (!order.id) return;
    
    try {
      setLoading(true);
      await OrderService.updateOrder(order.id, { status: newStatus });
      Alert.alert(t('common.success'), t('orders.orderUpdated'));
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = (order: Order) => {
    Alert.alert(
      t('orders.deleteOrder'),
      t('orders.confirmDelete'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => confirmDeleteOrder(order),
        },
      ]
    );
  };

  const confirmDeleteOrder = async (order: Order) => {
    if (!order.id) return;
    
    try {
      setLoading(true);
      await OrderService.deleteOrder(order.id);
      Alert.alert(t('common.success'), t('orders.orderDeleted'));
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to delete order');
    } finally {
      setLoading(false);
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <OrderCard
      order={item}
      onPress={handleOrderPress}
      onDelete={handleDeleteOrder}
      onMarkDone={(order) => handleUpdateOrderStatus(order, 'done')}
      isAdmin={true}
      showActions={true}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>{t('orders.noOrders')}</Text>
      <Text style={styles.emptyStateSubtitle}>
        No orders found matching your criteria
      </Text>
    </View>
  );

  const getStatusOptions = () => [
    { label: 'All Orders', value: 'all' },
    { label: t('orders.pending'), value: 'pending' },
    { label: t('orders.inProgress'), value: 'in_progress' },
    { label: t('orders.completed'), value: 'done' },
    { label: t('orders.cancelled'), value: 'cancelled' },
  ];

  if (loading) {
    return <LoadingSpinner text="Loading orders..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('admin.ordersManagement')}</Text>
        <Text style={styles.subtitle}>
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          <View style={styles.searchTypeContainer}>
            <Picker
              selectedValue={searchType}
              onValueChange={setSearchType}
              style={styles.searchTypePicker}
            >
              <Picker.Item label="Phone" value="phone" />
              <Picker.Item label="Order ID" value="orderId" />
              <Picker.Item label="Name" value="customerName" />
            </Picker>
          </View>
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={`Search by ${searchType}`}
            style={styles.searchInput}
            containerStyle={styles.searchInputContainer}
          />
          <Button
            title="Search"
            onPress={handleSearch}
            size="small"
            style={styles.searchButton}
          />
        </View>
      </View>

      <View style={styles.filtersSection}>
        <View style={styles.filterRow}>
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filters.status}
                onValueChange={(value) => {
                  setFilters(prev => ({ ...prev, status: value }));
                  setTimeout(handleFilterChange, 100);
                }}
                style={styles.picker}
              >
                {getStatusOptions().map(option => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Zone</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filters.zoneCode}
                onValueChange={(value) => {
                  setFilters(prev => ({ ...prev, zoneCode: value }));
                  setTimeout(handleFilterChange, 100);
                }}
                style={styles.picker}
              >
                <Picker.Item label="All Zones" value="all" />
                {zones.map(zone => (
                  <Picker.Item
                    key={zone.code}
                    label={zone.name}
                    value={zone.code}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id || ''}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.xl,
    backgroundColor: COLORS.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  searchSection: {
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  searchTypeContainer: {
    width: 100,
  },
  searchTypePicker: {
    height: 40,
  },
  searchInputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  searchInput: {
    marginBottom: 0,
  },
  searchButton: {
    paddingHorizontal: SPACING.md,
  },
  filtersSection: {
    padding: SPACING.md,
    backgroundColor: COLORS.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  filterContainer: {
    flex: 1,
  },
  filterLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
  },
  picker: {
    height: 40,
  },
  listContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyStateTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyStateSubtitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
});
