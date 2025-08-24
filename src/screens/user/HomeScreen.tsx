import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuthStore } from '@/store/authStore';
import { User, Phone, MapPin, DollarSign, FileText, Package } from 'lucide-react-native';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    deliveryZone: '',
    price: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const zones = [
    { label: 'Select delivery zone', value: '' },
    { label: 'Tunis Centre', value: 'tunis-centre' },
    { label: 'Ariana', value: 'ariana' },
    { label: 'Manouba', value: 'manouba' },
    { label: 'Ben Arous', value: 'ben-arous' },
    { label: 'Nabeul', value: 'nabeul' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Invalid phone number format';
    }
    
    if (!formData.deliveryZone) {
      newErrors.deliveryZone = 'Delivery zone is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Invalid price amount';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill in all required fields correctly');
      return;
    }
    
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Success',
        'Order created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFormData({
                customerName: '',
                customerPhone: '',
                deliveryZone: '',
                price: '',
                notes: '',
              });
              setErrors({});
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Package size={32} color="#2563eb" />
          <Text style={styles.title}>Create New Order</Text>
          <Text style={styles.subtitle}>Fill in the delivery details</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Customer Name *</Text>
            <View style={styles.inputWrapper}>
              <User size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.customerName}
                onChangeText={(text: string) => setFormData(prev => ({ ...prev, customerName: text }))}
                placeholder="Enter customer name"
                placeholderTextColor="#9ca3af"
              />
            </View>
            {errors.customerName && (
              <Text style={styles.errorText}>{errors.customerName}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number *</Text>
            <View style={styles.inputWrapper}>
              <Phone size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.customerPhone}
                onChangeText={(text: string) => setFormData(prev => ({ ...prev, customerPhone: text }))}
                placeholder="+216 XX XXX XXX"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
              />
            </View>
            {errors.customerPhone && (
              <Text style={styles.errorText}>{errors.customerPhone}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Delivery Zone *</Text>
            <View style={styles.pickerContainer}>
              <MapPin size={20} color="#6b7280" style={styles.pickerIcon} />
              <Picker
                selectedValue={formData.deliveryZone}
                onValueChange={(value: string) => setFormData(prev => ({ ...prev, deliveryZone: value }))}
                style={styles.picker}
              >
                {zones.map((zone) => (
                  <Picker.Item
                    key={zone.value}
                    label={zone.label}
                    value={zone.value}
                  />
                ))}
              </Picker>
            </View>
            {errors.deliveryZone && (
              <Text style={styles.errorText}>{errors.deliveryZone}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Price (TND) *</Text>
            <View style={styles.inputWrapper}>
              <DollarSign size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text: string) => setFormData(prev => ({ ...prev, price: text }))}
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
            </View>
            {errors.price && (
              <Text style={styles.errorText}>{errors.price}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <View style={styles.inputWrapper}>
              <FileText size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.noteInput]}
                value={formData.notes}
                onChangeText={(text: string) => setFormData(prev => ({ ...prev, notes: text }))}
                placeholder="Additional notes..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={handleSubmitOrder}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>Create Order</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  form: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    paddingVertical: 16,
  },
  pickerContainer: {
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#f9fafb',
  },
  pickerIcon: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
  },
  picker: {
    paddingLeft: 48,
    minHeight: 48,
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    marginTop: 4,
  },
});
