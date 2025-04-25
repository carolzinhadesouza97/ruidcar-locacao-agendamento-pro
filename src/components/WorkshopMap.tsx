import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Workshop } from '@/data/workshops';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { oficinasRUIDCAR, OficinaRUIDCAR } from '@/data/oficinasRUIDCAR';
import { calculateHaversineDistance } from '@/utils/distance';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { createRuidcarMarker, createUserLocationMarker } from '@/utils/mapMarkers';

// Extended interface to include distance property
interface OficinaWithDistance extends OficinaRUIDCAR {
  distance: number;
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
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  const clearMarkers = useCallback(() => {
    if (markers.length > 0) {
      markers.forEach(marker => marker.setMap(null));
      setMarkers([]);
    }
    
    if (infoWindow) {
      infoWindow.close();
    }
  }, [markers, infoWindow]);

  const handleLocateOficinas = useCallback(() => {
    if (!isLoaded || !map) {
      toast.error("Google Maps não está carregado ainda. Tente novamente em alguns segundos.");
      return;
    }
    
    setIsLocating(true);
    clearMarkers();
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: userLat, longitude: userLng } = position.coords;
        setUserLocation({ lat: userLat, lng: userLng });

        const oficinasWithDistance: OficinaWithDistance[] = oficinasRUIDCAR.map(oficina => ({
          ...oficina,
          distance: calculateHaversineDistance(userLat, userLng, oficina.lat, oficina.lng)
        }));

        const nearest = oficinasWithDistance
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5);

        setNearestOficinas(nearest);

        if (map) {
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(new google.maps.LatLng(userLat, userLng));
          
          nearest.forEach(oficina => {
            bounds.extend(new google.maps.LatLng(oficina.lat, oficina.lng));
          });
          
          map.fitBounds(bounds);
          
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
  }, [map, isLoaded, clearMarkers]);

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

  useEffect(() => {
    if (map && isLoaded) {
      map.setOptions({
        center: { lat: -15.77972, lng: -47.92972 },
        zoom: 5,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });
    }
  }, [map, isLoaded]);

  useEffect(() => {
    if (!map || !isLoaded) {
      return;
    }

    clearMarkers();
    
    if (!infoWindow) {
      setInfoWindow(new google.maps.InfoWindow());
    }

    const newMarkers: google.maps.Marker[] = [];
    
    if (userLocation) {
      const userMarker = createUserLocationMarker(userLocation, map);
      newMarkers.push(userMarker);
    }

    const oficinasToDisplay = nearestOficinas.length > 0 ? nearestOficinas : [];
    
    oficinasToDisplay.forEach((oficina) => {
      const marker = new google.maps.Marker({
        position: { lat: oficina.lat, lng: oficina.lng },
        map,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          fillColor: '#FF6600',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
          scale: (selectedOficina?.nome === oficina.nome) ? 10 : 8,
        },
      });

      marker.addListener('click', () => {
        setSelectedOficina(oficina);
        
        if (infoWindow) {
          infoWindow.close();
          infoWindow.setContent(`
            <div class="p-4">
              <h3 class="font-semibold mb-2">${oficina.nome}</h3>
              <p class="text-sm mb-1">${oficina.endereco}</p>
              <p class="text-sm mb-2">${oficina.telefone}</p>
              <p class="text-sm text-orange-500 font-semibold">
                ${oficina.distance.toFixed(2)} km de distância
              </p>
            </div>
          `);
          infoWindow.open(map, marker);
        }
      });
      
      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, isLoaded, userLocation, nearestOficinas, selectedOficina, infoWindow, clearMarkers]);

  return renderMap();
};

export default WorkshopMap;
