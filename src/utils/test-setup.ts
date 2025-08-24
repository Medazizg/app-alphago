import 'react-native-gesture-handler/jestSetup';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  const MockMapView = (props: any) => View(props);
  const MockMarker = (props: any) => View(props);
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    PROVIDER_GOOGLE: 'google',
  };
});

// Mock expo modules
jest.mock('expo-font');
jest.mock('expo-splash-screen');
jest.mock('expo-location');
jest.mock('expo-image-picker');

// Mock Firebase
jest.mock('@/services/firebase', () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    currentUser: null,
  },
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        onSnapshot: jest.fn(),
      })),
      where: jest.fn(() => ({
        get: jest.fn(),
        onSnapshot: jest.fn(),
      })),
      orderBy: jest.fn(() => ({
        get: jest.fn(),
        onSnapshot: jest.fn(),
      })),
      add: jest.fn(),
    })),
  },
  storage: {
    ref: jest.fn(() => ({
      put: jest.fn(),
      getDownloadURL: jest.fn(),
    })),
  },
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
  I18nextProvider: ({ children }: any) => children,
}));

// Mock zustand store
jest.mock('@/store', () => ({
  useAppStore: jest.fn(() => ({
    user: null,
    language: 'en',
    orders: [],
    loading: false,
    error: null,
    setUser: jest.fn(),
    setLanguage: jest.fn(),
    setOrders: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
  })),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock NetInfo
jest.mock('@react-native-netinfo/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
  addEventListener: jest.fn(),
}));
