
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

export const useGoogleMaps = (mapRef: React.RefObject<HTMLDivElement>) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [placesService, setPlacesService] = useState<google.maps.places.AutocompleteService | null>(null);
  const googleMapScript = useRef<HTMLScriptElement | null>(null);

  // Verifica se a API do Google Maps já está carregada
  const checkIfGoogleMapsLoaded = useCallback(() => {
    return window.google && window.google.maps;
  }, []);

  useEffect(() => {
    // Se a API já estiver carregada
    if (checkIfGoogleMapsLoaded()) {
      setIsLoaded(true);
      
      if (window.google.maps.places) {
        setPlacesService(new window.google.maps.places.AutocompleteService());
      }
      
      if (mapRef.current && !map) {
        initializeMap();
      }
      return;
    }

    // Se o script não estiver carregado, carregue-o
    if (!googleMapScript.current) {
      window.initMap = () => {
        setIsLoaded(true);
        
        if (window.google.maps.places) {
          setPlacesService(new window.google.maps.places.AutocompleteService());
        }
        
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
      googleMapScript.current.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC4k4JCq9xSBL7gWhN_v7Rf6ps0BQlQbac&libraries=places,geometry&callback=initMap`;
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

  // Função para geocodificar um endereço
  const geocodeAddress = async (address: string): Promise<google.maps.LatLng> => {
    return new Promise((resolve, reject) => {
      if (!isLoaded || !window.google || !window.google.maps) {
        reject(new Error('Google Maps API não está carregada'));
        return;
      }

      const geocoder = new google.maps.Geocoder();
      
      geocoder.geocode({ address, region: 'BR' }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          resolve(results[0].geometry.location);
        } else {
          let errorMessage = 'Falha ao geocodificar endereço';
          
          // Mapear códigos de status para mensagens mais amigáveis
          switch (status) {
            case google.maps.GeocoderStatus.ZERO_RESULTS:
              errorMessage = 'Nenhum resultado encontrado para este endereço';
              break;
            case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
              errorMessage = 'Limite de consultas à API do Google Maps excedido';
              break;
            case google.maps.GeocoderStatus.REQUEST_DENIED:
              errorMessage = 'Requisição negada pelo serviço de geocodificação';
              break;
            case google.maps.GeocoderStatus.INVALID_REQUEST:
              errorMessage = 'Requisição inválida de geocodificação';
              break;
          }
          
          reject(new Error(errorMessage));
        }
      });
    });
  };

  // Função para obter sugestões de endereço
  const getAddressSuggestions = async (input: string): Promise<google.maps.places.AutocompletePrediction[]> => {
    return new Promise((resolve, reject) => {
      if (!placesService) {
        reject(new Error('Serviço de lugares não está disponível'));
        return;
      }

      placesService.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: 'br' },
          types: ['establishment', 'geocode']
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            resolve(predictions);
          } else {
            reject(new Error('Não foi possível obter sugestões de endereço'));
          }
        }
      );
    });
  };

  // Função para obter detalhes de um lugar
  const getPlaceDetails = async (placeId: string): Promise<google.maps.places.PlaceResult> => {
    return new Promise((resolve, reject) => {
      if (!isLoaded || !window.google || !window.google.maps) {
        reject(new Error('Google Maps API não está carregada'));
        return;
      }

      // Precisamos de um elemento DOM para criar o serviço PlacesService
      const placesService = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      placesService.getDetails(
        { placeId, fields: ['address_components', 'formatted_address', 'geometry', 'name', 'formatted_phone_number'] },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            resolve(place);
          } else {
            reject(new Error('Não foi possível obter detalhes do endereço'));
          }
        }
      );
    });
  };

  return { 
    map, 
    setMap, 
    isLoaded, 
    geocodeAddress, 
    getAddressSuggestions,
    getPlaceDetails 
  };
};
