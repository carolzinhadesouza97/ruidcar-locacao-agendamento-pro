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
      // Define a função de callback global
      const callbackName = 'googleMapsInitCallback_' + Math.random().toString(36).substr(2, 9);
      
      // Usar window em vez de globalThis
      window[callbackName as keyof typeof window] = function() {
        setIsLoaded(true);
        
        if (window.google.maps.places) {
          setPlacesService(new window.google.maps.places.AutocompleteService());
        }
        
        if (mapRef.current) {
          initializeMap();
        }
        
        // Limpar a função global após o uso
        delete window[callbackName as keyof typeof window];
      };

      // Adicione um manipulador de erro ao script
      const handleScriptError = () => {
        toast.error("Não foi possível carregar o Google Maps. Verifique sua conexão.");
        console.error("Falha ao carregar a API do Google Maps");
        delete window[callbackName as keyof typeof window];
      };

      googleMapScript.current = document.createElement('script');
      googleMapScript.current.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC4k4JCq9xSBL7gWhN_v7Rf6ps0BQlQbac&libraries=places,geometry&callback=${callbackName}`;
      googleMapScript.current.async = true;
      googleMapScript.current.defer = true;
      googleMapScript.current.onerror = handleScriptError;
      document.head.appendChild(googleMapScript.current);
    }

    return () => {
      // Limpe o callback se existir
      const callbackName = 'googleMapsInitCallback_' + Math.random().toString(36).substr(2, 9);
      if (window[callbackName as keyof typeof window]) {
        delete window[callbackName as keyof typeof window];
      }
      
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

  // Função para geocodificar um endereço com retry e melhor tratamento de erros
  const geocodeAddress = async (address: string): Promise<google.maps.LatLng> => {
    return new Promise((resolve, reject) => {
      if (!isLoaded || !window.google || !window.google.maps) {
        reject(new Error('Google Maps API não está carregada'));
        return;
      }

      const geocoder = new google.maps.Geocoder();
      
      // Adiciona componente de região ao Brasil para melhorar precisão
      const geocoderRequest: google.maps.GeocoderRequest = {
        address,
        region: 'BR',
        componentRestrictions: { country: 'BR' }
      };
      
      // Função para tentar geocodificar com retry
      const attemptGeocode = (attempts = 0) => {
        geocoder.geocode(geocoderRequest, (results, status) => {
          console.log("Geocode status:", status);
          
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            // Log de sucesso com detalhes para debugging
            console.log("Geocode bem-sucedido:", results[0].formatted_address);
            resolve(results[0].geometry.location);
          } else {
            let errorMessage = 'Falha ao geocodificar endereço';
            
            // Mapear códigos de status para mensagens mais amigáveis
            switch (status) {
              case google.maps.GeocoderStatus.ZERO_RESULTS:
                errorMessage = 'Nenhum resultado encontrado para este endereço. Tente ser mais específico.';
                break;
              case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
                if (attempts < 3) {
                  // Retry com delay exponencial
                  const delay = Math.pow(2, attempts) * 1000;
                  console.log(`Limite excedido, nova tentativa em ${delay}ms...`);
                  setTimeout(() => attemptGeocode(attempts + 1), delay);
                  return;
                }
                errorMessage = 'Limite de consultas à API do Google Maps excedido. Tente novamente mais tarde.';
                break;
              case google.maps.GeocoderStatus.REQUEST_DENIED:
                errorMessage = 'Não foi possível validar o endereço. Use a ferramenta de autocompletar para selecionar um endereço válido.';
                break;
              case google.maps.GeocoderStatus.INVALID_REQUEST:
                errorMessage = 'Requisição inválida de geocodificação. Verifique o formato do endereço.';
                break;
              case google.maps.GeocoderStatus.UNKNOWN_ERROR:
                if (attempts < 3) {
                  // Retry para erros temporários
                  setTimeout(() => attemptGeocode(attempts + 1), 1000);
                  return;
                }
                errorMessage = 'Erro desconhecido ao localizar endereço. Tente novamente.';
                break;
            }
            
            console.error("Erro de geocodificação:", errorMessage, status);
            reject(new Error(errorMessage));
          }
        });
      };
      
      // Primeira tentativa
      attemptGeocode();
    });
  };

  // Função para obter sugestões de endereço
  const getAddressSuggestions = async (input: string): Promise<google.maps.places.AutocompletePrediction[]> => {
    return new Promise((resolve, reject) => {
      if (!placesService) {
        reject(new Error('Serviço de lugares não está disponível'));
        return;
      }

      const request = {
        input,
        componentRestrictions: { country: 'br' },
        types: ['address', 'establishment'],
        sessionToken: new google.maps.places.AutocompleteSessionToken()
      };

      placesService.getPlacePredictions(
        request,
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            resolve(predictions);
          } else {
            console.error("Erro ao buscar sugestões:", status);
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

      // Usamos um mapDiv para evitar erros de DOM
      const mapDiv = document.createElement('div');
      
      const placesService = new google.maps.places.PlacesService(mapDiv);

      placesService.getDetails(
        { 
          placeId, 
          fields: [
            'address_components',
            'formatted_address',
            'geometry',
            'name',
            'formatted_phone_number',
            'business_status',
            'types'
          ]
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            console.log("Detalhes do lugar obtidos com sucesso:", place);
            resolve(place);
          } else {
            console.error("Erro ao obter detalhes do lugar:", status);
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
