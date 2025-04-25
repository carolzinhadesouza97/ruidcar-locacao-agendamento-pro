
import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Workshop } from '@/data/workshops';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { useWorkshopLocator } from '@/hooks/useWorkshopLocator';
import { workshopsData } from '@/data/workshops';

interface WorkshopMapProps {
  onSelectWorkshop: (workshop: Workshop) => void;
  workshops?: Workshop[];
}

// Map container style
const containerStyle = {
  width: '100%',
  height: '100%'
};

// Default center (Brazil)
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
  workshops = workshopsData // Use default value from data/workshops.ts
}) => {
  const {
    userLocation,
    nearestWorkshops,
    isLocating,
    locateWorkshops
  } = useWorkshopLocator();

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const handleMapLoad = (map: google.maps.Map) => {
    setMap(map);
    
    const bounds = new google.maps.LatLngBounds();
    workshops.forEach(workshop => {
      bounds.extend({ lat: workshop.lat, lng: workshop.lng });
    });
    map.fitBounds(bounds);
  };

  const handleLocateWorkshops = () => {
    if (!workshops.length) {
      toast.error('Nenhuma oficina disponível no momento');
      return;
    }
    locateWorkshops(workshops, map);
  };

  // Determine which workshops to display (nearest or all)
  const workshopsToDisplay = nearestWorkshops.length ? nearestWorkshops : workshops;

  return (
    <div className="h-full w-full flex flex-col relative">
      <div className="absolute top-4 right-4 z-10">
        <Button 
          onClick={handleLocateWorkshops}
          className="bg-brand-orange hover:bg-opacity-90 text-white flex items-center gap-2 shadow-lg"
          disabled={isLocating}
        >
          <Navigation className="w-4 h-4" />
          {isLocating ? 'Localizando...' : 'Localizar Oficinas'}
        </Button>
      </div>

      <div className="h-full w-full rounded-lg shadow-md">
        <LoadScript googleMapsApiKey="AIzaSyC4k4JCq9xSBL7gWhN_v7Rf6ps0BQlQbac">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={5}
            onLoad={handleMapLoad}
            options={mapOptions}
          >
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: '#3b82f6',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 2,
                  scale: 8,
                }}
              />
            )}

            {workshopsToDisplay.map((workshop) => (
              <Marker
                key={workshop.id}
                position={{ lat: workshop.lat, lng: workshop.lng }}
                onClick={() => onSelectWorkshop(workshop)}
                icon={{
                  path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                  fillColor: nearestWorkshops.includes(workshop) ? '#FF6600' : '#666666',
                  fillOpacity: 1,
                  strokeColor: '#FFFFFF',
                  strokeWeight: 2,
                  scale: nearestWorkshops.includes(workshop) ? 8 : 6,
                }}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default WorkshopMap;
