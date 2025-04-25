
import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { Workshop } from '@/data/workshops';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { oficinasRUIDCAR, OficinaRUIDCAR } from '@/data/oficinasRUIDCAR';
import { calculateHaversineDistance } from '@/utils/distance';

interface WorkshopMapProps {
  onSelectWorkshop: (workshop: Workshop) => void;
  workshops: Workshop[];
  onSchedule: () => void;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: -15.77972,
  lng: -47.92972
};

const mapOptions = {
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ],
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
};

const WorkshopMap: React.FC<WorkshopMapProps> = ({ 
  onSelectWorkshop,
  onSchedule 
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedOficina, setSelectedOficina] = useState<OficinaRUIDCAR | null>(null);
  const [nearestOficinas, setNearestOficinas] = useState<(OficinaRUIDCAR & { distance?: number })[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleLocateOficinas = useCallback(() => {
    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: userLat, longitude: userLng } = position.coords;
        setUserLocation({ lat: userLat, lng: userLng });

        const oficinasWithDistance = oficinasRUIDCAR.map(oficina => ({
          ...oficina,
          distance: calculateHaversineDistance(userLat, userLng, oficina.lat, oficina.lng)
        }));

        const nearest = oficinasWithDistance
          .sort((a, b) => (a.distance || 0) - (b.distance || 0))
          .slice(0, 5);

        setNearestOficinas(nearest);

        if (map) {
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(new google.maps.LatLng(userLat, userLng));
          
          nearest.forEach(oficina => {
            bounds.extend(new google.maps.LatLng(oficina.lat, oficina.lng));
          });
          
          map.fitBounds(bounds);
          
          const listener = google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
            if (map.getZoom() > 12) map.setZoom(12);
          });
        }

        setIsLocating(false);
        toast.success('Oficinas próximas encontradas!');
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        toast.error('Não foi possível obter sua localização');
        setIsLocating(false);
      }
    );
  }, [map]);

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 right-4 z-10">
        <Button 
          onClick={handleLocateOficinas}
          className="bg-brand-orange hover:bg-opacity-90 text-white flex items-center gap-2 shadow-lg"
          disabled={isLocating}
        >
          <Navigation className="w-4 h-4" />
          {isLocating ? 'Localizando...' : 'Localizar Oficinas'}
        </Button>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={5}
        onLoad={setMap}
        options={mapOptions}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new google.maps.Size(40, 40),
            }}
            title="Sua localização"
          />
        )}

        {(nearestOficinas.length > 0 ? nearestOficinas : oficinasRUIDCAR).map((oficina) => (
          <Marker
            key={oficina.nome}
            position={{ lat: oficina.lat, lng: oficina.lng }}
            onClick={() => setSelectedOficina(oficina)}
            icon={{
              path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              fillColor: nearestOficinas.includes(oficina) ? '#FF6600' : '#666666',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
              scale: selectedOficina?.nome === oficina.nome ? 10 : (nearestOficinas.includes(oficina) ? 8 : 6),
            }}
          />
        ))}

        {selectedOficina && (
          <InfoWindow
            position={{ lat: selectedOficina.lat, lng: selectedOficina.lng }}
            onCloseClick={() => setSelectedOficina(null)}
          >
            <div className="p-4">
              <h3 className="font-semibold mb-2">{selectedOficina.nome}</h3>
              <p className="text-sm mb-1">{selectedOficina.endereco}</p>
              <p className="text-sm mb-2">{selectedOficina.telefone}</p>
              {selectedOficina.distance && (
                <p className="text-sm text-brand-orange font-semibold">
                  {selectedOficina.distance.toFixed(2)} km de distância
                </p>
              )}
              <Button 
                onClick={onSchedule}
                size="sm"
                className="w-full mt-2 bg-brand-orange hover:bg-opacity-90"
              >
                Agendar Diagnóstico
              </Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default WorkshopMap;
