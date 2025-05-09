
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Define a helper to extract auth parameters from URL if present
    const getParametersFromURL = () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      return {
        accessToken: params.get('access_token'),
        refreshToken: params.get('refresh_token'),
        type: params.get('type'),
      };
    };

    // Check if we have auth tokens in the URL (from email verification)
    const { accessToken, refreshToken, type } = getParametersFromURL();
    
    const handleURLParameters = async () => {
      // If we have auth tokens in URL, set the session
      if (accessToken && type === 'recovery') {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });
          
          if (error) throw error;
          navigate('/reset-password');
          return;
        } catch (error) {
          console.error('Erro ao processar token de autenticação:', error);
          setLoading(false);
        }
      } else if (accessToken) {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });
          
          if (error) throw error;
        } catch (error) {
          console.error('Erro ao processar token de autenticação:', error);
        }
      }
    };

    const handleAuthStateChange = (event: string) => {
      if (event === 'SIGNED_IN') {
        toast.success('Email verificado com sucesso!');
        navigate('/dashboard');
      }
    };

    // Check for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      handleAuthStateChange
    );

    // Process URL parameters if present
    handleURLParameters();

    // Check if already authenticated
    const checkExistingSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      } else {
        setLoading(false);
      }
    };

    checkExistingSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-center mb-4">Verificação de Email</h1>
          
          {loading ? (
            <p className="text-center">Verificando...</p>
          ) : (
            <div className="space-y-4">
              <p className="text-center">
                Um email de verificação foi enviado para o seu endereço de email.
                Por favor, verifique sua caixa de entrada e clique no link de verificação.
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Não recebeu o email? Verifique sua pasta de spam ou tente novamente.
              </p>
              <div className="flex justify-center">
                <button 
                  onClick={() => navigate('/')}
                  className="text-blue-500 hover:underline"
                >
                  Voltar para a página inicial
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyEmail;
