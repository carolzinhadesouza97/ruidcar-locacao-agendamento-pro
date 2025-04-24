
import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

const NavBar: React.FC = () => {
  const navigate = useNavigate();

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
            onClick={() => navigate('/register-workshop')}
          >
            <User className="w-4 h-4 mr-1" /> 
            Entrar como Oficina
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
