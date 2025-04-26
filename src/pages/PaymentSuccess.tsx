
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { createAppointment } from '@/data/appointments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const externalReference = searchParams.get('external_reference');

  useEffect(() => {
    const createAppointmentFromPayment = async () => {
      if (!externalReference) {
        toast.error('Dados do agendamento não encontrados');
        return;
      }

      try {
        const appointmentData = JSON.parse(externalReference);
        await createAppointment(appointmentData);
        toast.success('Agendamento confirmado com sucesso!');
      } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        toast.error('Erro ao confirmar agendamento');
      }
    };

    createAppointmentFromPayment();
  }, [externalReference]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckIcon className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle>Pagamento Confirmado!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Seu agendamento foi confirmado com sucesso.
          </p>
          <Button onClick={() => navigate('/')}>
            Voltar para a página inicial
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
