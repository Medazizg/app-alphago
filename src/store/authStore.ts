import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '@/types';
import { AuthService } from '@/services/auth';
import { UserService } from '@/services/users';

interface AuthState {
  user: FirebaseUser | null;
  userProfile: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // Actions
  setUser: (user: FirebaseUser | null) => void;
  setUserProfile: (profile: User | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Omit<User, 'uid'>) => Promise<void>;
  adminSignIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loadUserProfile: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userProfile: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isAdmin: false 
  }),

  setUserProfile: (userProfile) => set({ 
    userProfile,
    isAdmin: userProfile?.role === 'admin' 
  }),

  setLoading: (isLoading) => set({ isLoading }),

  signIn: async (email, password) => {
    try {
      set({ isLoading: true });
      const credential = await AuthService.signIn(email, password);
      const userProfile = await UserService.getUser(credential.user.uid);
      
      set({
        user: credential.user,
        userProfile,
        isAuthenticated: true,
        isAdmin: userProfile?.role === 'admin',
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signUp: async (email, password, userData) => {
    try {
      set({ isLoading: true });
      const credential = await AuthService.signUp(email, password, userData.displayName);
      
      // Create user profile in Firestore
      await UserService.createUser(credential.user.uid, userData);
      const userProfile = await UserService.getUser(credential.user.uid);
      
      set({
        user: credential.user,
        userProfile,
        isAuthenticated: true,
        isAdmin: false,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  adminSignIn: async (username, password) => {
    try {
      set({ isLoading: true });
      const credential = await AuthService.adminSignIn(username, password);
      const userProfile = await UserService.getUser(credential.user.uid);
      
      if (userProfile?.role !== 'admin') {
        throw new Error('Access denied: Admin privileges required');
      }
      
      set({
        user: credential.user,
        userProfile,
        isAuthenticated: true,
        isAdmin: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      await AuthService.signOut();
      set({
        user: null,
        userProfile: null,
        isAuthenticated: false,
        isAdmin: false,
      });
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (email) => {
    await AuthService.resetPassword(email);
  },

  loadUserProfile: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const userProfile = await UserService.getUser(user.uid);
      set({ 
        userProfile,
        isAdmin: userProfile?.role === 'admin' 
      });
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  },

  initialize: () => {
    set({ isLoading: true });
    
    const unsubscribe = AuthService.onAuthStateChanged(async (user) => {
      if (user) {
        const userProfile = await UserService.getUser(user.uid);
        set({
          user,
          userProfile,
          isAuthenticated: true,
          isAdmin: userProfile?.role === 'admin',
          isLoading: false,
        });
      } else {
        set({
          user: null,
          userProfile: null,
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
        });
      }
    });

    return unsubscribe;
  },
}));
