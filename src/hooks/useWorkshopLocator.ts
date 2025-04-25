
import { useState, useRef } from 'react';
import { Workshop } from '@/types/workshop';

interface Location {
  lat: number;
  lng: number;
}

export const useWorkshopLocator = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [nearestWorkshops, setNearestWorkshops] = useState<Workshop[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const toRad = (value: number) => (value * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  };

  const findNearestWorkshops = (workshops: Workshop[], location: Location): Workshop[] => {
    return workshops
      .map(workshop => ({
        ...workshop,
        distance: calculateDistance(
          location.lat,
          location.lng,
          workshop.lat,
          workshop.lng
        )
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 5);
  };

  const locateWorkshops = (workshops: Workshop[]) => {
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
