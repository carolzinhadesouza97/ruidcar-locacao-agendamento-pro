
import React, { useEffect, useState } from 'react';
import { Workshop } from '@/data/workshops';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'sonner';

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
  const [nearestWorkshops, setNearestWorkshops] = useState<Workshop[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const defaultCenter: L.LatLngExpression = [-15.77972, -47.92972];

  const findNearestWorkshops = (location: L.LatLng) => {
    const workshopsWithDistance = workshops.map(workshop => ({
      ...workshop,
      distance: L.latLng(workshop.lat, workshop.lng).distanceTo(location) / 1000
    }));

    return workshopsWithDistance
      .filter(w => w.distance <= 100) // Filter workshops within 100km
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  };

  const handleLocateWorkshops = () => {
    setIsLocating(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = L.latLng(position.coords.latitude, position.coords.longitude);
          setUserLocation(userLoc);
          
          const nearest = findNearestWorkshops(userLoc);
          setNearestWorkshops(nearest);
          
          if (onUpdateNearestWorkshops) {
            onUpdateNearestWorkshops(nearest);
          }
          
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

  // Auto-locate on component mount
  useEffect(() => {
    handleLocateWorkshops();
  }, []);

  return (
    <div className="h-full w-full relative">
      <div className="absolute top-4 right-4 z-10">
        <Button 
          onClick={handleLocateWorkshops}
          className="bg-brand-orange hover:bg-opacity-90 text-white flex items-center gap-2 shadow-lg"
          disabled={isLocating}
        >
          <Navigation className="w-4 h-4" />
          {isLocating ? 'Localizando...' : 'Localizar Oficinas'}
        </Button>
      </div>
      
      <MapContainer
        center={defaultCenter}
        zoom={5}
        style={{ width: '100%', height: '100%' }}
        className="z-0"
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapUpdater 
          center={userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter} 
          zoom={userLocation ? 12 : 5}
        />

        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
          >
            <Popup>Sua localização</Popup>
          </Marker>
        )}

        {workshops.map((workshop) => (
          <Marker
            key={workshop.id}
            position={[workshop.lat, workshop.lng]}
            icon={workshopIcon}
            eventHandlers={{
              click: () => onSelectWorkshop(workshop),
            }}
          >
            <Popup>
              <div className="p-2 max-w-xs">
                <h3 className="font-semibold mb-2">{workshop.name}</h3>
                <p className="text-sm text-gray-700 mb-2">{workshop.address}</p>
                <p className="text-sm text-gray-700 mb-2">{workshop.phone || 'Telefone não disponível'}</p>
                {workshop.distance && (
                  <p className="text-sm text-brand-orange">
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
