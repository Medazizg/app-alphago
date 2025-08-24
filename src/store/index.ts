import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Language, Order } from '@/types';

interface AppState {
  // User & Auth
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // App Settings
  language: Language;
  
  // Orders
  orders: Order[];
  selectedOrder: Order | null;
  
  // Error handling
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setLanguage: (language: Language) => void;
  setOrders: (orders: Order[]) => void;
  setSelectedOrder: (order: Order | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  language: 'en' as Language,
  orders: [],
  selectedOrder: null,
  error: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        });
      },
      
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },
      
      setLanguage: (language: Language) => {
        set({ language });
      },
      
      setOrders: (orders: Order[]) => {
        set({ orders });
      },
      
      setSelectedOrder: (selectedOrder: Order | null) => {
        set({ selectedOrder });
      },
      
      setError: (error: string | null) => {
        set({ error });
      },
      
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'alphago-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        language: state.language,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
