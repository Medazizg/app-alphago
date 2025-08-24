import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { 
  MapPin, 
  Phone, 
  DollarSign, 
  Clock, 
  FileText, 
  Edit, 
  Trash2,
  CheckCircle 
} from 'lucide-react-native';
import { Button, LoadingSpinner } from '@/components/ui';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { StatusBadge } from '@/components/common/StatusBadge';
import { OrderService } from '@/services/orders';
import { useAppStore } from '@/store';
import { Order, RootStackParamList } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/constants/theme';

type OrderDetailScreenRouteProp = RouteProp<RootStackParamList, 'OrderDetail'>;
type OrderDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderDetail'>;

export default function OrderDetailScreen() {
  const route = useRoute<OrderDetailScreenRouteProp>();
  const navigation = useNavigation<OrderDetailScreenNavigationProp>();
  const { t } = useTranslation();
  const { user, selectedOrder, setSelectedOrder, setLoading } = useAppStore();
  
  const [order, setOrder] = useState<Order | null>(selectedOrder);
  const [loading, setLocalLoading] = useState(false);

  const { orderId } = route.params;

  useEffect(() => {
    if (!selectedOrder && orderId) {
      loadOrder();
    }
  }, [orderId, selectedOrder]);

  const loadOrder = async () => {
    setLocalLoading(true);
    try {
      const orderData = await OrderService.getOrder(orderId);
      if (orderData) {
        setOrder(orderData);
        setSelectedOrder(orderData);
      } else {
        Alert.alert(t('common.error'), 'Order not found');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to load order details');
      navigation.goBack();
    } finally {
      setLocalLoading(false);
    }
  };

  const handleEditOrder = () => {
    if (order) {
      navigation.navigate('Main', { 
        screen: 'Home',
        params: { editOrder: order }
      });
    }
  };

  const handleDeleteOrder = () => {
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
          onPress: confirmDeleteOrder,
        },
      ]
    );
  };

  const confirmDeleteOrder = async () => {
    if (!order?.id) return;
    
    try {
      setLoading(true);
      await OrderService.deleteOrder(order.id);
      Alert.alert(
        t('common.success'), 
        t('orders.orderDeleted'),
        [
          {
            text: t('common.ok'),
            onPress: () => navigation.goBack(),
          }
        ]
      );
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to delete order');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDone = async () => {
    if (!order?.id) return;
    
    try {
      setLoading(true);
      await OrderService.updateOrder(order.id, { status: 'done' });
      const updatedOrder = { ...order, status: 'done' as const, updatedAt: new Date() };
      setOrder(updatedOrder);
      setSelectedOrder(updatedOrder);
      Alert.alert(t('common.success'), t('orders.orderUpdated'));
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading || localLoading) {
    return <LoadingSpinner text="Loading order details..." />;
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Order not found</Text>
      </View>
    );
  }

  const canEdit = order.status === 'pending' && order.createdBy === user?.uid;
  const canDelete = order.status === 'pending' && order.createdBy === user?.uid;
  const canMarkDone = (order.status === 'pending' || order.status === 'in_progress') && 
                      (order.createdBy === user?.uid || user?.role === 'admin');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.headerCard}>
        <CardHeader
          title={t('orders.orderNumber', { id: order.id?.slice(-6) || 'N/A' })}
          rightElement={<StatusBadge status={order.status} />}
        />
      </Card>

      <Card style={styles.customerCard}>
        <CardHeader title="Customer Information" />
        <CardContent>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Text style={styles.customerName}>{order.customerName}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Phone size={20} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{order.customerPhone}</Text>
          </View>
        </CardContent>
      </Card>

      <Card style={styles.locationCard}>
        <CardHeader title="Location & Delivery" />
        <CardContent>
          <View style={styles.infoRow}>
            <MapPin size={20} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{order.zoneName}</Text>
          </View>
          <View style={styles.infoRow}>
            <DollarSign size={20} color={COLORS.textSecondary} />
            <Text style={styles.priceText}>
              {order.priceTND.toFixed(2)} TND
            </Text>
          </View>
          
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: order.coords.lat,
                longitude: order.coords.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: order.coords.lat,
                  longitude: order.coords.lng,
                }}
                title="Delivery Location"
                description={order.customerName}
              />
            </MapView>
          </View>
        </CardContent>
      </Card>

      {order.note && (
        <Card style={styles.noteCard}>
          <CardHeader title="Notes" />
          <CardContent>
            <View style={styles.infoRow}>
              <FileText size={20} color={COLORS.textSecondary} />
              <Text style={styles.noteText}>{order.note}</Text>
            </View>
          </CardContent>
        </Card>
      )}

      <Card style={styles.timelineCard}>
        <CardHeader title="Timeline" />
        <CardContent>
          <View style={styles.infoRow}>
            <Clock size={20} color={COLORS.textSecondary} />
            <View style={styles.timelineInfo}>
              <Text style={styles.timelineLabel}>Created:</Text>
              <Text style={styles.timelineDate}>{formatDate(order.createdAt)}</Text>
            </View>
          </View>
          {order.updatedAt.getTime() !== order.createdAt.getTime() && (
            <View style={styles.infoRow}>
              <Clock size={20} color={COLORS.textSecondary} />
              <View style={styles.timelineInfo}>
                <Text style={styles.timelineLabel}>Last Updated:</Text>
                <Text style={styles.timelineDate}>{formatDate(order.updatedAt)}</Text>
              </View>
            </View>
          )}
        </CardContent>
      </Card>

      <View style={styles.actionContainer}>
        {canMarkDone && (
          <Button
            title={t('orders.markDone')}
            onPress={handleMarkDone}
            variant="secondary"
            style={styles.actionButton}
          />
        )}
        {canEdit && (
          <TouchableOpacity style={styles.iconActionButton} onPress={handleEditOrder}>
            <Edit size={24} color={COLORS.primary} />
            <Text style={styles.iconActionText}>{t('common.edit')}</Text>
          </TouchableOpacity>
        )}
        {canDelete && (
          <TouchableOpacity style={styles.iconActionButton} onPress={handleDeleteOrder}>
            <Trash2 size={24} color={COLORS.error} />
            <Text style={[styles.iconActionText, { color: COLORS.error }]}>
              {t('common.delete')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerCard: {
    margin: SPACING.md,
    marginBottom: SPACING.sm,
  },
  customerCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  locationCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  noteCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  timelineCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  iconContainer: {
    flex: 1,
  },
  customerName: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text,
  },
  infoText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text,
  },
  priceText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.success,
  },
  noteText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  mapContainer: {
    height: 200,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    marginTop: SPACING.md,
  },
  map: {
    flex: 1,
  },
  timelineInfo: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  timelineDate: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
  },
  iconActionButton: {
    alignItems: 'center',
    padding: SPACING.md,
  },
  iconActionText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.error,
    textAlign: 'center',
    margin: SPACING.xl,
  },
});
