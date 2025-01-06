import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential,
  AuthError
} from 'firebase/auth';
import { auth, firestore } from '../lib/firebase';
import { DEFAULT_ROLES } from '../config/permissions';
import { assignAdminRole } from './db/initService';

export class AuthenticationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: AuthError
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export async function signIn(email: string, password: string): Promise<UserCredential> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // For the specific admin email, ensure they have admin role
    if (email === 'aoumerzouk@hotmail.com') {
      await assignAdminRole();
    }
    
    return userCredential;
  } catch (error) {
    const authError = error as AuthError;
    
    switch (authError.code) {
      case 'auth/invalid-email':
        throw new AuthenticationError('Invalid email address', 'INVALID_EMAIL', authError);
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        throw new AuthenticationError('Invalid email or password', 'INVALID_CREDENTIALS', authError);
      case 'auth/too-many-requests':
        throw new AuthenticationError('Too many failed attempts. Please try again later.', 'TOO_MANY_ATTEMPTS', authError);
      default:
        throw new AuthenticationError(
          'An unexpected error occurred. Please try again.',
          'UNKNOWN_ERROR',
          authError
        );
    }
  }
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw new AuthenticationError(
      'Failed to sign out. Please try again.',
      'SIGN_OUT_ERROR',
      error as AuthError
    );
  }
}