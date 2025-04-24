
import React from 'react';
import { Workshop } from '@/data/workshops';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StarIcon, MapPin, Phone, Clock, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface WorkshopDetailsProps {
  workshop: Workshop;
  onBack: () => void;
  onSchedule: () => void;
}

const WorkshopDetails: React.FC<WorkshopDetailsProps> = ({ workshop, onBack, onSchedule }) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-fit -ml-2 text-brand-gray" 
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        <div className="flex justify-between items-start mt-2">
          <CardTitle className="text-xl font-semibold text-brand-gray">{workshop.name}</CardTitle>
          <div className="flex items-center">
            <StarIcon className="w-5 h-5 text-yellow-500 mr-1" fill="currentColor" />
            <span className="font-medium">{workshop.rating}</span>
          </div>
        </div>
        <CardDescription className="flex items-center text-base">
          <MapPin className="w-4 h-4 mr-1 text-brand-gray" />
          {workshop.address}, {workshop.city} - {workshop.state}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-2">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-brand-gray" />
                <span>{workshop.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-brand-gray" />
                <span className="text-sm">{workshop.email}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-brand-gray" />
                <span>
                  <strong>Seg-Sex:</strong> {workshop.openHours.weekdays}
                </span>
              </div>
              <div className="flex items-start sm:items-center">
                <Clock className="w-4 h-4 mr-2 text-brand-gray invisible" />
                <div className="space-y-1">
                  <div><strong>Sábado:</strong> {workshop.openHours.saturday}</div>
                  <div><strong>Domingo:</strong> {workshop.openHours.sunday}</div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-3">
            <h3 className="font-semibold text-brand-gray">Tabela de Preços</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Card className="bg-muted">
                <CardContent className="p-3">
                  <p className="font-medium">Carros Populares</p>
                  <p className="text-lg font-bold text-brand-orange">R$ {workshop.pricePopular.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card className="bg-muted">
                <CardContent className="p-3">
                  <p className="font-medium">Carros Médios</p>
                  <p className="text-lg font-bold text-brand-orange">R$ {workshop.priceMedium.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card className="bg-muted">
                <CardContent className="p-3">
                  <p className="font-medium">Importados</p>
                  <p className="text-lg font-bold text-brand-orange">R$ {workshop.priceImported.toFixed(2)}</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Button 
            onClick={onSchedule}
            className="w-full mt-4 bg-brand-orange hover:bg-opacity-90"
          >
            Agendar Serviço
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkshopDetails;
