import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, User } from 'lucide-react-native';
import { Button, Input } from '@/components/ui';
import { AuthService } from '@/services/auth';
import { useAppStore } from '@/store';
import { RootStackParamList } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const route = useRoute<LoginScreenRouteProp>();
  const { t } = useTranslation();
  const { setUser, setLoading } = useAppStore();
  
  const isAdmin = route.params?.isAdmin || false;
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (isAdmin) {
      if (!formData.username.trim()) {
        newErrors.username = t('validation.required');
      }
    } else {
      if (!formData.email.trim()) {
        newErrors.email = t('validation.required');
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t('validation.invalidEmail');
      }
    }
    
    if (!formData.password) {
      newErrors.password = t('validation.required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      let user;
      if (isAdmin) {
        user = await AuthService.loginAdmin(formData.username, formData.password);
      } else {
        user = await AuthService.loginUser(formData.email, formData.password);
      }
      
      setUser(user);
      Alert.alert(t('common.success'), t('auth.loginSuccess'));
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (isAdmin) {
      Alert.alert(
        t('common.error'), 
        'Admin password reset must be handled by system administrator'
      );
      return;
    }
    navigation.navigate('ForgotPassword');
  };

  const handleCreateAccount = () => {
    if (isAdmin) {
      Alert.alert(
        t('common.error'), 
        'Admin accounts cannot be created through the app'
      );
      return;
    }
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isAdmin ? t('auth.adminLogin') : t('auth.login')}
          </Text>
          <Text style={styles.subtitle}>
            Welcome back to Alphago
          </Text>
        </View>

        <View style={styles.form}>
          {isAdmin ? (
            <Input
              label={t('auth.username')}
              value={formData.username}
              onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
              leftIcon={<User size={20} color={COLORS.textSecondary} />}
              error={errors.username}
              autoCapitalize="none"
              placeholder="Enter admin username"
            />
          ) : (
            <Input
              label={t('auth.email')}
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              leftIcon={<Mail size={20} color={COLORS.textSecondary} />}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
            />
          )}

          <Input
            label={t('auth.password')}
            value={formData.password}
            onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
            leftIcon={<Lock size={20} color={COLORS.textSecondary} />}
            error={errors.password}
            isPassword
            placeholder="Enter your password"
          />

          <Button
            title={t('auth.login')}
            onPress={handleLogin}
            fullWidth
            style={styles.loginButton}
          />

          {!isAdmin && (
            <>
              <Button
                title={t('auth.forgotPassword')}
                onPress={handleForgotPassword}
                variant="ghost"
                fullWidth
                style={styles.forgotButton}
              />

              <View style={styles.registerSection}>
                <Text style={styles.registerText}>
                  {t('auth.dontHaveAccount')}
                </Text>
                <Button
                  title={t('auth.createAccount')}
                  onPress={handleCreateAccount}
                  variant="outline"
                  fullWidth
                  style={styles.registerButton}
                />
              </View>
            </>
          )}

          <Button
            title="Back"
            onPress={() => navigation.goBack()}
            variant="ghost"
            fullWidth
            style={styles.backButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
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
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.accent,
  },
  form: {
    padding: SPACING.xl,
  },
  loginButton: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  forgotButton: {
    marginBottom: SPACING.lg,
  },
  registerSection: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  registerText: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  registerButton: {
    marginBottom: SPACING.md,
  },
  backButton: {
    marginTop: SPACING.md,
  },
});
