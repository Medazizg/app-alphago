import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  shadow?: 'sm' | 'md' | 'lg';
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CardActionsProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  shadow = 'md',
}) => {
  const cardStyles = [
    styles.card,
    SHADOWS[shadow],
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyles} onPress={onPress} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  rightElement,
  titleStyle,
  subtitleStyle,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
      </View>
      {rightElement && <View style={styles.headerRight}>{rightElement}</View>}
    </View>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ children, style }) => {
  return <View style={[styles.content, style]}>{children}</View>;
};

export const CardActions: React.FC<CardActionsProps> = ({ children, style }) => {
  return <View style={[styles.actions, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerContent: {
    flex: 1,
  },
  headerRight: {
    marginLeft: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
  },
  content: {
    padding: SPACING.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingTop: SPACING.md,
    gap: SPACING.md,
  },
});
