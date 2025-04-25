
import React, { useState, useCallback, useRef } from 'react';
import { Workshop } from '@/data/workshops';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { oficinasRUIDCAR, OficinaRUIDCAR } from '@/data/oficinasRUIDCAR';
import { calculateHaversineDistance } from '@/utils/distance';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

// Extended interface to include distance property
interface OficinaWithDistance extends OficinaRUIDCAR {
  distance?: number;
}

interface WorkshopMapProps {
  onSelectWorkshop: (workshop: Workshop) => void;
  workshops: Workshop[];
  onSchedule: () => void;
}

const WorkshopMap: React.FC<WorkshopMapProps> = ({ 
  onSelectWorkshop,
  onSchedule 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { map, isLoaded } = useGoogleMaps(mapRef);
  
  const [selectedOficina, setSelectedOficina] = useState<OficinaWithDistance | null>(null);
  const [nearestOficinas, setNearestOficinas] = useState<OficinaWithDistance[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleLocateOficinas = useCallback(() => {
    if (!isLoaded || !map) {
      toast.error("Google Maps não está carregado ainda. Tente novamente em alguns segundos.");
      return;
    }
    
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
          
          // Adjust zoom level after bounds change
          google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
            if (map.getZoom() && map.getZoom() > 12) map.setZoom(12);
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
  }, [map, isLoaded]);

  const renderMap = () => {
    if (!isLoaded) {
      return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
          <p>Carregando Google Maps...</p>
        </div>
      );
    }

    return (
      <div className="h-full w-full relative">
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

        <div ref={mapRef} className="h-full w-full"></div>
      </div>
    );
  };

  React.useEffect(() => {
    if (map && isLoaded) {
      // Clear previous markers
      const existingMarkers = document.querySelectorAll('.gm-ui-hover-effect');
      existingMarkers.forEach(marker => marker.parentElement?.parentElement?.parentElement?.remove());
      
      // Add user marker if available
      if (userLocation) {
        new google.maps.Marker({
          position: userLocation,
          map,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new google.maps.Size(40, 40),
          },
          title: "Sua localização"
        });
      }

      // Add oficinas markers
      const oficinasToDisplay = nearestOficinas.length > 0 ? nearestOficinas : oficinasRUIDCAR;
      
      oficinasToDisplay.forEach((oficina) => {
        const isNearest = nearestOficinas.includes(oficina);
        const marker = new google.maps.Marker({
          position: { lat: oficina.lat, lng: oficina.lng },
          map,
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            fillColor: isNearest ? '#FF6600' : '#666666',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
            scale: (selectedOficina?.nome === oficina.nome) ? 10 : (isNearest ? 8 : 6),
          },
        });

        marker.addListener('click', () => {
          setSelectedOficina(oficina);
          
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-4">
                <h3 class="font-semibold mb-2">${oficina.nome}</h3>
                <p class="text-sm mb-1">${oficina.endereco}</p>
                <p class="text-sm mb-2">${oficina.telefone}</p>
                ${oficina.distance ? `
                  <p class="text-sm text-orange-500 font-semibold">
                    ${oficina.distance.toFixed(2)} km de distância
                  </p>
                ` : ''}
              </div>
            `,
          });
          
          infoWindow.open(map, marker);
        });
      });
    }
  }, [map, isLoaded, userLocation, nearestOficinas, selectedOficina]);

  return renderMap();
};

export default WorkshopMap;
