
import React, { createContext, useContext } from 'react';
import { useAuth as useAuthHook, UserProfile } from '@/hooks/useAuth'; // Rename hook import
import type { Session, User } from '@supabase/supabase-js'; // Import Session type

// Define the context type with specific types
interface AuthContextType {
  user: UserProfile | null;
  session: Session | null; // Use Session type instead of any
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<User | null>; // Use User type
  signUpWithEmail: (email: string, password: string, userData?: Record<string, any>) => Promise<User | null>; // Use User type
  resetPassword: (email: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthHook(); // Use renamed hook import
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

