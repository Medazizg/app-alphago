import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Phone, Edit, Trash2, CheckCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardActions, Button } from '@/components/ui';
import { StatusBadge } from './StatusBadge';
import { Order } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

interface OrderCardProps {
  order: Order;
  onEdit?: (order: Order) => void;
  onDelete?: (order: Order) => void;
  onMarkDone?: (order: Order) => void;
  onPress?: (order: Order) => void;
  showActions?: boolean;
  isAdmin?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onEdit,
  onDelete,
  onMarkDone,
  onPress,
  showActions = true,
  isAdmin = false,
}) => {
  const { t } = useTranslation();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handlePress = () => {
    if (onPress) {
      onPress(order);
    }
  };

  return (
    <Card onPress={handlePress} style={styles.card}>
      <CardContent>
        <View style={styles.header}>
          <Text style={styles.orderNumber}>
            {t('orders.orderNumber', { id: order.id?.slice(-6) || 'N/A' })}
          </Text>
          <StatusBadge status={order.status} size="small" />
        </View>
        
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{order.customerName}</Text>
          <View style={styles.phoneRow}>
            <Phone size={16} color={COLORS.textSecondary} />
            <Text style={styles.phoneText}>{order.customerPhone}</Text>
          </View>
        </View>

        <View style={styles.locationInfo}>
          <View style={styles.locationRow}>
            <MapPin size={16} color={COLORS.textSecondary} />
            <Text style={styles.zoneText}>{order.zoneName}</Text>
          </View>
          <Text style={styles.priceText}>
            {t('orders.price', { price: order.priceTND.toFixed(2) })}
          </Text>
        </View>

        {order.note && (
          <Text style={styles.noteText} numberOfLines={2}>
            {order.note}
          </Text>
        )}

        <View style={styles.dateInfo}>
          <Text style={styles.dateText}>
            {t('orders.createdAt')}: {formatDate(order.createdAt)}
          </Text>
          {order.updatedAt.getTime() !== order.createdAt.getTime() && (
            <Text style={styles.dateText}>
              {t('orders.updatedAt')}: {formatDate(order.updatedAt)}
            </Text>
          )}
        </View>
      </CardContent>

      {showActions && (
        <CardActions>
          {order.status !== 'done' && order.status !== 'cancelled' && onMarkDone && (
            <Button
              title={t('orders.markDone')}
              variant="secondary"
              size="small"
              onPress={() => onMarkDone(order)}
            />
          )}
          {onEdit && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => onEdit(order)}
            >
              <Edit size={20} color={COLORS.primary} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => onDelete(order)}
            >
              <Trash2 size={20} color={COLORS.error} />
            </TouchableOpacity>
          )}
        </CardActions>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  orderNumber: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.primary,
  },
  customerInfo: {
    marginBottom: SPACING.md,
  },
  customerName: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  phoneText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
  },
  locationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    flex: 1,
  },
  zoneText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
  },
  priceText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.success,
  },
  noteText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: SPACING.md,
  },
  dateInfo: {
    gap: SPACING.xs,
  },
  dateText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textSecondary,
  },
  iconButton: {
    padding: SPACING.sm,
  },
});
