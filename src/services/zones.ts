import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import { Zone } from '@/types';

export class ZoneService {
  static async getAllZones(): Promise<Zone[]> {
    try {
      const q = query(collection(db, 'zones'), orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        code: doc.id,
        ...doc.data(),
      })) as Zone[];
    } catch (error) {
      throw new Error(`Failed to get zones: ${error}`);
    }
  }

  static async getZone(zoneCode: string): Promise<Zone | null> {
    try {
      const zoneDoc = await getDoc(doc(db, 'zones', zoneCode));
      if (!zoneDoc.exists()) {
        return null;
      }

      return {
        code: zoneDoc.id,
        ...zoneDoc.data(),
      } as Zone;
    } catch (error) {
      throw new Error(`Failed to get zone: ${error}`);
    }
  }

  static async createOrUpdateZone(zone: Zone): Promise<void> {
    try {
      const { code, ...zoneData } = zone;
      await setDoc(doc(db, 'zones', code), zoneData);
    } catch (error) {
      throw new Error(`Failed to create/update zone: ${error}`);
    }
  }

  // Initialize default zones for Tunisia
  static async initializeDefaultZones(): Promise<void> {
    const defaultZones: Zone[] = [
      {
        code: 'TUNIS_CENTRE',
        name: 'Tunis Centre',
        center: { lat: 36.8065, lng: 10.1815 },
      },
      {
        code: 'ARIANA',
        name: 'Ariana',
        center: { lat: 36.8625, lng: 10.1957 },
      },
      {
        code: 'SFAX',
        name: 'Sfax',
        center: { lat: 34.7406, lng: 10.7603 },
      },
      {
        code: 'SOUSSE',
        name: 'Sousse',
        center: { lat: 35.8245, lng: 10.6411 },
      },
      {
        code: 'BIZERTE',
        name: 'Bizerte',
        center: { lat: 37.2744, lng: 9.8739 },
      },
      {
        code: 'GABES',
        name: 'Gabès',
        center: { lat: 33.8815, lng: 10.0982 },
      },
    ];

    try {
      for (const zone of defaultZones) {
        await this.createOrUpdateZone(zone);
      }
    } catch (error) {
      console.error('Failed to initialize default zones:', error);
    }
  }
}
