
import React, { useEffect, useState } from 'react';
import { Workshop } from '@/data/workshops';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { oficinasRUIDCAR } from '@/data/oficinasRUIDCAR';
import { useMapbox, OficinaWithDistance } from '@/hooks/map/useMapbox';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for workshops
const workshopIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icon for user location
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
const MapUpdater = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const WorkshopMap: React.FC<WorkshopMapProps> = ({ 
  onSelectWorkshop,
  onSchedule,
  workshops,
  onUpdateNearestWorkshops 
}) => {
  const {
    userLocation,
    nearestOficinas,
    nearestWorkshops,
    isLocating,
    handleLocateOficinas
  } = useMapbox();
  
  const [selectedOficina, setSelectedOficina] = useState<OficinaWithDistance | null>(null);

  // Update parent component with nearest workshops when they change
  useEffect(() => {
    if (nearestWorkshops && nearestWorkshops.length > 0 && onUpdateNearestWorkshops) {
      console.log('Updating nearest workshops:', nearestWorkshops);
      onUpdateNearestWorkshops(nearestWorkshops);
    }
  }, [nearestWorkshops, onUpdateNearestWorkshops]);

  // Default center (Brazil)
  const defaultCenter: [number, number] = [-15.77972, -47.92972];
  const center = userLocation 
    ? [userLocation.lat, userLocation.lng] as [number, number]
    : defaultCenter;

  const handleMarkerClick = (oficina: OficinaWithDistance) => {
    setSelectedOficina(oficina);
  };

  const handleWorkshopMarkerClick = (workshop: Workshop) => {
    onSelectWorkshop(workshop);
  };

  const handleClosePopup = () => {
    setSelectedOficina(null);
  };

  return (
    <div className="h-full w-full relative">
      <div className="absolute top-4 right-4 z-10">
        <Button 
          onClick={() => handleLocateOficinas(oficinasRUIDCAR, workshops)}
          className="bg-brand-orange hover:bg-opacity-90 text-white flex items-center gap-2 shadow-lg"
          disabled={isLocating}
        >
          <Navigation className="w-4 h-4" />
          {isLocating ? 'Localizando...' : 'Localizar Oficinas'}
        </Button>
      </div>
      
      <MapContainer
        style={{ width: '100%', height: '100%' }}
        className="z-0"
        center={defaultCenter}
        zoom={5}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapUpdater center={center} zoom={userLocation ? 12 : 5} />

        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
          >
            <Popup>Sua localização</Popup>
          </Marker>
        )}

        {/* Display nearest oficinas */}
        {nearestOficinas.map((oficina) => (
          <Marker
            key={`${oficina.nome}-${oficina.lat}-${oficina.lng}`}
            position={[oficina.lat, oficina.lng]}
            icon={workshopIcon}
            eventHandlers={{
              click: () => handleMarkerClick(oficina),
            }}
          >
            {selectedOficina && selectedOficina === oficina && (
              <Popup 
                eventHandlers={{
                  close: handleClosePopup
                }}
              >
                <div className="p-2 max-w-xs">
                  <h3 className="font-semibold mb-2">{oficina.nome}</h3>
                  <p className="text-sm text-gray-700 mb-2">{oficina.endereco}</p>
                  <p className="text-sm text-gray-700 mb-2">{oficina.telefone || 'Telefone não disponível'}</p>
                  <p className="text-sm text-brand-orange">
                    {oficina.distance.toFixed(1)} km de distância
                  </p>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
        
        {/* Display nearest workshops */}
        {nearestWorkshops.map((workshop) => (
          <Marker
            key={`${workshop.name}-${workshop.lat}-${workshop.lng}`}
            position={[workshop.lat, workshop.lng]}
            icon={workshopIcon}
            eventHandlers={{
              click: () => handleWorkshopMarkerClick(workshop),
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
