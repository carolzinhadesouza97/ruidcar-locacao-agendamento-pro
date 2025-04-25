
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export const useMapInitialization = (mapRef: React.RefObject<HTMLDivElement>) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const checkIfGoogleMapsLoaded = useCallback(() => {
    return window.google && window.google.maps;
  }, []);

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google || !window.google.maps) return;

    try {
      const mapOptions: google.maps.MapOptions = {
        center: { lat: -15.77972, lng: -47.92972 }, // Centro do Brasil
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
      console.log("Mapa Google inicializado com sucesso");
    } catch (error) {
      console.error("Erro ao inicializar o mapa:", error);
      toast.error("Erro ao inicializar o mapa do Google Maps");
    }
  }, [mapRef]);

  useEffect(() => {
    // Se o Google Maps já estiver carregado
    if (checkIfGoogleMapsLoaded()) {
      console.log("Google Maps já está carregado");
      setIsLoaded(true);
      if (mapRef.current && !map) {
        initializeMap();
      }
      return;
    }

    // Cria um ID único para o callback para evitar colisões
    const callbackName = 'googleMapsInitCallback_' + Math.random().toString(36).substr(2, 9);
    
    // Define a função de callback global
    (window as any)[callbackName] = function() {
      console.log("Callback do Google Maps chamado");
      setIsLoaded(true);
      if (mapRef.current) {
        initializeMap();
      }
      delete (window as any)[callbackName];
    };

    // Tratamento de erro ao carregar o script
    const handleScriptError = () => {
      toast.error("Não foi possível carregar o Google Maps. Verifique sua conexão.");
      console.error("Falha ao carregar a API do Google Maps");
      delete (window as any)[callbackName];
    };

    // Cria e adiciona o script ao DOM
    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC4k4JCq9xSBL7gWhN_v7Rf6ps0BQlQbac&libraries=places,geometry&callback=${callbackName}`;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    googleMapScript.onerror = handleScriptError;
    document.head.appendChild(googleMapScript);

    console.log("Script do Google Maps injetado no DOM");

    // Limpeza
    return () => {
      delete (window as any)[callbackName];
      if (document.head.contains(googleMapScript)) {
        document.head.removeChild(googleMapScript);
      }
    };
  }, [mapRef, map, checkIfGoogleMapsLoaded, initializeMap]);

  return { map, setMap, isLoaded };
};
