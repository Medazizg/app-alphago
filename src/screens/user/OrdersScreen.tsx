import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { Package, Clock, CheckCircle, XCircle, MapPin } from 'lucide-react-native';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryZone: string;
  price: string;
  notes?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
}

export default function OrdersScreen() {
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | Order['status']>('all');

  // Mock orders data
  const [orders] = useState<Order[]>([
    {
      id: '1',
      customerName: 'Ahmed Ben Ali',
      customerPhone: '+216 98 123 456',
      deliveryZone: 'Tunis Centre',
      price: '25.50',
      notes: 'Call when arriving',
      status: 'pending',
      createdAt: new Date(),
    },
    {
      id: '2',
      customerName: 'Fatima Trabelsi',
      customerPhone: '+216 22 987 654',
      deliveryZone: 'Ariana',
      price: '18.00',
      status: 'in_progress',
      createdAt: new Date(Date.now() - 86400000), // Yesterday
    },
    {
      id: '3',
      customerName: 'Mohamed Khelifi',
      customerPhone: '+216 55 246 810',
      deliveryZone: 'Manouba',
      price: '32.75',
      status: 'completed',
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getFilteredOrders = () => {
    if (filter === 'all') {
      return orders;
    }
    return orders.filter(order => order.status === filter);
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} color="#f59e0b" />;
      case 'in_progress':
        return <Package size={16} color="#3b82f6" />;
      case 'completed':
        return <CheckCircle size={16} color="#10b981" />;
      case 'cancelled':
        return <XCircle size={16} color="#ef4444" />;
      default:
        return <Clock size={16} color="#6b7280" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'in_progress':
        return '#3b82f6';
      case 'completed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const renderFilterButton = (statusFilter: 'all' | Order['status'], label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === statusFilter && styles.filterButtonActive,
      ]}
      onPress={() => setFilter(statusFilter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === statusFilter && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <View style={styles.statusContainer}>
            {getStatusIcon(item.status)}
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('_', ' ')}
            </Text>
          </View>
        </View>
        <Text style={styles.price}>{item.price} TND</Text>
      </View>
      
      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <MapPin size={16} color="#6b7280" />
          <Text style={styles.detailText}>{item.deliveryZone}</Text>
        </View>
        <Text style={styles.phoneText}>{item.customerPhone}</Text>
        {item.notes && (
          <Text style={styles.notesText}>{item.notes}</Text>
        )}
      </View>
      
      <Text style={styles.dateText}>
        {item.createdAt.toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        })}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Package size={64} color="#9ca3af" />
      <Text style={styles.emptyStateTitle}>No Orders Found</Text>
      <Text style={styles.emptyStateSubtitle}>
        Create your first delivery order to get started
      </Text>
    </View>
  );

  const filteredOrders = getFilteredOrders();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>My Orders</Text>
          <Text style={styles.subtitle}>
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          {renderFilterButton('all', 'All')}
          {renderFilterButton('pending', 'Pending')}
          {renderFilterButton('in_progress', 'In Progress')}
          {renderFilterButton('completed', 'Completed')}
          {renderFilterButton('cancelled', 'Cancelled')}
        </View>
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563eb']}
            tintColor={'#2563eb'}
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
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 24,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  orderDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
  },
  phoneText: {
    fontSize: 14,
    color: '#6b7280',
  },
  notesText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
