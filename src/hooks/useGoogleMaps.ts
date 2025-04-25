
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

export const useGoogleMaps = (mapRef: React.RefObject<HTMLDivElement>) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const googleMapScript = useRef<HTMLScriptElement | null>(null);

  // Verifica se a API do Google Maps já está carregada
  const checkIfGoogleMapsLoaded = useCallback(() => {
    return window.google && window.google.maps;
  }, []);

  useEffect(() => {
    // Se a API já estiver carregada
    if (checkIfGoogleMapsLoaded()) {
      setIsLoaded(true);
      if (mapRef.current && !map) {
        initializeMap();
      }
      return;
    }

    // Se o script não estiver carregado, carregue-o
    if (!googleMapScript.current) {
      window.initMap = () => {
        setIsLoaded(true);
        if (mapRef.current) {
          initializeMap();
        }
      };

      // Adicione um manipulador de erro ao script
      const handleScriptError = () => {
        toast.error("Não foi possível carregar o Google Maps. Verifique sua conexão.");
        console.error("Falha ao carregar a API do Google Maps");
      };

      googleMapScript.current = document.createElement('script');
      googleMapScript.current.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC4k4JCq9xSBL7gWhN_v7Rf6ps0BQlQbac&libraries=geometry&callback=initMap`;
      googleMapScript.current.async = true;
      googleMapScript.current.defer = true;
      googleMapScript.current.onerror = handleScriptError;
      document.head.appendChild(googleMapScript.current);
    }

    return () => {
      window.initMap = () => {};
      if (googleMapScript.current && document.head.contains(googleMapScript.current)) {
        document.head.removeChild(googleMapScript.current);
      }
    };
  }, [mapRef, map, checkIfGoogleMapsLoaded]);

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

  return { map, setMap, isLoaded };
};
