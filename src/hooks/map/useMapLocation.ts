
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { LatLngLiteral } from '@types/google.maps';
import { OficinaRUIDCAR } from '@/data/oficinasRUIDCAR';

export interface OficinaWithDistance extends OficinaRUIDCAR {
  distance: number;
}

export const useMapLocation = (mapInstance: google.maps.Map | null) => {
  const [userLocation, setUserLocation] = useState<LatLngLiteral | null>(null);
  const [nearestOficinas, setNearestOficinas] = useState<OficinaWithDistance[]>([]);
  const [isLocating, setIsLocating] = useState(false);

  const computeDistance = useCallback((point1: LatLngLiteral, point2: LatLngLiteral): number => {
    const p1 = new google.maps.LatLng(point1.lat, point1.lng);
    const p2 = new google.maps.LatLng(point2.lat, point2.lng);
    const distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
    return parseFloat((distanceInMeters / 1000).toFixed(2));
  }, []);

  const handleLocateOficinas = useCallback((oficinas: OficinaRUIDCAR[]) => {
    if (!mapInstance) {
      toast.error("Google Maps não está carregado ainda. Tente novamente em alguns segundos.");
      return;
    }
    
    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: userLat, longitude: userLng } = position.coords;
        const userLoc = { lat: userLat, lng: userLng };
        setUserLocation(userLoc);
        
        const oficinasWithDistance: OficinaWithDistance[] = oficinas.map(oficina => ({
          ...oficina,
          distance: computeDistance(userLoc, { lat: oficina.lat, lng: oficina.lng })
        }));

        const nearest = oficinasWithDistance
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5);

        setNearestOficinas(nearest);
        
        if (mapInstance && nearest.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(new google.maps.LatLng(userLat, userLng));
          
          nearest.forEach(oficina => {
            bounds.extend(new google.maps.LatLng(oficina.lat, oficina.lng));
          });
          
          mapInstance.fitBounds(bounds);
          
          google.maps.event.addListenerOnce(mapInstance, 'bounds_changed', () => {
            if (mapInstance.getZoom() && mapInstance.getZoom() > 12) {
              mapInstance.setZoom(12);
            }
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
  }, [mapInstance, computeDistance]);

  return {
    userLocation,
    nearestOficinas,
    isLocating,
    handleLocateOficinas
  };
};
