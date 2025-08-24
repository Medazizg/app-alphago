import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';

export class AuthService {
  static async signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  static async signUp(
    email: string, 
    password: string, 
    displayName: string
  ): Promise<UserCredential> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile
    await updateProfile(credential.user, {
      displayName: displayName
    });
    
    return credential;
  }

  static async signOut(): Promise<void> {
    return signOut(auth);
  }

  static async resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(auth, email);
  }

  static onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Admin login with predefined credentials
  static async adminSignIn(username: string, password: string): Promise<UserCredential> {
    // Admin accounts use email format: admin-{username}@alphago.app
    const adminEmail = `admin-${username}@alphago.app`;
    return signInWithEmailAndPassword(auth, adminEmail, password);
  }
}
