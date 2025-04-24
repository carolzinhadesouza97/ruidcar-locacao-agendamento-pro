
import { useState, useEffect, useRef } from 'react';

export const useGoogleMaps = (mapRef: React.RefObject<HTMLDivElement>) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const googleMapScript = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!window.google && !googleMapScript.current) {
      window.initMap = () => {
        if (mapRef.current) {
          initializeMap();
        }
      };

      googleMapScript.current = document.createElement('script');
      googleMapScript.current.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC4k4JCq9xSBL7gWhN_v7Rf6ps0BQlQbac&libraries=geometry&callback=initMap`;
      googleMapScript.current.async = true;
      googleMapScript.current.defer = true;
      document.head.appendChild(googleMapScript.current);
    } else if (window.google && mapRef.current && !map) {
      initializeMap();
    }

    return () => {
      window.initMap = () => {};
      if (googleMapScript.current && document.head.contains(googleMapScript.current)) {
        document.head.removeChild(googleMapScript.current);
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current) return;

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
  };

  return { map, setMap };
};
