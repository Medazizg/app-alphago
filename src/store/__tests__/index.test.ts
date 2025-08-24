import { useAppStore } from '../index';
import { renderHook, act } from '@testing-library/react-hooks';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('App Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.setUser(null);
      result.current.setLanguage('en');
      result.current.setOrders([]);
      result.current.setLoading(false);
      result.current.setError(null);
    });
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAppStore());
    
    expect(result.current.user).toBeNull();
    expect(result.current.language).toBe('en');
    expect(result.current.orders).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update user state', () => {
    const { result } = renderHook(() => useAppStore());
    const testUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'user' as const,
      createdAt: new Date(),
    };

    act(() => {
      result.current.setUser(testUser);
    });

    expect(result.current.user).toEqual(testUser);
  });

  it('should update language state', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setLanguage('fr');
    });

    expect(result.current.language).toBe('fr');
  });

  it('should update orders state', () => {
    const { result } = renderHook(() => useAppStore());
    const testOrders = [
      {
        id: '1',
        customerName: 'John Doe',
        customerPhone: '12345678',
        zoneCode: 'TUNIS_CENTRE',
        zoneName: 'Tunis Centre',
        coords: { lat: 36.8065, lng: 10.1815 },
        priceTND: 25.5,
        status: 'pending' as const,
        createdBy: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    act(() => {
      result.current.setOrders(testOrders);
    });

    expect(result.current.orders).toEqual(testOrders);
  });

  it('should update loading state', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.loading).toBe(true);
  });

  it('should update error state', () => {
    const { result } = renderHook(() => useAppStore());
    const testError = 'Something went wrong';

    act(() => {
      result.current.setError(testError);
    });

    expect(result.current.error).toBe(testError);
  });
});
