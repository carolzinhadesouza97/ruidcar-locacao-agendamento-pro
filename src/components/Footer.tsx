
import React from 'react';
import { Separator } from '@/components/ui/separator';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white">
      <div className="container py-6">
        <Separator className="mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg text-brand-orange mb-2">RUIDCAR</h3>
            <p className="text-sm text-brand-gray">
              Sistema de agendamento e localização de oficinas mecânicas em todo o Brasil.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-brand-gray mb-2">Links Rápidos</h4>
            <ul className="space-y-1">
              <li>
                <a href="#" className="text-sm text-brand-gray hover:text-brand-orange">
                  Encontrar Oficinas
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-brand-gray hover:text-brand-orange">
                  Cadastrar Oficina
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-brand-gray hover:text-brand-orange">
                  Área da Oficina
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-brand-gray mb-2">Atendimento</h4>
            <p className="text-sm text-brand-gray mb-1">
              suporte@ruidcar.com.br
            </p>
            <p className="text-sm text-brand-gray">
              (11) 3456-7890
            </p>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="text-center text-sm text-brand-gray">
          © {currentYear} RUIDCAR. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
