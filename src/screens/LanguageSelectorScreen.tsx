import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Splash: undefined;
  LanguageSelector: undefined;
  Auth: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  AdminLogin: undefined;
  Main: undefined;
  OrderDetail: { orderId: string };
};

type LanguageSelectorNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LanguageSelector'>;

export default function LanguageSelectorScreen() {
  const navigation = useNavigation<LanguageSelectorNavigationProp>();

  const handleLanguageSelect = (language: string) => {
    // Store language selection in AsyncStorage or context
    navigation.replace('Auth');
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2563eb" barStyle="light-content" />
      
      <View style={styles.content}>
        <Text style={styles.title}>Select Language</Text>
        <Text style={styles.subtitle}>Choisir la langue</Text>
        
        <View style={styles.languageList}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={styles.languageButton}
              onPress={() => handleLanguageSelect(language.code)}
              activeOpacity={0.8}
            >
              <Text style={styles.flag}>{language.flag}</Text>
              <Text style={styles.languageName}>{language.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563eb',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#e0e7ff',
    textAlign: 'center',
    marginBottom: 48,
  },
  languageList: {
    width: '100%',
    maxWidth: 300,
    gap: 16,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
});
