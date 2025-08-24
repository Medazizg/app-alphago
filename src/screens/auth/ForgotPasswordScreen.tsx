import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react-native';
import { Button, Input } from '@/components/ui';
import { AuthService } from '@/services/auth';
import { useAppStore } from '@/store';
import { RootStackParamList } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const { t } = useTranslation();
  const { setLoading } = useAppStore();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = () => {
    if (!email.trim()) {
      setError(t('validation.required'));
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('validation.invalidEmail'));
      return false;
    }
    setError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;
    
    setLoading(true);
    
    try {
      await AuthService.resetPassword(email);
      Alert.alert(
        t('common.success'), 
        t('auth.resetEmailSent'),
        [
          {
            text: t('common.ok'),
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>{t('auth.resetPassword')}</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label={t('auth.email')}
          value={email}
          onChangeText={setEmail}
          leftIcon={<Mail size={20} color={COLORS.textSecondary} />}
          error={error}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Enter your email address"
        />

        <Button
          title={t('auth.resetPassword')}
          onPress={handleResetPassword}
          fullWidth
          style={styles.resetButton}
        />

        <Button
          title={t('common.back')}
          onPress={() => navigation.goBack()}
          variant="ghost"
          fullWidth
          style={styles.backButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
    paddingTop: SPACING.xxl * 2,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.background,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.accent,
    lineHeight: 24,
  },
  form: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'flex-start',
    paddingTop: SPACING.xxl,
  },
  resetButton: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  backButton: {
    marginTop: SPACING.md,
  },
});
