import React, { useRef, useState, useEffect } from 'react';
import { Workshop, workshopsData, calculateDistances } from '@/data/workshops';
import { clientsRUIDCAR, RuidcarClient } from '@/data/clientsRUIDCAR';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { useWorkshopLocation } from '@/hooks/useWorkshopLocation';
import { createWorkshopMarker, createUserLocationMarker, createRuidcarMarker } from '@/utils/mapMarkers';
import { calculateHaversineDistance } from '@/utils/distance';
import { toast } from 'sonner';

interface WorkshopMapProps {
  onSelectWorkshop: (workshop: Workshop) => void;
}

declare global {
  interface Window {
    initMap: () => void;
  }
}

const WorkshopMap: React.FC<WorkshopMapProps> = ({ onSelectWorkshop }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [ruidcarMarkers, setRuidcarMarkers] = useState<google.maps.Marker[]>([]);
  const [selectedRuidcar, setSelectedRuidcar] = useState<RuidcarClient | null>(null);
  const { map, setMap } = useGoogleMaps(mapRef);
  const {
    userLocation,
    nearestWorkshops,
    setNearestWorkshops,
    handleFindNearest
  } = useWorkshopLocation();

  useEffect(() => {
    if (!map) return;

    const newWorkshopMarkers = workshopsData.map(workshop => 
      createWorkshopMarker(workshop, map, false, onSelectWorkshop)
    );
    setMarkers(newWorkshopMarkers);

    const newRuidcarMarkers = clientsRUIDCAR.map(client =>
      createRuidcarMarker(client, map, false)
    );
    setRuidcarMarkers(newRuidcarMarkers);

    const bounds = new google.maps.LatLngBounds();
    [...workshopsData, ...clientsRUIDCAR].forEach(location => {
      bounds.extend(new google.maps.LatLng(location.lat, location.lng));
    });
    map.fitBounds(bounds);
  }, [map, onSelectWorkshop]);

  const handleFindNearestRuidcar = () => {
    if (!map) return;

    toast.info("Buscando sua localização...");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;

        let nearest = clientsRUIDCAR[0];
        let minDist = calculateHaversineDistance(latitude, longitude, nearest.lat, nearest.lng);

        for (const client of clientsRUIDCAR) {
          const distance = calculateHaversineDistance(latitude, longitude, client.lat, client.lng);
          if (distance < minDist) {
            minDist = distance;
            nearest = client;
          }
        }

        ruidcarMarkers.forEach(marker => {
          const position = marker.getPosition();
          if (!position) return;

          const isNearest = position.lat() === nearest.lat && position.lng() === nearest.lng;
          
          marker.setIcon({
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${isNearest ? '#22c55e' : '#94a3b8'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 7v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7"></path>
                <rect width="20" height="5" x="2" y="3" rx="2"></rect>
                <circle cx="12" cy="14" r="2"></circle>
              </svg>
            `),
            scaledSize: new google.maps.Size(isNearest ? 40 : 32, isNearest ? 40 : 32),
            anchor: new google.maps.Point(isNearest ? 20 : 16, isNearest ? 40 : 32),
          });
        });

        setSelectedRuidcar(nearest);
        const newLocation = new google.maps.LatLng(nearest.lat, nearest.lng);
        map.panTo(newLocation);
        map.setZoom(14);

        toast.success(
          `Cliente RUIDCAR mais próximo: ${nearest.nome} (${minDist.toFixed(1)} km)`
        );
      },
      (error) => {
        console.error("Error getting user location:", error);
        toast.error("Não foi possível obter sua localização. Verifique as permissões do navegador.");
      }
    );
  };

  useEffect(() => {
    if (!userLocation || !map) return;

    const workshopsWithDistance = calculateDistances(
      userLocation.lat,
      userLocation.lng,
      workshopsData
    );
    
    const nearest = workshopsWithDistance.slice(0, 3);
    setNearestWorkshops(nearest);

    markers.forEach(marker => {
      const position = marker.getPosition();
      if (!position) return;
      
      const workshop = workshopsData.find(
        w => w.lat === position.lat() && w.lng === position.lng()
      );
      
      if (!workshop) return;
      
      const isNearest = nearest.some(w => w.id === workshop.id);
      
      marker.setIcon({
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${isNearest ? '#FF6600' : '#666666'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        `),
        scaledSize: new google.maps.Size(isNearest ? 40 : 32, isNearest ? 40 : 32),
        anchor: new google.maps.Point(isNearest ? 20 : 16, isNearest ? 40 : 32),
      });
    });
    
    createUserLocationMarker(userLocation, map);
    
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(new google.maps.LatLng(userLocation.lat, userLocation.lng));
    nearest.forEach(workshop => {
      bounds.extend(new google.maps.LatLng(workshop.lat, workshop.lng));
    });
    map.fitBounds(bounds);
  }, [userLocation, map, markers]);

  return (
    <div className="h-full w-full flex flex-col relative">
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button 
          onClick={() => handleFindNearest(map)}
          className="bg-brand-orange hover:bg-opacity-90 text-white flex items-center gap-2 shadow-lg"
        >
          <Navigation className="w-4 h-4" />
          Oficinas próximas
        </Button>
        <Button
          onClick={handleFindNearestRuidcar}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 shadow-lg"
        >
          <Navigation className="w-4 h-4" />
          Cliente RUIDCAR próximo
        </Button>
      </div>
      <div ref={mapRef} className="h-full w-full rounded-lg shadow-md" />
    </div>
  );
};

export default WorkshopMap;
