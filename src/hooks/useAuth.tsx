import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { Session, User } from '@supabase/supabase-js';

const BASE_URL = import.meta.env.VITE_APP_URL;

if (!BASE_URL) {
  console.warn("Missing environment variable: VITE_APP_URL. Using current origin as fallback for redirects.");
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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
        
        if (event === 'SIGNED_IN') {
          toast.success('Login realizado com sucesso!');
        } else if (event === 'SIGNED_OUT') {
          toast.info('Você saiu da sua conta');
        } else if (event === 'PASSWORD_RECOVERY') {
          if (window.location.pathname !== '/reset-password') {
             navigate('/reset-password');
          }
        } else if (event === 'USER_UPDATED') {
          toast.success('Usuário atualizado com sucesso!');
        }
      }
    );

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
      
    } catch (error: any) {
      console.error('Erro ao fazer login com Google:', error);
      toast.error(error.message || 'Erro ao fazer login com Google');
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
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, userData?: Record<string, any>): Promise<User | null> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success('Cadastro realizado com sucesso!');
        return data.user;
      }
      
      return null;
      
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);
      
      let errorMessage = 'Erro ao cadastrar';
      if (error.message.includes('already registered')) {
        errorMessage = 'Este email já está cadastrado. Tente fazer login.';
      }
      
      toast.error(errorMessage);
      throw error;
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
      return false;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
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
