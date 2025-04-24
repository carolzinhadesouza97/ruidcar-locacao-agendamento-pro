
import { useState } from 'react';
import { Workshop } from '@/data/workshops';
import { toast } from 'sonner';

export const useWorkshopLocation = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestWorkshops, setNearestWorkshops] = useState<Workshop[]>([]);

  const handleFindNearest = (map: google.maps.Map | null) => {
    if (!map) return;
    
    if (navigator.geolocation) {
      toast.info("Buscando sua localização...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLoc);
          toast.success("Localização encontrada. Mostrando oficinas próximas.");
        },
        (error) => {
          console.error("Error getting user location:", error);
          toast.error("Não foi possível obter sua localização. Verifique as permissões do navegador.");
        }
      );
    } else {
      toast.error("Seu navegador não suporta geolocalização.");
    }
  };

  return {
    userLocation,
    setUserLocation,
    nearestWorkshops,
    setNearestWorkshops,
    handleFindNearest,
  };
};
