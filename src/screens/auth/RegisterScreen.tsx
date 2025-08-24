import React, { useState, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { Mail, Lock, User, Phone, MapPin } from 'lucide-react-native';
import { Button, Input } from '@/components/ui';
import { AuthService } from '@/services/auth';
import { ZoneService } from '@/services/zones';
import { useAppStore } from '@/store';
import { RootStackParamList, Zone } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/constants/theme';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { t } = useTranslation();
  const { setUser, setLoading } = useAppStore();
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    zoneCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      const zonesData = await ZoneService.getAllZones();
      setZones(zonesData);
    } catch (error) {
      console.error('Error loading zones:', error);
      // Initialize default zones if none exist
      await ZoneService.initializeDefaultZones();
      const zonesData = await ZoneService.getAllZones();
      setZones(zonesData);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.displayName.trim()) {
      newErrors.displayName = t('validation.required');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('validation.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail');
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t('validation.required');
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = t('validation.invalidPhone');
    }
    
    if (!formData.password) {
      newErrors.password = t('validation.required');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.weakPassword');
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordsNotMatch');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const user = await AuthService.registerUser(
        formData.email,
        formData.password,
        formData.displayName,
        formData.phoneNumber,
        formData.zoneCode || undefined
      );
      
      setUser(user);
      Alert.alert(t('common.success'), t('auth.registerSuccess'));
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || 'Registration failed');
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
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('auth.createAccount')}</Text>
          <Text style={styles.subtitle}>Join Alphago delivery network</Text>
        </View>

        <View style={styles.form}>
          <Input
            label={t('auth.displayName')}
            value={formData.displayName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, displayName: text }))}
            leftIcon={<User size={20} color={COLORS.textSecondary} />}
            error={errors.displayName}
            placeholder="Enter your full name"
          />

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

          <Input
            label={t('auth.phoneNumber')}
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData(prev => ({ ...prev, phoneNumber: text }))}
            leftIcon={<Phone size={20} color={COLORS.textSecondary} />}
            error={errors.phoneNumber}
            keyboardType="phone-pad"
            placeholder="+216 XX XXX XXX"
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('home.selectZone')} (Optional)</Text>
            <View style={styles.pickerContainer}>
              <MapPin size={20} color={COLORS.textSecondary} style={styles.pickerIcon} />
              <Picker
                selectedValue={formData.zoneCode}
                onValueChange={(value) => setFormData(prev => ({ ...prev, zoneCode: value }))}
                style={styles.picker}
              >
                <Picker.Item label="Select your zone" value="" />
                {zones.map((zone) => (
                  <Picker.Item
                    key={zone.code}
                    label={zone.name}
                    value={zone.code}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <Input
            label={t('auth.password')}
            value={formData.password}
            onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
            leftIcon={<Lock size={20} color={COLORS.textSecondary} />}
            error={errors.password}
            isPassword
            placeholder="Enter your password"
          />

          <Input
            label={t('auth.confirmPassword')}
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
            leftIcon={<Lock size={20} color={COLORS.textSecondary} />}
            error={errors.confirmPassword}
            isPassword
            placeholder="Confirm your password"
          />

          <Button
            title={t('auth.createAccount')}
            onPress={handleRegister}
            fullWidth
            style={styles.registerButton}
          />

          <View style={styles.loginSection}>
            <Text style={styles.loginText}>
              {t('auth.alreadyHaveAccount')}
            </Text>
            <Button
              title={t('auth.login')}
              onPress={() => navigation.goBack()}
              variant="outline"
              fullWidth
              style={styles.loginButton}
            />
          </View>
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
  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  pickerContainer: {
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
  },
  pickerIcon: {
    position: 'absolute',
    left: SPACING.md,
    top: SPACING.md,
    zIndex: 1,
  },
  picker: {
    paddingLeft: 48,
    minHeight: 48,
  },
  registerButton: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  loginSection: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  loginText: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  loginButton: {
    marginBottom: SPACING.md,
  },
});
