
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LoginModal } from '@/components/auth/LoginModal';
import { supabase } from '@/integrations/supabase/client';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    
    checkUser();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        if (event === 'SIGNED_OUT') {
          navigate('/');
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <header className="border-b bg-white">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="font-bold text-2xl text-brand-orange cursor-pointer" onClick={() => navigate('/')}>
            RUIDCAR
          </div>
          <div className="text-brand-gray text-sm hidden sm:block">Oficinas</div>
        </div>
        
        <div className="flex items-center gap-2">
          {!loading && (
            user ? (
              <Button 
                variant="default" 
                onClick={() => navigate('/dashboard')}
              >
                <User className="w-4 h-4 mr-1" /> 
                Acessar Dashboard
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-brand-gray"
                onClick={() => setIsLoginModalOpen(true)}
              >
                <User className="w-4 h-4 mr-1" /> 
                Entrar como Oficina
              </Button>
            )
          )}

          <LoginModal 
            isOpen={isLoginModalOpen} 
            onClose={() => setIsLoginModalOpen(false)} 
          />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
