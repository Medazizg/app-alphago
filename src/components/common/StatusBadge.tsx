import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/constants/theme';
import { Order } from '@/types';

interface StatusBadgeProps {
  status: Order['status'];
  size?: 'small' | 'medium';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'medium' }) => {
  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          backgroundColor: COLORS.warning,
          textColor: COLORS.background,
          text: 'Pending',
        };
      case 'in_progress':
        return {
          backgroundColor: COLORS.info,
          textColor: COLORS.background,
          text: 'In Progress',
        };
      case 'done':
        return {
          backgroundColor: COLORS.success,
          textColor: COLORS.background,
          text: 'Completed',
        };
      case 'cancelled':
        return {
          backgroundColor: COLORS.error,
          textColor: COLORS.background,
          text: 'Cancelled',
        };
      default:
        return {
          backgroundColor: COLORS.textSecondary,
          textColor: COLORS.background,
          text: 'Unknown',
        };
    }
  };

  const config = getStatusConfig(status);
  const badgeStyles = [
    styles.badge,
    styles[size],
    { backgroundColor: config.backgroundColor },
  ];
  const textStyles = [
    styles.text,
    styles[`${size}Text`],
    { color: config.textColor },
  ];

  return (
    <View style={badgeStyles}>
      <Text style={textStyles}>{config.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  medium: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  text: {
    fontWeight: TYPOGRAPHY.weights.medium,
    textAlign: 'center',
  },
  smallText: {
    fontSize: TYPOGRAPHY.sizes.xs,
  },
  mediumText: {
    fontSize: TYPOGRAPHY.sizes.sm,
  },
});
