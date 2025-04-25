
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { OficinaRUIDCAR } from '@/data/oficinasRUIDCAR';
import { calculateHaversineDistance } from '@/utils/distance';
import { Workshop } from '@/data/workshops';

export interface OficinaWithDistance extends OficinaRUIDCAR {
  distance: number;
}

// Modifying this interface to match the Workshop type where distance is optional and is a number
export interface WorkshopWithDistance extends Workshop {
  distance: number; // Changed from string to number to match Workshop type
}

// Define a proper viewport type that includes transitionDuration
export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
  transitionDuration?: number; // Make this optional
}

// Coordenadas padrão para o Brasil (centro aproximado)
const BRAZIL_CENTER: MapViewport = {
  latitude: -15.77972,
  longitude: -47.92972,
  zoom: 4
};

export const useMapbox = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestOficinas, setNearestOficinas] = useState<OficinaWithDistance[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [viewport, setViewport] = useState<MapViewport>(BRAZIL_CENTER);
  const [nearestWorkshops, setNearestWorkshops] = useState<WorkshopWithDistance[]>([]);

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

  const handleLocateOficinas = useCallback((oficinas: OficinaRUIDCAR[], workshops: Workshop[]) => {
    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLoc = handleGeolocate(position);
        
        if (!userLoc) {
          setIsLocating(false);
          return;
        }
        
        // Process oficinas
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
        
        // Process workshops and create a parallel list with distances
        const workshopsWithDistance: WorkshopWithDistance[] = workshops.map(workshop => {
          const distance = calculateHaversineDistance(
            userLoc.lat,
            userLoc.lng,
            workshop.lat,
            workshop.lng
          );
          
          return {
            ...workshop,
            distance: distance // Keep as number, don't convert to string
          };
        });
        
        // Get 3-5 nearest workshops
        const nearestShops = workshopsWithDistance
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5);
          
        setNearestWorkshops(nearestShops);
        
        if (nearest.length > 0 || nearestShops.length > 0) {
          // Update viewport to show user and nearest locations
          setViewport({
            latitude: userLoc.lat,
            longitude: userLoc.lng,
            zoom: 12,
            transitionDuration: 1000 // Add transition duration here
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
    nearestWorkshops,
    isLocating,
    handleLocateOficinas,
    viewport,
    setViewport
  };
};
