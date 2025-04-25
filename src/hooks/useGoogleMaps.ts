
import { useMapInitialization } from './map/useMapInitialization';
import { useGeocoding } from './map/useGeocoding';
import { usePlacesService } from './map/usePlacesService';

export const useGoogleMaps = (mapRef: React.RefObject<HTMLDivElement>) => {
  const { map, setMap, isLoaded } = useMapInitialization(mapRef);
  const { geocodeAddress } = useGeocoding(isLoaded);
  const { getAddressSuggestions, getPlaceDetails } = usePlacesService(isLoaded);

  return {
    map,
    setMap,
    isLoaded,
    geocodeAddress,
    getAddressSuggestions,
    getPlaceDetails,
  };
};
