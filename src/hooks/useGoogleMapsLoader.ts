
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define the return type for the hook
interface UseGoogleMapsLoaderReturn {
  isLoaded: boolean;
  loadError: Error | null;
}

// The Google Maps API key can be passed as a parameter or taken from env
export const useGoogleMapsLoader = (
  apiKey?: string, 
  version = 'weekly',
  libraries: string[] = ['places', 'geometry']
): UseGoogleMapsLoaderReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Prevent multiple script loads
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      return;
    }

    const googleMapScript = document.createElement('script');
    googleMapScript.id = 'google-maps-script';
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${
      apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
    }&v=${version}&libraries=${libraries.join(',')}`;
    googleMapScript.async = true;
    googleMapScript.defer = true;

    const handleScriptLoad = () => {
      setIsLoaded(true);
    };

    const handleScriptError = () => {
      const error = new Error('Google Maps script failed to load');
      setLoadError(error);
      toast.error('Falha ao carregar Google Maps API');
    };

    googleMapScript.addEventListener('load', handleScriptLoad);
    googleMapScript.addEventListener('error', handleScriptError);

    document.head.appendChild(googleMapScript);

    return () => {
      // Clean up event listeners but don't remove the script
      googleMapScript.removeEventListener('load', handleScriptLoad);
      googleMapScript.removeEventListener('error', handleScriptError);
    };
  }, [apiKey, version, libraries]);

  return { isLoaded, loadError };
};

export default useGoogleMapsLoader;
