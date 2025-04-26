
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { Session, User } from '@supabase/supabase-js'; // Import Session and User types

// Use the environment variable for the BASE_URL
const BASE_URL = import.meta.env.VITE_APP_URL;

// Validate that the BASE_URL environment variable is set
if (!BASE_URL) {
  console.warn("Missing environment variable: VITE_APP_URL. Using current origin as fallback for redirects.");
  // Optionally, you could throw an error or use window.location.origin as a last resort
  // throw new Error("Missing environment variable: VITE_APP_URL");
}

export type UserRole = 'admin' | 'oficina' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  role?: UserRole;
  name?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null); // Use Session type
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ? {
          id: currentSession.user.id,
          email: currentSession.user.email || '',
          role: (currentSession.user.user_metadata?.role as UserRole) || 'user',
          name: currentSession.user.user_metadata?.name || '',
        } : null);
        setLoading(false);
        
        // Handle specific auth events
        if (event === 'SIGNED_IN') {
          toast.success('Login realizado com sucesso!');
        } else if (event === 'SIGNED_OUT') {
          toast.info('Você saiu da sua conta');
        } else if (event === 'PASSWORD_RECOVERY') {
          // Navigate only if not already on the reset page to avoid loops
          if (window.location.pathname !== '/reset-password') {
             navigate('/reset-password');
          }
        } else if (event === 'USER_UPDATED') {
          toast.success('Usuário atualizado com sucesso!');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ? {
        id: currentSession.user.id,
        email: currentSession.user.email || '',
        role: (currentSession.user.user_metadata?.role as UserRole) || 'user',
        name: currentSession.user.user_metadata?.name || '',
      } : null);
      setLoading(false);
    }).catch(error => {
      console.error("Error getting session:", error);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: `${BASE_URL}/dashboard` 
        }
      });
      
      if (error) throw error;
      // Redirect handled by Supabase OAuth
      
    } catch (error: any) {
      console.error('Erro ao fazer login com Google:', error);
      toast.error(error.message || 'Erro ao fazer login com Google');
      // Re-throw the error if needed for upstream handling
      // throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data.user;
      
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      
      const errorMessage = 
        error.message === 'Invalid login credentials' 
          ? 'Email ou senha incorretos'
          : error.message || 'Erro ao fazer login';
          
      toast.error(errorMessage);
      throw error; // Re-throw to allow calling component to handle failed login
    }
  };

  const signUpWithEmail = async (email: string, password: string, userData?: Record<string, any>): Promise<User | null> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${BASE_URL}/verify`
        }
      });
      
      if (error) throw error;
      
      toast.success('Cadastro realizado! Verifique seu email para continuar.');
      return data.user;
      
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);
      
      let errorMessage = 'Erro ao cadastrar';
      if (error.message.includes('already registered')) {
        errorMessage = 'Este email já está cadastrado. Tente fazer login.';
      } else if (error.message.includes('check your email')) {
        // Handle Supabase email verification requirement message gracefully
        errorMessage = 'Verifique seu email para confirmar o cadastro.';
        toast.info(errorMessage); // Use info instead of error for this case
        return null; // Return null as user is not fully signed up yet
      }
      
      toast.error(errorMessage);
      throw error; // Re-throw for other errors
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${BASE_URL}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
      return true;
      
    } catch (error: any) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      toast.error(error.message || 'Erro ao solicitar recuperação de senha');
      return false; // Indicate failure
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null); // Clear user state immediately
      setSession(null); // Clear session state immediately
      navigate('/');
    } catch (error: any) {
      console.error('Erro ao sair:', error);
      toast.error(error.message || 'Erro ao sair');
    }
  };

  return {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signOut,
  };
};

