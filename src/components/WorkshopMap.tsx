
import React, { useState, useEffect, useRef } from 'react';
import { Workshop, workshopsData, calculateDistances } from '@/data/workshops';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MapPin, Navigation } from 'lucide-react';
import { Loader } from '@googlemaps/js-api-loader';

interface WorkshopMapProps {
  onSelectWorkshop: (workshop: Workshop) => void;
}

// Definindo tipos para Google Maps
declare global {
  interface Window {
    initMap: () => void;
  }
}

const WorkshopMap: React.FC<WorkshopMapProps> = ({ onSelectWorkshop }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [nearestWorkshops, setNearestWorkshops] = useState<Workshop[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const googleMapScript = useRef<HTMLScriptElement | null>(null);

  // Load Google Maps API
  useEffect(() => {
    if (!window.google && !googleMapScript.current) {
      window.initMap = () => {
        if (mapRef.current) {
          initializeMap();
        }
      };

      googleMapScript.current = document.createElement('script');
      googleMapScript.current.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC4k4JCq9xSBL7gWhN_v7Rf6ps0BQlQbac&libraries=geometry&callback=initMap`;
      googleMapScript.current.async = true;
      googleMapScript.current.defer = true;
      document.head.appendChild(googleMapScript.current);
    } else if (window.google && mapRef.current && !map) {
      initializeMap();
    }

    return () => {
      window.initMap = () => {};
      if (googleMapScript.current && document.head.contains(googleMapScript.current)) {
        document.head.removeChild(googleMapScript.current);
      }
    };
  }, []);

  // Initialize the map
  const initializeMap = () => {
    if (!mapRef.current) return;

    const mapOptions: google.maps.MapOptions = {
      center: { lat: -15.77972, lng: -47.92972 }, // Brazil center
      zoom: 5,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
    };

    const newMap = new google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);

    // Create workshop markers
    createWorkshopMarkers(newMap);
    
    // Fit bounds to all markers
    const bounds = new google.maps.LatLngBounds();
    workshopsData.forEach(workshop => {
      bounds.extend(new google.maps.LatLng(workshop.lat, workshop.lng));
    });
    newMap.fitBounds(bounds);
  };

  // Create markers for all workshops
  const createWorkshopMarkers = (mapInstance: google.maps.Map) => {
    const newMarkers = workshopsData.map((workshop) => {
      const marker = new google.maps.Marker({
        position: { lat: workshop.lat, lng: workshop.lng },
        map: mapInstance,
        title: workshop.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32),
        },
      });

      // Create InfoWindow with workshop details
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold text-lg">${workshop.name}</h3>
            <p>${workshop.address}</p>
            <p>${workshop.city}, ${workshop.state}</p>
            <p>${workshop.phone}</p>
          </div>
        `,
      });

      // Add click event to marker
      marker.addListener('click', () => {
        onSelectWorkshop(workshop);
        
        // Close any open info windows and open this one
        infoWindow.open(mapInstance, marker);
        
        // Center map on this workshop
        mapInstance.setCenter(marker.getPosition()!);
        mapInstance.setZoom(15);
      });

      return marker;
    });

    setMarkers(newMarkers);
  };

  // Update nearest workshop markers when user location changes
  useEffect(() => {
    if (!userLocation || !map) return;

    // Calculate distances and get nearest workshops
    const workshopsWithDistance = calculateDistances(
      userLocation.lat, 
      userLocation.lng, 
      workshopsData
    );
    
    const nearest = workshopsWithDistance.slice(0, 3);
    setNearestWorkshops(nearest);

    // Update marker icons - highlight nearest workshops
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
    new google.maps.Marker({
      position: userLocation,
      map,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#3b82f6" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `),
        scaledSize: new google.maps.Size(36, 36),
        anchor: new google.maps.Point(18, 18),
      },
      title: 'Sua localização',
    });
    
    // Set bounds to include user location and nearest workshops
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(new google.maps.LatLng(userLocation.lat, userLocation.lng));
    nearest.forEach(workshop => {
      bounds.extend(new google.maps.LatLng(workshop.lat, workshop.lng));
    });
    map.fitBounds(bounds);
    
  }, [userLocation, map, markers]);

  // Find user's location
  const handleFindNearest = () => {
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

  return (
    <div className="h-full w-full flex flex-col relative">
      <div className="absolute top-4 right-4 z-10">
        <Button 
          onClick={handleFindNearest}
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
