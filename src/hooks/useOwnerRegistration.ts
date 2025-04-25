
import { useState } from 'react';
import { RegisterOwnerFormValues } from '@/schemas/ownerSchema';
import { toast } from 'sonner';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useOwnerRegistration = () => {
  const { signUpWithEmail, signInWithGoogle } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (data: RegisterOwnerFormValues) => {
    setIsLoading(true);
    try {
      await signUpWithEmail(data.email, data.password, {
        name: data.name,
        role: 'oficina',
      });
      
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleRegister,
    handleSignInWithGoogle,
  };
};
