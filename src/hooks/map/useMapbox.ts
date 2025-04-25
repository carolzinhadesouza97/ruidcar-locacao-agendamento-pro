
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { OficinaRUIDCAR } from '@/data/oficinasRUIDCAR';
import { calculateHaversineDistance } from '@/utils/distance';

export interface OficinaWithDistance extends OficinaRUIDCAR {
  distance: number;
}

// Coordenadas padrão para o Brasil (centro aproximado)
const BRAZIL_CENTER = {
  latitude: -15.77972,
  longitude: -47.92972,
  zoom: 4
};

export const useMapbox = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestOficinas, setNearestOficinas] = useState<OficinaWithDistance[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [viewport, setViewport] = useState({
    ...BRAZIL_CENTER
  });

  // Inicializa o mapa garantindo que os valores iniciais estão corretos
  useEffect(() => {
    // Verifica se já temos localização do usuário
    if (!userLocation) {
      setViewport(BRAZIL_CENTER);
    }
  }, [userLocation]);

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
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
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
