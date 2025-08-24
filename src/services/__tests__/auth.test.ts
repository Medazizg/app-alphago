import { AuthService } from '../auth';
import { auth, db } from '../firebase';

// Mock Firebase modules
jest.mock('../firebase', () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    signOut: jest.fn(),
    currentUser: null,
  },
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
      })),
      where: jest.fn(() => ({
        get: jest.fn(),
      })),
    })),
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should successfully login a user', async () => {
      const mockUser = { uid: '123', email: 'test@example.com' };
      const mockUserDoc = { exists: true, data: () => ({ role: 'user' }) };
      
      (auth.signInWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: mockUser });
      (db.collection as jest.Mock).mockReturnValue({
        doc: jest.fn(() => ({
          get: jest.fn().mockResolvedValue(mockUserDoc),
        })),
      });

      const result = await AuthService.loginUser('test@example.com', 'password');
      
      expect(auth.signInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password');
      expect(result).toEqual({ uid: '123', email: 'test@example.com', role: 'user' });
    });

    it('should throw error for invalid credentials', async () => {
      (auth.signInWithEmailAndPassword as jest.Mock).mockRejectedValue(
        new Error('auth/wrong-password')
      );

      await expect(AuthService.loginUser('test@example.com', 'wrong')).rejects.toThrow();
    });
  });

  describe('registerUser', () => {
    it('should successfully register a new user', async () => {
      const mockUser = { uid: '123', email: 'new@example.com' };
      const userData = {
        displayName: 'Test User',
        email: 'new@example.com',
        phoneNumber: '12345678',
        zoneCode: 'TUNIS_CENTRE',
      };

      (auth.createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: mockUser });
      (db.collection as jest.Mock).mockReturnValue({
        doc: jest.fn(() => ({
          set: jest.fn().mockResolvedValue(undefined),
        })),
      });

      const result = await AuthService.registerUser(userData, 'password');
      
      expect(auth.createUserWithEmailAndPassword).toHaveBeenCalledWith('new@example.com', 'password');
      expect(result).toEqual({ uid: '123', email: 'new@example.com', role: 'user' });
    });
  });

  describe('resetPassword', () => {
    it('should send password reset email', async () => {
      (auth.sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);

      await AuthService.resetPassword('test@example.com');
      
      expect(auth.sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('logout', () => {
    it('should sign out user', async () => {
      (auth.signOut as jest.Mock).mockResolvedValue(undefined);

      await AuthService.logout();
      
      expect(auth.signOut).toHaveBeenCalled();
    });
  });
});
