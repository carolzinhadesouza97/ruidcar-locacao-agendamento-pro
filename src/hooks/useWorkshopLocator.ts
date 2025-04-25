
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
      .map(workshop => {
        // Use Google Maps geometry if available, otherwise fallback to Haversine
        let distance;
        if (window.google && window.google.maps && window.google.maps.geometry) {
          const userLatLng = new google.maps.LatLng(location.lat, location.lng);
          const workshopLatLng = new google.maps.LatLng(workshop.lat, workshop.lng);
          distance = google.maps.geometry.spherical.computeDistanceBetween(
            userLatLng, 
            workshopLatLng
          ) / 1000; // Convert to km
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
          // Create bounds to fit all markers
          const bounds = new google.maps.LatLngBounds();
          
          // Add user location to bounds
          bounds.extend(new google.maps.LatLng(location.lat, location.lng));
          
          // Add workshop locations to bounds
          nearest.forEach(workshop => {
            bounds.extend(new google.maps.LatLng(workshop.lat, workshop.lng));
          });
          
          // Fit the map to the bounds
          map.fitBounds(bounds);
          
          // If the zoom is too high, limit it
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

  return {
    userLocation,
    nearestWorkshops,
    isLocating,
    locateWorkshops
  };
};
