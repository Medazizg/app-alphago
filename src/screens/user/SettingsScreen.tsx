import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Globe, 
  LogOut,
  Edit3
} from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';

export default function SettingsScreen() {
  const { user, signOut } = useAuthStore();
  
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    phoneNumber: user?.phoneNumber || '',
  });
  const [language, setLanguage] = useState<'en' | 'fr'>('en');

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: confirmLogout,
        },
      ]
    );
  };

  const confirmLogout = async () => {
    try {
      await signOut();
      Alert.alert('Success', 'You have been logged out');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const handleLanguageChange = (newLanguage: 'en' | 'fr') => {
    setLanguage(newLanguage);
    Alert.alert('Success', `Language changed to ${newLanguage === 'en' ? 'English' : 'French'}`);
  };

  const handleSaveProfile = () => {
    if (!profileData.displayName.trim()) {
      Alert.alert('Error', 'Display name is required');
      return;
    }
    
    if (!profileData.phoneNumber.trim()) {
      Alert.alert('Error', 'Phone number is required');
      return;
    }
    
    setEditingProfile(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleChangePassword = () => {
    Alert.alert('Password Reset', 'A password reset email will be sent to your email address');
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Profile Settings</Text>
        </View>
        
        <View style={styles.cardContent}>
          {/* Profile Photo */}
          <View style={styles.photoSection}>
            <View style={styles.photoPlaceholder}>
              <User size={40} color="#6b7280" />
            </View>
          </View>

          {editingProfile ? (
            <View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Display Name</Text>
                <View style={styles.inputWrapper}>
                  <User size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={profileData.displayName}
                    onChangeText={(text) => setProfileData(prev => ({ ...prev, displayName: text }))}
                    placeholder="Enter your name"
                  />
                </View>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.inputWrapper}>
                  <Phone size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={profileData.phoneNumber}
                    onChangeText={(text) => setProfileData(prev => ({ ...prev, phoneNumber: text }))}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.editActions}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonOutline]}
                  onPress={() => {
                    setEditingProfile(false);
                    setProfileData({
                      displayName: user.displayName || '',
                      phoneNumber: user.phoneNumber || '',
                    });
                  }}
                >
                  <Text style={styles.buttonTextOutline}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSaveProfile}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.infoRow}>
                <User size={20} color="#6b7280" />
                <Text style={styles.infoText}>{user.displayName || 'Not provided'}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Mail size={20} color="#6b7280" />
                <Text style={styles.infoText}>{user.email}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Phone size={20} color="#6b7280" />
                <Text style={styles.infoText}>{user.phoneNumber || 'Not provided'}</Text>
              </View>

              <TouchableOpacity
                style={[styles.button, styles.buttonOutline]}
                onPress={() => setEditingProfile(true)}
              >
                <Edit3 size={16} color="#2563eb" style={{ marginRight: 8 }} />
                <Text style={styles.buttonTextOutline}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Language Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Language Settings</Text>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.languageOptions}>
            <TouchableOpacity
              style={[
                styles.languageOption,
                language === 'en' && styles.languageOptionActive,
              ]}
              onPress={() => handleLanguageChange('en')}
            >
              <Globe size={20} color={language === 'en' ? '#ffffff' : '#6b7280'} />
              <Text style={[
                styles.languageText,
                language === 'en' && styles.languageTextActive,
              ]}>
                English
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.languageOption,
                language === 'fr' && styles.languageOptionActive,
              ]}
              onPress={() => handleLanguageChange('fr')}
            >
              <Globe size={20} color={language === 'fr' ? '#ffffff' : '#6b7280'} />
              <Text style={[
                styles.languageText,
                language === 'fr' && styles.languageTextActive,
              ]}>
                Français
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <TouchableOpacity style={styles.actionItem} onPress={handleChangePassword}>
            <Lock size={20} color="#6b7280" />
            <Text style={styles.actionText}>Change Password</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
            <LogOut size={20} color="#dc2626" />
            <Text style={[styles.actionText, { color: '#dc2626' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  cardContent: {
    padding: 16,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  buttonTextOutline: {
    color: '#2563eb',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  languageOptions: {
    gap: 8,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    gap: 12,
  },
  languageOptionActive: {
    backgroundColor: '#2563eb',
  },
  languageText: {
    fontSize: 16,
    color: '#6b7280',
  },
  languageTextActive: {
    color: '#ffffff',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  actionText: {
    fontSize: 16,
    color: '#374151',
  },
  errorText: {
    fontSize: 18,
    color: '#dc2626',
    textAlign: 'center',
    margin: 24,
  },
});
