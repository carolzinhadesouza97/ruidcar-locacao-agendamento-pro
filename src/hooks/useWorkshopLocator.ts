
import { useState, useRef } from 'react';
import { Workshop } from '@/types/workshop';
import { Workshop as DataWorkshop } from '@/data/workshops';
import { calculateHaversineDistance } from '@/utils/distance';

interface Location {
  lat: number;
  lng: number;
}

export const useWorkshopLocator = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [nearestWorkshops, setNearestWorkshops] = useState<DataWorkshop[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const findNearestWorkshops = (workshops: DataWorkshop[], location: Location): DataWorkshop[] => {
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

  const locateWorkshops = (workshops: DataWorkshop[]) => {
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

        if (mapRef.current) {
          mapRef.current.panTo(location);
          mapRef.current.setZoom(12);
        }
        
        setIsLocating(false);
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        setIsLocating(false);
      }
    );
  };

  return {
    userLocation,
    nearestWorkshops,
    isLocating,
    mapRef,
    locateWorkshops
  };
};
