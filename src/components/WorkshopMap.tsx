
import React, { useRef, useState, useEffect } from 'react';
import { Workshop, workshopsData, calculateDistances } from '@/data/workshops';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { useWorkshopLocation } from '@/hooks/useWorkshopLocation';
import { createWorkshopMarker, createUserLocationMarker } from '@/utils/mapMarkers';

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
  const { map, setMap } = useGoogleMaps(mapRef);
  const {
    userLocation,
    nearestWorkshops,
    setNearestWorkshops,
    handleFindNearest
  } = useWorkshopLocation();

  // Create workshop markers
  useEffect(() => {
    if (!map) return;

    const newMarkers = workshopsData.map(workshop => 
      createWorkshopMarker(workshop, map, false, onSelectWorkshop)
    );
    setMarkers(newMarkers);

    const bounds = new google.maps.LatLngBounds();
    workshopsData.forEach(workshop => {
      bounds.extend(new google.maps.LatLng(workshop.lat, workshop.lng));
    });
    map.fitBounds(bounds);
  }, [map, onSelectWorkshop]);

  // Update markers when user location changes
  useEffect(() => {
    if (!userLocation || !map) return;

    const workshopsWithDistance = calculateDistances(
      userLocation.lat,
      userLocation.lng,
      workshopsData
    );
    
    const nearest = workshopsWithDistance.slice(0, 3);
    setNearestWorkshops(nearest);

    // Update existing markers
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
    
    // Add user's location marker
    createUserLocationMarker(userLocation, map);
    
    // Set bounds to include user location and nearest workshops
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(new google.maps.LatLng(userLocation.lat, userLocation.lng));
    nearest.forEach(workshop => {
      bounds.extend(new google.maps.LatLng(workshop.lat, workshop.lng));
    });
    map.fitBounds(bounds);
  }, [userLocation, map, markers]);

  return (
    <div className="h-full w-full flex flex-col relative">
      <div className="absolute top-4 right-4 z-10">
        <Button 
          onClick={() => handleFindNearest(map)}
          className="bg-brand-orange hover:bg-opacity-90 text-white flex items-center gap-2 shadow-lg"
        >
          <Navigation className="w-4 h-4" />
          Oficinas próximas
        </Button>
      </div>
      <div ref={mapRef} className="h-full w-full rounded-lg shadow-md" />
    </div>
  );
};

export default WorkshopMap;
