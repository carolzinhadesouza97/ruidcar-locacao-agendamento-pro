
import React, { useEffect, useState } from 'react';
import { Workshop } from '@/data/workshops';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { findNearestWorkshops } from '@/utils/distance';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const workshopIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface WorkshopMapProps {
  onSelectWorkshop: (workshop: Workshop) => void;
  workshops: Workshop[];
  onSchedule: () => void;
  onUpdateNearestWorkshops?: (workshops: Workshop[]) => void;
}

// Component to handle map center updates
const MapUpdater: React.FC<{ center: L.LatLngExpression; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

const WorkshopMap: React.FC<WorkshopMapProps> = ({
  onSelectWorkshop,
  workshops,
  onSchedule,
  onUpdateNearestWorkshops
}) => {
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
  const [displayedWorkshops, setDisplayedWorkshops] = useState<Workshop[]>(workshops);
  const [showAllWorkshops, setShowAllWorkshops] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const defaultCenter: L.LatLngExpression = [-15.77972, -47.92972];
  const isMobile = useIsMobile();

  const handleLocateWorkshops = () => {
    setIsLocating(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = L.latLng(position.coords.latitude, position.coords.longitude);
          setUserLocation(userLoc);
          
          const nearest = findNearestWorkshops(workshops, userLoc.lat, userLoc.lng, 5);
          
          if (onUpdateNearestWorkshops) {
            onUpdateNearestWorkshops(nearest);
          }
          
          setDisplayedWorkshops(nearest);
          setShowAllWorkshops(false);
          
          setIsLocating(false);
          toast.success('Oficinas próximas encontradas!');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Não foi possível obter sua localização');
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    } else {
      toast.error('Geolocalização não suportada pelo seu navegador');
      setIsLocating(false);
    }
  };

  const toggleWorkshopsDisplay = () => {
    if (showAllWorkshops) {
      if (userLocation) {
        const nearest = findNearestWorkshops(workshops, userLocation.lat, userLocation.lng, 5);
        setDisplayedWorkshops(nearest);
        if (onUpdateNearestWorkshops) {
          onUpdateNearestWorkshops(nearest);
        }
      }
    } else {
      setDisplayedWorkshops(workshops);
      if (onUpdateNearestWorkshops) {
        onUpdateNearestWorkshops(workshops);
      }
    }
    setShowAllWorkshops(!showAllWorkshops);
  };

  useEffect(() => {
    setDisplayedWorkshops(workshops);
  }, [workshops]);

  return (
    <div className="h-full w-full relative">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {userLocation && (
          <Button 
            onClick={toggleWorkshopsDisplay}
            className="bg-brand-orange hover:bg-opacity-90 text-white flex items-center gap-2 shadow-lg"
            size={isMobile ? "sm" : "default"}
          >
            {showAllWorkshops ? 'Mostrar 5 Mais Próximas' : 'Mostrar Todas'}
          </Button>
        )}
        <Button 
          onClick={handleLocateWorkshops}
          className="bg-brand-orange hover:bg-opacity-90 text-white flex items-center gap-2 shadow-lg"
          disabled={isLocating}
          size={isMobile ? "sm" : "default"}
        >
          <Navigation className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
          {isLocating ? 'Localizando...' : 'Localizar Oficinas'}
        </Button>
      </div>
      
      <MapContainer
        style={{ width: '100%', height: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater 
          center={userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter} 
          zoom={userLocation ? 12 : 5}
        />

        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]}
          >
            <Popup>Sua localização</Popup>
          </Marker>
        )}

        {displayedWorkshops.map((workshop) => (
          <Marker
            key={workshop.id}
            position={[workshop.lat, workshop.lng]}
            eventHandlers={{
              click: () => onSelectWorkshop(workshop),
            }}
          >
            <Popup>
              <div className="p-1 max-w-[200px] xs:max-w-xs sm:p-2">
                <h3 className="font-semibold text-sm sm:mb-2">{workshop.name}</h3>
                <p className="text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2">{workshop.address}</p>
                <p className="text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2">{workshop.phone || 'Telefone não disponível'}</p>
                {workshop.distance && (
                  <p className="text-xs sm:text-sm text-brand-orange">
                    {workshop.distance.toFixed(1)} km de distância
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default WorkshopMap;
