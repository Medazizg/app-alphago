import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { User } from '@/types';

export class UserService {
  static async createUser(uid: string, userData: Omit<User, 'uid'>): Promise<void> {
    try {
      await setDoc(doc(db, 'users', uid), {
        ...userData,
        createdAt: Timestamp.fromDate(userData.createdAt),
      });
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  static async getUser(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data();
      return {
        uid: userDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as User;
    } catch (error) {
      throw new Error(`Failed to get user: ${error}`);
    }
  }

  static async updateUser(uid: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      throw new Error(`Failed to update user: ${error}`);
    }
  }

  static async getAllAdminUsers(): Promise<User[]> {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'admin'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as User[];
    } catch (error) {
      throw new Error(`Failed to get admin users: ${error}`);
    }
  }

  static async isAdmin(uid: string): Promise<boolean> {
    try {
      const user = await this.getUser(uid);
      return user?.role === 'admin';
    } catch {
      return false;
    }
  }
}
