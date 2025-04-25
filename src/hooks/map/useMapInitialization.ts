
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export const useMapInitialization = (mapRef: React.RefObject<HTMLDivElement>) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const googleMapScript = document.createElement('script');

  const checkIfGoogleMapsLoaded = useCallback(() => {
    return window.google && window.google.maps;
  }, []);

  const initializeMap = () => {
    if (!mapRef.current) return;

    try {
      const mapOptions: google.maps.MapOptions = {
        center: { lat: -15.77972, lng: -47.92972 },
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
    } catch (error) {
      console.error("Erro ao inicializar o mapa:", error);
      toast.error("Erro ao inicializar o mapa do Google Maps");
    }
  };

  useEffect(() => {
    if (checkIfGoogleMapsLoaded()) {
      setIsLoaded(true);
      if (mapRef.current && !map) {
        initializeMap();
      }
      return;
    }

    const callbackName = 'googleMapsInitCallback_' + Math.random().toString(36).substr(2, 9);
    
    (window as any)[callbackName] = function() {
      setIsLoaded(true);
      if (mapRef.current) {
        initializeMap();
      }
      delete (window as any)[callbackName];
    };

    const handleScriptError = () => {
      toast.error("Não foi possível carregar o Google Maps. Verifique sua conexão.");
      console.error("Falha ao carregar a API do Google Maps");
      delete (window as any)[callbackName];
    };

    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC4k4JCq9xSBL7gWhN_v7Rf6ps0BQlQbac&libraries=places,geometry&callback=${callbackName}`;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    googleMapScript.onerror = handleScriptError;
    document.head.appendChild(googleMapScript);

    return () => {
      delete (window as any)[callbackName];
      if (document.head.contains(googleMapScript)) {
        document.head.removeChild(googleMapScript);
      }
    };
  }, [mapRef, map, checkIfGoogleMapsLoaded]);

  return { map, setMap, isLoaded };
};
