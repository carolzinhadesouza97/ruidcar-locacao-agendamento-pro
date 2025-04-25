
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { OficinaRUIDCAR } from '@/data/oficinasRUIDCAR';
import { calculateHaversineDistance } from '@/utils/distance';

export interface OficinaWithDistance extends OficinaRUIDCAR {
  distance: number;
}

export const useMapbox = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestOficinas, setNearestOficinas] = useState<OficinaWithDistance[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: -15.77972,
    longitude: -47.92972,
    zoom: 5
  });

  const handleGeolocate = useCallback((position: { coords: GeolocationCoordinates }) => {
    const { latitude, longitude } = position.coords;
    const userLoc = { lat: latitude, lng: longitude };
    setUserLocation(userLoc);
    
    toast.success('Localização obtida com sucesso!');
    return userLoc;
  }, []);

  const handleLocateOficinas = useCallback((oficinas: OficinaRUIDCAR[]) => {
    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLoc = handleGeolocate(position);
        
        if (!userLoc) {
          setIsLocating(false);
          return;
        }
        
        const oficinasWithDistance: OficinaWithDistance[] = oficinas.map(oficina => ({
          ...oficina,
          distance: calculateHaversineDistance(
            userLoc.lat, 
            userLoc.lng, 
            oficina.lat, 
            oficina.lng
          )
        }));

        const nearest = oficinasWithDistance
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5);

        setNearestOficinas(nearest);
        
        if (nearest.length > 0) {
          // Update viewport to show user and nearest oficinas
          setViewport({
            latitude: userLoc.lat,
            longitude: userLoc.lng,
            zoom: 12
          });
        }

        setIsLocating(false);
        toast.success('Oficinas próximas encontradas!');
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        toast.error(`Não foi possível obter sua localização: ${error.message}`);
        setIsLocating(false);
      }
    );
  }, [handleGeolocate]);

  return {
    userLocation,
    nearestOficinas,
    isLocating,
    handleLocateOficinas,
    viewport,
    setViewport
  };
};
