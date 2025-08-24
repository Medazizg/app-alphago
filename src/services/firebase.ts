import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDZqkM9KCpau_rfftHyW7gVR8H_C_3SSo",
  authDomain: "alphago-639e0.firebaseapp.com",
  projectId: "alphago-639e0",
  storageBucket: "alphago-639e0.firebasestorage.app",
  messagingSenderId: "1031623248712",
  appId: "1:1031623248712:web:ed159d6b1905f72861017d",
  measurementId: "G-NTYTH98W1R"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);

export const enableOffline = () => disableNetwork(db);
export const enableOnline = () => enableNetwork(db);
