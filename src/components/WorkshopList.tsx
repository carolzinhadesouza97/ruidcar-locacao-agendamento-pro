
import React from 'react';
import { Workshop } from '@/data/workshops';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarIcon, MapPin, Phone, Clock, ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface WorkshopListProps {
  workshops: Workshop[];
  onSelectWorkshop: (workshop: Workshop) => void;
  selectedWorkshop?: Workshop;
}

const WorkshopList: React.FC<WorkshopListProps> = ({ 
  workshops, 
  onSelectWorkshop, 
  selectedWorkshop 
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredWorkshops = React.useMemo(() => {
    if (!searchTerm.trim()) return workshops;
    
    const term = searchTerm.toLowerCase().trim();
    return workshops.filter(
      workshop => 
        workshop.name.toLowerCase().includes(term) || 
        workshop.city.toLowerCase().includes(term) ||
        workshop.state.toLowerCase().includes(term)
    );
  }, [workshops, searchTerm]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-brand-gray">
          {workshops.length > 0 
            ? `Oficinas${workshops[0].distance ? ' próximas' : ''}`
            : 'Nenhuma oficina encontrada'}
        </h2>
        <span className="text-sm text-muted-foreground">
          {filteredWorkshops.length} {filteredWorkshops.length === 1 ? 'resultado' : 'resultados'}
        </span>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar por nome ou cidade..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredWorkshops.map((workshop) => (
        <Card 
          key={workshop.id} 
          className={`card-workshop transition-all cursor-pointer ${
            selectedWorkshop?.id === workshop.id ? 'ring-2 ring-brand-orange' : ''
          }`}
          onClick={() => onSelectWorkshop(workshop)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-semibold text-brand-gray">{workshop.name}</CardTitle>
              <div className="flex items-center">
                <StarIcon className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" />
                <span className="text-brand-gray">{workshop.rating}</span>
              </div>
            </div>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1 text-brand-gray" />
              {workshop.address}, {workshop.city} - {workshop.state}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-brand-gray" />
                <span className="text-sm">{workshop.phone}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-brand-gray" />
                <span className="text-sm">
                  {workshop.openHours.weekdays} (seg-sex)
                </span>
              </div>
              {workshop.distance !== undefined && (
                <Badge variant="outline" className="w-fit bg-brand-orange/10 text-brand-orange border-brand-orange">
                  {workshop.distance.toFixed(1)} km de distância
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-2 flex justify-between items-center">
            <div className="text-sm text-brand-gray">
              <span className="font-semibold text-brand-orange">R$ {workshop.price_popular}</span> popular
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={(e) => {
                e.stopPropagation();
                onSelectWorkshop(workshop);
              }}
              className="text-brand-orange hover:text-brand-orange hover:bg-brand-orange/10"
            >
              Agendar <ArrowRight className="ml-1 w-3 h-3" />
            </Button>
          </CardFooter>
        </Card>
      ))}

      {filteredWorkshops.length === 0 && (
        <Card className="card-workshop border-dashed">
          <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-center text-muted-foreground">
              {searchTerm ? 'Nenhuma oficina encontrada com esse termo' : 'Use o botão "Localizar Oficinas" no mapa para encontrar oficinas perto de você'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkshopList;
