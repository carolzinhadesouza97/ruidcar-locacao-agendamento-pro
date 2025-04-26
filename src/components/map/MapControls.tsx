
import React from 'react';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { LatLng } from 'leaflet';

interface MapControlsProps {
  userLocation: LatLng | null;
  showAllWorkshops: boolean;
  isLocating: boolean;
  onToggleDisplay: () => void;
  onLocate: () => void;
  isMobile: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({
  userLocation,
  showAllWorkshops,
  isLocating,
  onToggleDisplay,
  onLocate,
  isMobile
}) => {
  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2">
      {userLocation && (
        <Button 
          onClick={onToggleDisplay}
          className="bg-brand-orange hover:bg-opacity-90 text-white flex items-center gap-2 shadow-lg"
          size={isMobile ? "sm" : "default"}
        >
          {showAllWorkshops ? 'Mostrar 5 Mais Próximas' : 'Mostrar Todas'}
        </Button>
      )}
      <Button 
        onClick={onLocate}
        className="bg-brand-orange hover:bg-opacity-90 text-white flex items-center gap-2 shadow-lg"
        disabled={isLocating}
        size={isMobile ? "sm" : "default"}
      >
        <Navigation className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
        {isLocating ? 'Localizando...' : 'Localizar Oficinas'}
      </Button>
    </div>
  );
};

export default MapControls;
