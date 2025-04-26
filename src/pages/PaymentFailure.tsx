
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <X className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle>Falha no Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Houve um problema ao processar seu pagamento. Por favor, tente novamente.
          </p>
          <Button onClick={() => navigate('/')}>
            Voltar para a página inicial
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailure;
