import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { Home, Package, Settings, BarChart3 } from 'lucide-react-native';

export type MainTabParamList = {
  Home: undefined;
  Orders: undefined;
  Settings: undefined;
  Dashboard: undefined;
  AdminOrders: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

// Temporary placeholder screens
const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2563eb' }}>Home</Text>
    <Text style={{ fontSize: 16, marginTop: 8 }}>Welcome to Alphago Delivery</Text>
  </View>
);

const OrdersScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2563eb' }}>Orders</Text>
    <Text style={{ fontSize: 16, marginTop: 8 }}>Your delivery orders</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2563eb' }}>Settings</Text>
    <Text style={{ fontSize: 16, marginTop: 8 }}>App settings and profile</Text>
  </View>
);

const AdminDashboardScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#dc2626' }}>Admin Dashboard</Text>
    <Text style={{ fontSize: 16, marginTop: 8 }}>Analytics and overview</Text>
  </View>
);

export default function MainTabNavigator() {
  const { isAdmin } = useAuthStore();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#2563eb',
        },
        headerTintColor: '#ffffff',
      }}
    >
      {!isAdmin ? (
        // User tabs
        <>
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
            }}
          />
          <Tab.Screen 
            name="Orders" 
            component={OrdersScreen}
            options={{
              tabBarIcon: ({ color, size }) => <Package size={size} color={color} />,
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
            }}
          />
        </>
      ) : (
        // Admin tabs
        <>
          <Tab.Screen 
            name="Dashboard" 
            component={AdminDashboardScreen}
            options={{
              title: 'Admin Dashboard',
              tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
            }}
          />
          <Tab.Screen 
            name="AdminOrders" 
            component={OrdersScreen}
            options={{
              title: 'Manage Orders',
              tabBarIcon: ({ color, size }) => <Package size={size} color={color} />,
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}
