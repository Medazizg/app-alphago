import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
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

type SplashNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<SplashNavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Navigate to language selector after 3 seconds
      navigation.replace('LanguageSelector');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2563eb" barStyle="light-content" />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/alphago-logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logo}>Alphago</Text>
          <Text style={styles.subtitle}>Fast Delivery Service</Text>
        </View>
        
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.welcome}>Loading...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e7ff',
    textAlign: 'center',
    marginBottom: 40,
  },
  welcome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
  },
});
