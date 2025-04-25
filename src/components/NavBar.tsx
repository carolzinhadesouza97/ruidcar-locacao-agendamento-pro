
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LoginModal } from '@/components/auth/LoginModal';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-brand-gray"
            onClick={() => setIsLoginModalOpen(true)}
          >
            <User className="w-4 h-4 mr-1" /> 
            Entrar como Oficina
          </Button>

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
