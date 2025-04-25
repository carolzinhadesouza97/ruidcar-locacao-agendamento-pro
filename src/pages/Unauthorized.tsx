
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-sm text-center">
          <div className="flex justify-center mb-4">
            <ShieldAlert className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Acesso Não Autorizado</h1>
          <p className="mb-6 text-gray-600">
            Você não possui permissão para acessar esta página. 
            Se você acredita que isso é um erro, entre em contato com um administrador.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')} 
              variant="default" 
              className="w-full"
            >
              Voltar à página inicial
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="outline" 
              className="w-full"
            >
              Ir para o dashboard
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Unauthorized;
