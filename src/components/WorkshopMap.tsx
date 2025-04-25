import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Workshop } from '@/data/workshops';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { useWorkshopLocator } from '@/hooks/useWorkshopLocator';
import { workshopsData } from '@/data/workshops';
import WorkshopDetails from './WorkshopDetails';

interface WorkshopMapProps {
  onSelectWorkshop: (workshop: Workshop) => void;
  workshops?: Workshop[];
  onSchedule: () => void;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: -15.77972,
  lng: -47.92972
};

const mapOptions = {
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ],
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
};

const WorkshopMap: React.FC<WorkshopMapProps> = ({ 
  onSelectWorkshop,
  workshops = workshopsData,
  onSchedule
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  const {
    userLocation,
    nearestWorkshops,
    isLocating,
    locateWorkshops,
    selectedWorkshop,
    selectWorkshop,
    clearSelectedWorkshop
  } = useWorkshopLocator();

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyC4k4JCq9xSBL7gWhN_v7Rf6ps0BQlQbac',
    libraries: ['places', 'geometry']
  });

  const handleMarkerClick = (workshop: Workshop) => {
    selectWorkshop(workshop);
    onSelectWorkshop(workshop);
  };

  if (loadError) {
    return <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
      Erro ao carregar o Google Maps. Verifique sua conexão.
    </div>;
  }

  if (!isLoaded) {
    return <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
      Carregando o mapa...
    </div>;
  }

  return (
    <div className="h-full w-full flex flex-col relative">
      <div className="absolute top-4 right-4 z-10">
        <Button 
          onClick={() => locateWorkshops(workshops, map)}
          className="bg-brand-orange hover:bg-opacity-90 text-white flex items-center gap-2 shadow-lg"
          disabled={isLocating}
        >
          <Navigation className="w-4 h-4" />
          {isLocating ? 'Localizando...' : 'Localizar Oficinas'}
        </Button>
      </div>

      {selectedWorkshop && (
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
          <WorkshopDetails 
            workshop={selectedWorkshop}
            onBack={clearSelectedWorkshop}
            onSchedule={onSchedule}
          />
        </div>
      )}

      <div className="h-full w-full rounded-lg shadow-md">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={5}
          onLoad={setMap}
          options={mapOptions}
        >
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new google.maps.Size(40, 40),
              }}
            />
          )}

          {(nearestWorkshops.length > 0 ? nearestWorkshops : workshops).map((workshop) => (
            <Marker
              key={workshop.id}
              position={{ lat: workshop.lat, lng: workshop.lng }}
              onClick={() => handleMarkerClick(workshop)}
              icon={{
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                fillColor: nearestWorkshops.includes(workshop) ? '#FF6600' : '#666666',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
                scale: workshop.id === selectedWorkshop?.id ? 10 : (nearestWorkshops.includes(workshop) ? 8 : 6),
              }}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
};

export default WorkshopMap;
