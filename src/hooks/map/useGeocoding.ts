
import { useCallback } from 'react';

export const useGeocoding = (isLoaded: boolean) => {
  const geocodeAddress = useCallback(async (address: string): Promise<google.maps.LatLng> => {
    return new Promise((resolve, reject) => {
      if (!isLoaded || !window.google || !window.google.maps) {
        reject(new Error('Google Maps API não está carregada'));
        return;
      }

      const geocoder = new google.maps.Geocoder();
      
      const geocoderRequest: google.maps.GeocoderRequest = {
        address,
        region: 'BR',
        componentRestrictions: { country: 'BR' }
      };
      
      const attemptGeocode = (attempts = 0) => {
        geocoder.geocode(geocoderRequest, (results, status) => {
          console.log("Geocode status:", status);
          
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            console.log("Geocode bem-sucedido:", results[0].formatted_address);
            resolve(results[0].geometry.location);
          } else {
            let errorMessage = 'Falha ao geocodificar endereço';
            
            switch (status) {
              case google.maps.GeocoderStatus.ZERO_RESULTS:
                errorMessage = 'Nenhum resultado encontrado para este endereço. Tente ser mais específico.';
                break;
              case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
                if (attempts < 3) {
                  setTimeout(() => attemptGeocode(attempts + 1), Math.pow(2, attempts) * 1000);
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
                  setTimeout(() => attemptGeocode(attempts + 1), 1000);
                  return;
                }
                errorMessage = 'Erro desconhecido ao localizar endereço. Tente novamente.';
                break;
            }
            
            reject(new Error(errorMessage));
          }
        });
      };
      
      attemptGeocode();
    });
  }, [isLoaded]);

  return { geocodeAddress };
};
