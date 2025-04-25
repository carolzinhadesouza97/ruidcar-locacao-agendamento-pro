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
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

  const findNearestWorkshops = (workshops: Workshop[], location: Location): Workshop[] => {
    return workshops
      .map(workshop => {
        let distance;
        if (window.google && window.google.maps && window.google.maps.geometry) {
          const userLatLng = new google.maps.LatLng(location.lat, location.lng);
          const workshopLatLng = new google.maps.LatLng(workshop.lat, workshop.lng);
          distance = google.maps.geometry.spherical.computeDistanceBetween(
            userLatLng, 
            workshopLatLng
          ) / 1000;
        } else {
          distance = calculateHaversineDistance(
            location.lat,
            location.lng,
            workshop.lat,
            workshop.lng
          );
        }
        
        return {
          ...workshop,
          distance: Number(distance.toFixed(2))
        };
      })
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 5);
  };

  const locateWorkshops = (workshops: Workshop[], map: google.maps.Map | null) => {
    if (!workshops || workshops.length === 0) {
      toast.error('Nenhuma oficina disponível no momento');
      return;
    }
    
    setIsLocating(true);
    setSelectedWorkshop(null);
    
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
          const bounds = new google.maps.LatLngBounds();
          
          bounds.extend(new google.maps.LatLng(location.lat, location.lng));
          
          nearest.forEach(workshop => {
            bounds.extend(new google.maps.LatLng(workshop.lat, workshop.lng));
          });
          
          map.fitBounds(bounds);
          
          const listener = google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
            if (map.getZoom() > 15) map.setZoom(15);
          });
        }
        
        setIsLocating(false);
        toast.success('Oficinas próximas encontradas');
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        toast.error('Não foi possível obter sua localização');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const selectWorkshop = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
  };

  const clearSelectedWorkshop = () => {
    setSelectedWorkshop(null);
  };

  return {
    userLocation,
    nearestWorkshops,
    isLocating,
    locateWorkshops,
    selectedWorkshop,
    selectWorkshop,
    clearSelectedWorkshop
  };
};
