import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import * as authService from '../services/authService';
import type { AuthenticationError } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: AuthenticationError | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthenticationError | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        setError(new authService.AuthenticationError(
          'Authentication state error',
          'AUTH_STATE_ERROR',
          error
        ));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await authService.signIn(email, password);
    } catch (err) {
      setError(err as AuthenticationError);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch (err) {
      setError(err as AuthenticationError);
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      signIn,
      signOut,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}