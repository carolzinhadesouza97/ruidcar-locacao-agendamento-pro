
import { useState } from 'react';
import { Workshop } from '@/data/workshops';
import { calculateHaversineDistance } from '@/utils/distance';
import { toast } from 'sonner';

interface Location {
  lat: number;
  lng: number;
}

export const useWorkshopLocator = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [nearestWorkshops, setNearestWorkshops] = useState<Workshop[]>([]);
  const [isLocating, setIsLocating] = useState(false);

  const findNearestWorkshops = (workshops: Workshop[], location: Location): Workshop[] => {
    return workshops
      .map(workshop => ({
        ...workshop,
        distance: calculateHaversineDistance(
          location.lat,
          location.lng,
          workshop.lat,
          workshop.lng
        )
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 5);
  };

  const locateWorkshops = (workshops: Workshop[], map: google.maps.Map | null) => {
    if (!workshops || workshops.length === 0) {
      return;
    }
    
    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const location = {
          lat: coords.latitude,
          lng: coords.longitude
        };
        
        setUserLocation(location);
        const nearest = findNearestWorkshops(workshops, location);
        setNearestWorkshops(nearest);

        if (map) {
          map.panTo(location);
          map.setZoom(12);
        }
        
        setIsLocating(false);
        toast.success('Localização encontrada');
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        toast.error('Não foi possível obter sua localização');
        setIsLocating(false);
      }
    );
  };

  return {
    userLocation,
    nearestWorkshops,
    isLocating,
    locateWorkshops
  };
};
