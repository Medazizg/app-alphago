import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { MapPin, MyLocation } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/constants/theme';

interface MapPickerProps {
  initialCoords?: {
    latitude: number;
    longitude: number;
  };
  onLocationSelect: (coords: { lat: number; lng: number }) => void;
  style?: any;
}

export const MapPicker: React.FC<MapPickerProps> = ({
  initialCoords,
  onLocationSelect,
  style,
}) => {
  const { t } = useTranslation();
  const [selectedCoords, setSelectedCoords] = useState(initialCoords);
  const [region, setRegion] = useState({
    latitude: initialCoords?.latitude || 36.8065, // Tunis default
    longitude: initialCoords?.longitude || 10.1815,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is required to show your current location on the map.'
        );
        return;
      }
    } catch (error) {
      console.log('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Cannot access location');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const newCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setSelectedCoords(newCoords);
      setRegion({
        ...newCoords,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      
      onLocationSelect({
        lat: newCoords.latitude,
        lng: newCoords.longitude,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location');
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const newCoords = { latitude, longitude };
    
    setSelectedCoords(newCoords);
    onLocationSelect({
      lat: latitude,
      lng: longitude,
    });
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('home.selectLocation')}</Text>
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={getCurrentLocation}
        >
          <MyLocation size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <MapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        region={region}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {selectedCoords && (
          <Marker
            coordinate={selectedCoords}
            title="Selected Location"
            description="Delivery location"
          >
            <View style={styles.customMarker}>
              <MapPin size={24} color={COLORS.primary} />
            </View>
          </Marker>
        )}
      </MapView>
      
      {selectedCoords && (
        <View style={styles.coordsInfo}>
          <Text style={styles.coordsText}>
            Selected: {selectedCoords.latitude.toFixed(6)}, {selectedCoords.longitude.toFixed(6)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text,
  },
  currentLocationButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.backgroundSecondary,
  },
  map: {
    flex: 1,
  },
  customMarker: {
    backgroundColor: COLORS.background,
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  coordsInfo: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    opacity: 0.9,
  },
  coordsText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
