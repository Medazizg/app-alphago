import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { User, Shield } from 'lucide-react-native';
import { RootStackParamList } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

type AuthScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export default function AuthScreen() {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.logo}>Alphago</Text>
        <Text style={styles.subtitle}>{t('splash.subtitle')}</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <User size={32} color={COLORS.primary} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>{t('auth.userLogin')}</Text>
            <Text style={styles.optionDescription}>
              Create orders and track deliveries
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('Login', { isAdmin: true })}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <Shield size={32} color={COLORS.primary} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>{t('auth.adminLogin')}</Text>
            <Text style={styles.optionDescription}>
              Manage orders and view analytics
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.xxl * 2,
    paddingBottom: SPACING.xxl,
  },
  logo: {
    fontSize: 36,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.background,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.accent,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  optionDescription: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
  },
});
