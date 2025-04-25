import React, { useState, useCallback, useRef } from 'react';
import { Workshop } from '@/data/workshops';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { oficinasRUIDCAR } from '@/data/oficinasRUIDCAR';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useMapLocation, OficinaWithDistance } from '@/hooks/map/useMapLocation';
import MapInfoWindow from '@/components/map/MapInfoWindow';

interface WorkshopMapProps {
  onSelectWorkshop: (workshop: Workshop) => void;
  workshops: Workshop[];
  onSchedule: () => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: -15.77972,
  lng: -47.92972
};

const mapOptions = {
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

const WorkshopMap: React.FC<WorkshopMapProps> = ({ 
  onSelectWorkshop,
  onSchedule 
}) => {
  const mapRef = useRef<GoogleMap>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [selectedOficina, setSelectedOficina] = useState<OficinaWithDistance | null>(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyC4k4JCq9xSBL7gWhN_v7Rf6ps0BQlQbac',
    libraries: ['geometry', 'places']
  });

  const {
    userLocation,
    nearestOficinas,
    isLocating,
    handleLocateOficinas
  } = useMapLocation(mapInstance);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    console.log("Mapa carregado com sucesso!");
    setMapInstance(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMapInstance(null);
  }, []);

  const handleMarkerClick = (oficina: OficinaWithDistance) => {
    setSelectedOficina(oficina);
    setShowInfoWindow(true);
    
    if (mapInstance) {
      mapInstance.panTo({ lat: oficina.lat, lng: oficina.lng });
      mapInstance.setZoom(15);
    }
  };

  if (loadError) {
    console.error("Erro ao carregar o Google Maps:", loadError);
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <p className="text-red-500">Erro ao carregar o Google Maps: {loadError.message}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <p className="text-brand-gray">Carregando Google Maps...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <div className="absolute top-4 right-4 z-10">
        <Button 
          onClick={() => handleLocateOficinas(oficinasRUIDCAR)}
          className="bg-brand-orange hover:bg-opacity-90 text-white flex items-center gap-2 shadow-lg"
          disabled={isLocating}
        >
          <Navigation className="w-4 h-4" />
          {isLocating ? 'Localizando...' : 'Localizar Oficinas'}
        </Button>
      </div>
      
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={5}
        options={mapOptions}
        onLoad={onMapLoad}
        onUnmount={onUnmount}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#3b82f6" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              `),
              scaledSize: new google.maps.Size(36, 36),
              anchor: new google.maps.Point(18, 18),
            }}
            title="Sua localização"
          />
        )}
        
        {nearestOficinas.length > 0 ? 
          nearestOficinas.map((oficina) => (
            <Marker
              key={oficina.nome}
              position={{ lat: oficina.lat, lng: oficina.lng }}
              onClick={() => handleMarkerClick(oficina)}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6600" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 7v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7"></path>
                    <rect width="20" height="5" x="2" y="3" rx="2"></rect>
                    <circle cx="12" cy="14" r="2"></circle>
                  </svg>
                `),
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 40),
              }}
            />
          ))
        : 
          oficinasRUIDCAR.slice(0, 10).map((oficina) => (
            <Marker
              key={oficina.nome}
              position={{ lat: oficina.lat, lng: oficina.lng }}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 7v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7"></path>
                    <rect width="20" height="5" x="2" y="3" rx="2"></rect>
                    <circle cx="12" cy="14" r="2"></circle>
                  </svg>
                `),
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 32),
              }}
            />
          ))
        }
        
        {selectedOficina && showInfoWindow && (
          <MapInfoWindow
            oficina={selectedOficina}
            onClose={() => setShowInfoWindow(false)}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default WorkshopMap;
