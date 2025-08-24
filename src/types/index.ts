export interface User {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  photoURL?: string;
  role: 'user' | 'admin';
  zoneCode?: string;
  createdAt: Date;
}

export interface Order {
  id?: string;
  customerName: string;
  customerPhone: string;
  zoneCode: string;
  zoneName: string;
  coords: {
    lat: number;
    lng: number;
  };
  priceTND: number;
  items?: string[];
  note?: string;
  status: 'pending' | 'in_progress' | 'done' | 'cancelled';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Zone {
  code: string;
  name: string;
  center: {
    lat: number;
    lng: number;
  };
  polygon?: any; // GeoJSON polygon
}

export interface AdminAnalytics {
  totalOrdersToday: number;
  pendingOrders: number;
  completedOrders: number;
  revenueTND: number;
  ordersPerDay: { date: string; count: number }[];
  topZones: { zone: string; count: number }[];
}

export type Language = 'en' | 'fr';

export interface AppState {
  user: User | null;
  language: Language;
  isLoading: boolean;
  error: string | null;
}

export type RootStackParamList = {
  Splash: undefined;
  LanguageSelector: undefined;
  Auth: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
  OrderDetail: { orderId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Orders: undefined;
  Settings: undefined;
  AdminDashboard: undefined;
  AdminOrders: undefined;
  AdminAnalytics: undefined;
  AdminUsers: undefined;
};
