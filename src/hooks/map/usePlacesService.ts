
import { useState, useEffect } from 'react';

export const usePlacesService = (isLoaded: boolean) => {
  const [placesService, setPlacesService] = useState<google.maps.places.AutocompleteService | null>(null);

  useEffect(() => {
    if (isLoaded && window.google?.maps?.places) {
      setPlacesService(new window.google.maps.places.AutocompleteService());
    }
  }, [isLoaded]);

  const getAddressSuggestions = async (
    input: string
  ): Promise<google.maps.places.AutocompletePrediction[]> => {
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

  const getPlaceDetails = async (
    placeId: string
  ): Promise<google.maps.places.PlaceResult> => {
    return new Promise((resolve, reject) => {
      if (!isLoaded || !window.google || !window.google.maps) {
        reject(new Error('Google Maps API não está carregada'));
        return;
      }

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
            'types',
            'opening_hours',
            'website'
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

  return { getAddressSuggestions, getPlaceDetails };
};
