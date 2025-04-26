
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Appointment } from '@/data/appointments';
import { toast } from 'sonner';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentData: Partial<Appointment>;
  workshopName: string;
  diagnosticValue: number;
}

export const PaymentDialog = ({
  isOpen,
  onClose,
  appointmentData,
  workshopName,
  diagnosticValue,
}: PaymentDialogProps) => {
  const handlePayment = async () => {
    try {
      const response = await fetch(
        'https://vtqavoujjwgkiyhcjuip.supabase.co/functions/v1/create-payment',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workshopName,
            appointmentData,
            diagnosticValue,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao processar pagamento');
      }

      const { initPoint } = await response.json();
      window.location.href = initPoint;
    } catch (error) {
      console.error('Erro ao criar preferência de pagamento:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmação de Pagamento</DialogTitle>
          <DialogDescription>
            Para confirmar seu agendamento, é necessário realizar o pagamento do diagnóstico.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <div className="flex justify-between items-center">
              <span>Valor do diagnóstico:</span>
              <span className="font-semibold text-lg">
                R$ {diagnosticValue.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handlePayment}>
              Pagar com Mercado Pago
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
