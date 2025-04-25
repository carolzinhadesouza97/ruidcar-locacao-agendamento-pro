
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { RegisterOwnerFormValues } from '@/schemas/ownerSchema';
import { toast } from 'sonner';

export const useOwnerRegistration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    
    checkUser();
  }, [navigate]);

  const handleRegister = async (data: RegisterOwnerFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: 'oficina',
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      });
      
      if (error) throw error;
      
      toast.success('Cadastro realizado com sucesso! Você será redirecionado para o dashboard.');
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);
      let errorMessage = 'Erro ao cadastrar';
      
      if (error.message.includes('already exists')) {
        errorMessage = 'Este email já está cadastrado. Tente fazer login.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Erro ao cadastrar com Google:', error);
      toast.error(error.message || 'Erro ao cadastrar com Google');
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleRegister,
    handleSignInWithGoogle,
  };
};
