import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  DollarSign,
  TrendingUp,
  Users
} from 'lucide-react-native';

export default function AdminDashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  
  // Mock data for demonstration
  const stats = {
    totalOrdersToday: 24,
    pendingOrders: 8,
    completedOrders: 16,
    revenueTND: 1250.75,
    ordersPerDay: [12, 8, 15, 22, 18, 24, 20],
    topZones: [
      { zone: 'Centre Ville', count: 15 },
      { zone: 'La Marsa', count: 12 },
      { zone: 'Sidi Bou Said', count: 10 },
      { zone: 'Carthage', count: 8 },
      { zone: 'Ariana', count: 6 },
    ],
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate loading
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} TND`;
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#2563eb']}
          tintColor="#2563eb"
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Overview of today's activities</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statsCard}>
          <View style={styles.statsIcon}>
            <Package size={24} color="#2563eb" />
          </View>
          <View style={styles.statsContent}>
            <Text style={styles.statsValue}>{stats.totalOrdersToday}</Text>
            <Text style={styles.statsLabel}>Total Orders Today</Text>
          </View>
        </View>
        
        <View style={styles.statsCard}>
          <View style={styles.statsIcon}>
            <Clock size={24} color="#f59e0b" />
          </View>
          <View style={styles.statsContent}>
            <Text style={styles.statsValue}>{stats.pendingOrders}</Text>
            <Text style={styles.statsLabel}>Pending Orders</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statsCard}>
          <View style={styles.statsIcon}>
            <CheckCircle size={24} color="#10b981" />
          </View>
          <View style={styles.statsContent}>
            <Text style={styles.statsValue}>{stats.completedOrders}</Text>
            <Text style={styles.statsLabel}>Completed Orders</Text>
          </View>
        </View>
        
        <View style={styles.statsCard}>
          <View style={styles.statsIcon}>
            <DollarSign size={24} color="#8b5cf6" />
          </View>
          <View style={styles.statsContent}>
            <Text style={styles.statsValue}>{formatCurrency(stats.revenueTND)}</Text>
            <Text style={styles.statsLabel}>Revenue</Text>
          </View>
        </View>
      </View>

      {/* Orders Chart */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Orders Per Day</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.chartSubtitle}>Last 7 days</Text>
          <View style={styles.miniChart}>
            {stats.ordersPerDay.map((count, index) => (
              <View key={index} style={styles.chartBar}>
                <View 
                  style={[
                    styles.bar,
                    { 
                      height: Math.max(count * 4, 4),
                      backgroundColor: '#2563eb' 
                    }
                  ]} 
                />
                <Text style={styles.barLabel}>{count}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Top Zones */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Top Zones</Text>
        </View>
        <View style={styles.cardContent}>
          {stats.topZones.map((zoneData, index) => (
            <View key={zoneData.zone} style={styles.zoneItem}>
              <View style={styles.zoneRank}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <View style={styles.zoneInfo}>
                <Text style={styles.zoneName}>{zoneData.zone}</Text>
                <Text style={styles.zoneCount}>
                  {zoneData.count} {zoneData.count === 1 ? 'order' : 'orders'}
                </Text>
              </View>
              <View style={styles.zoneProgress}>
                <View 
                  style={[
                    styles.progressBar,
                    { 
                      width: `${(zoneData.count / (stats.topZones[0]?.count || 1)) * 100}%`,
                      backgroundColor: '#8b5cf6' 
                    }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.actionContent}>
            <TrendingUp size={32} color="#2563eb" />
            <Text style={styles.actionTitle}>Analytics</Text>
            <Text style={styles.actionSubtitle}>View detailed reports</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.actionContent}>
            <Users size={32} color="#10b981" />
            <Text style={styles.actionTitle}>Users</Text>
            <Text style={styles.actionSubtitle}>Manage users</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statsContent: {
    flex: 1,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  cardContent: {
    padding: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 8,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    minHeight: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  zoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 12,
  },
  zoneRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  zoneCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  zoneProgress: {
    width: 60,
    height: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  quickActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionContent: {
    alignItems: 'center',
    padding: 20,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
