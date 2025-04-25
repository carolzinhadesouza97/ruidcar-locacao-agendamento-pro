
// This file is deprecated and only kept for compatibility
// with existing imports - functionality has been migrated to Mapbox

import { useState } from 'react';

export const useGoogleMaps = (mapRef: React.RefObject<HTMLDivElement>) => {
  const [isLoaded, setIsLoaded] = useState(true);
  const [map, setMap] = useState<any>(null);
  
  const geocodeAddress = async () => {
    console.warn('geocodeAddress is deprecated - Mapbox integration is used instead');
    return Promise.reject("This function is deprecated");
  };
  
  const getAddressSuggestions = async () => {
    console.warn('getAddressSuggestions is deprecated - Mapbox integration is used instead');
    return Promise.reject("This function is deprecated");
  };
  
  const getPlaceDetails = async () => {
    console.warn('getPlaceDetails is deprecated - Mapbox integration is used instead');
    return Promise.reject("This function is deprecated");
  };

  return {
    map,
    setMap,
    isLoaded,
    geocodeAddress,
    getAddressSuggestions,
    getPlaceDetails,
  };
};
