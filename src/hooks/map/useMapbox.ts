
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Workshop } from '@/types/workshops';
import { calculateHaversineDistance } from '@/utils/distance';

// Modifying this interface to match the Workshop type where distance is optional and is a number
export interface WorkshopWithDistance extends Workshop {
  distance: number;
}

// Define a proper viewport type that includes transitionDuration
export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
  transitionDuration?: number;
}

// Coordenadas padrão para o Brasil (centro aproximado)
const BRAZIL_CENTER: MapViewport = {
  latitude: -15.77972,
  longitude: -47.92972,
  zoom: 4
};

export const useMapbox = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [viewport, setViewport] = useState<MapViewport>(BRAZIL_CENTER);
  const [nearestWorkshops, setNearestWorkshops] = useState<Workshop[]>([]);

  // Inicializa o mapa garantindo que os valores iniciais estão corretos
  useEffect(() => {
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

  const handleLocateWorkshops = useCallback((workshops: Workshop[]) => {
    setIsLocating(true);
    console.log("Iniciando localização de oficinas...");
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLoc = handleGeolocate(position);
        
        if (!userLoc) {
          setIsLocating(false);
          return;
        }
        
        // Process workshops and create a list with distances
        const workshopsWithDistance: Workshop[] = workshops.map(workshop => {
          const distance = calculateHaversineDistance(
            userLoc.lat,
            userLoc.lng,
            workshop.lat,
            workshop.lng
          );
          
          return {
            ...workshop,
            distance: distance
          };
        });
        
        // Get 5 nearest workshops
        const nearest = workshopsWithDistance
          .sort((a, b) => (a.distance || 0) - (b.distance || 0))
          .slice(0, 5);
        
        console.log("Oficinas mais próximas encontradas:", nearest);  
        setNearestWorkshops(nearest);
        
        if (nearest.length > 0) {
          setViewport({
            latitude: userLoc.lat,
            longitude: userLoc.lng,
            zoom: 12,
            transitionDuration: 1000
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
    nearestWorkshops,
    isLocating,
    handleLocateWorkshops,
    viewport,
    setViewport
  };
};
