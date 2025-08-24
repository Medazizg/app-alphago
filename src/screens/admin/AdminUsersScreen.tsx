import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Mail, 
  Phone,
  MapPin,
  MoreVertical
} from 'lucide-react-native';
import { LoadingSpinner, Button, Input } from '@/components/ui';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { AuthService } from '@/services/auth';
import { useAppStore } from '@/store';
import { User } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/constants/theme';

export default function AdminUsersScreen() {
  const { t } = useTranslation();
  const { user: currentUser, setLoading } = useAppStore();
  
  const [users, setUsers] = useState<User[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLocalLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'regular' | 'admin'>('regular');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLocalLoading(true);
      
      // For now, we'll just load admin users as we don't have a way to list all regular users
      // In a real app, you'd need Cloud Functions or Admin SDK for this
      const adminUsersData = await AuthService.getAllAdminUsers();
      setAdminUsers(adminUsersData);
      
      // Mock some regular users for demonstration
      const mockUsers: User[] = [
        {
          uid: '1',
          displayName: 'John Doe',
          email: 'john.doe@example.com',
          phoneNumber: '+216 12 345 678',
          role: 'user',
          zoneCode: 'TUNIS_CENTRE',
          createdAt: new Date('2024-01-15'),
        },
        {
          uid: '2',
          displayName: 'Jane Smith',
          email: 'jane.smith@example.com',
          phoneNumber: '+216 98 765 432',
          role: 'user',
          zoneCode: 'ARIANA',
          createdAt: new Date('2024-01-20'),
        },
        {
          uid: '3',
          displayName: 'Ahmed Ben Ali',
          email: 'ahmed.benali@example.com',
          phoneNumber: '+216 55 123 456',
          role: 'user',
          zoneCode: 'SFAX',
          createdAt: new Date('2024-02-01'),
        },
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert(t('common.error'), 'Failed to load users');
    } finally {
      setLocalLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleCreateAdminUser = () => {
    Alert.alert(
      'Create Admin User',
      'Admin user creation requires backend implementation with Firebase Admin SDK. This feature will be available in the production version.',
      [{ text: 'OK' }]
    );
  };

  const handleUserAction = (user: User, action: 'view' | 'edit' | 'disable') => {
    switch (action) {
      case 'view':
        Alert.alert(
          'User Details',
          `Name: ${user.displayName}\nEmail: ${user.email}\nPhone: ${user.phoneNumber || 'N/A'}\nRole: ${user.role}\nZone: ${user.zoneCode || 'N/A'}`,
          [{ text: 'OK' }]
        );
        break;
      case 'edit':
        Alert.alert(
          'Edit User',
          'User editing functionality will be available in the next version.',
          [{ text: 'OK' }]
        );
        break;
      case 'disable':
        Alert.alert(
          'Disable User',
          `Are you sure you want to disable ${user.displayName}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Disable', 
              style: 'destructive',
              onPress: () => {
                Alert.alert('Feature Not Available', 'User management requires backend implementation.');
              }
            },
          ]
        );
        break;
    }
  };

  const getFilteredUsers = () => {
    const currentUsers = activeTab === 'regular' ? users : adminUsers;
    
    if (!searchQuery.trim()) {
      return currentUsers;
    }
    
    return currentUsers.filter(user => 
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phoneNumber?.includes(searchQuery)
    );
  };

  const renderUserItem = ({ item: user }: { item: User }) => (
    <Card style={styles.userCard}>
      <CardContent style={styles.userContent}>
        <View style={styles.userHeader}>
          <View style={styles.userAvatar}>
            {user.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user.displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.userInfo}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{user.displayName}</Text>
              {user.role === 'admin' && (
                <Shield size={16} color={COLORS.primary} />
              )}
            </View>
            
            <View style={styles.userDetail}>
              <Mail size={14} color={COLORS.textSecondary} />
              <Text style={styles.userDetailText}>{user.email}</Text>
            </View>
            
            {user.phoneNumber && (
              <View style={styles.userDetail}>
                <Phone size={14} color={COLORS.textSecondary} />
                <Text style={styles.userDetailText}>{user.phoneNumber}</Text>
              </View>
            )}
            
            {user.zoneCode && (
              <View style={styles.userDetail}>
                <MapPin size={14} color={COLORS.textSecondary} />
                <Text style={styles.userDetailText}>{user.zoneCode}</Text>
              </View>
            )}
            
            <Text style={styles.userJoinDate}>
              Joined {user.createdAt.toLocaleDateString()}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Alert.alert(
                'User Actions',
                `Actions for ${user.displayName}`,
                [
                  { text: 'View Details', onPress: () => handleUserAction(user, 'view') },
                  { text: 'Edit User', onPress: () => handleUserAction(user, 'edit') },
                  { text: 'Disable User', onPress: () => handleUserAction(user, 'disable'), style: 'destructive' },
                  { text: 'Cancel', style: 'cancel' },
                ]
              );
            }}
          >
            <MoreVertical size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </CardContent>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Users size={48} color={COLORS.textSecondary} />
      <Text style={styles.emptyStateTitle}>
        {activeTab === 'regular' ? 'No Users Found' : 'No Admin Users Found'}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {activeTab === 'regular' 
          ? 'Users will appear here as they register'
          : 'Create admin users to manage the system'
        }
      </Text>
    </View>
  );

  const renderTabButton = (tab: 'regular' | 'admin', label: string, count: number) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && styles.tabButtonActive,
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[
        styles.tabButtonText,
        activeTab === tab && styles.tabButtonTextActive,
      ]}>
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  const filteredUsers = getFilteredUsers();

  if (loading) {
    return <LoadingSpinner text="Loading users..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('admin.userManagement')}</Text>
        <Text style={styles.subtitle}>Manage system users and admins</Text>
        
        <Button
          title="Create Admin User"
          onPress={handleCreateAdminUser}
          variant="outline"
          size="small"
          style={styles.createButton}
        />
      </View>

      <View style={styles.tabsContainer}>
        {renderTabButton('regular', 'Users', users.length)}
        {renderTabButton('admin', 'Admins', adminUsers.length)}
      </View>

      <View style={styles.searchSection}>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name, email, or phone"
          style={styles.searchInput}
          containerStyle={styles.searchContainer}
        />
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.uid}
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
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  createButton: {
    alignSelf: 'flex-start',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: COLORS.primary,
  },
  tabButtonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  tabButtonTextActive: {
    color: COLORS.primary,
  },
  searchSection: {
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchContainer: {
    marginBottom: 0,
  },
  searchInput: {
    marginBottom: 0,
  },
  listContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  userCard: {
    marginBottom: SPACING.md,
  },
  userContent: {
    padding: SPACING.lg,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userAvatar: {
    marginRight: SPACING.md,
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.background,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    gap: SPACING.xs,
  },
  userName: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text,
  },
  userDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    gap: SPACING.xs,
  },
  userDetailText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
  },
  userJoinDate: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  actionButton: {
    padding: SPACING.sm,
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
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptyStateSubtitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
});
