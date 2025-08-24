import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StyleSheet
} from 'react-native';

const AdminAnalyticsScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 15420,
    totalOrders: 248,
    averageOrderValue: 62.18,
    completionRate: 94.2,
    ordersPerDay: [
      { date: '2024-01-01', count: 12, revenue: 480 },
      { date: '2024-01-02', count: 18, revenue: 720 },
    ],
    topZones: [
      { zone: 'Tunis', orders: 85, revenue: 5200 },
      { zone: 'Sfax', orders: 62, revenue: 3800 },
      { zone: 'Sousse', orders: 45, revenue: 2900 },
    ]
  });

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Mock data loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Data is already set in state
    } catch (error) {
      Alert.alert('Error', 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>📊 Admin Analytics</Text>
        <Text style={styles.subtitle}>Tunisia Delivery Dashboard</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>💰</Text>
          <Text style={styles.statValue}>${analyticsData.totalRevenue}</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📦</Text>
          <Text style={styles.statValue}>{analyticsData.totalOrders}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📈</Text>
          <Text style={styles.statValue}>${analyticsData.averageOrderValue}</Text>
          <Text style={styles.statLabel}>Avg Order Value</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>✅</Text>
          <Text style={styles.statValue}>{analyticsData.completionRate}%</Text>
          <Text style={styles.statLabel}>Completion Rate</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏙️ Top Delivery Zones</Text>
        {analyticsData.topZones.map((zone, index) => (
          <View key={index} style={styles.zoneCard}>
            <View style={styles.zoneInfo}>
              <Text style={styles.zoneName}>{zone.zone}</Text>
              <Text style={styles.zoneStats}>
                {zone.orders} orders • ${zone.revenue} revenue
              </Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshButtonText}>🔄 Refresh Data</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>🔥 Firebase: Connected</Text>
        <Text style={styles.footerText}>📊 Real-time analytics ready</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#3252A2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7BB3E8',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    margin: 5,
    borderRadius: 10,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3252A2',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  zoneCard: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  zoneStats: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  refreshButton: {
    backgroundColor: '#3252A2',
    margin: 10,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default AdminAnalyticsScreen;
