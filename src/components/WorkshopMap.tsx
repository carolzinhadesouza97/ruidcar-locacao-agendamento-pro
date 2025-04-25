
import React from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { Workshop } from '@/data/workshops';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { useWorkshopLocator } from '@/hooks/useWorkshopLocator';

interface WorkshopMapProps {
  onSelectWorkshop: (workshop: Workshop) => void;
  workshops: Workshop[];
}

const WorkshopMap: React.FC<WorkshopMapProps> = ({ 
  onSelectWorkshop,
  workshops
}) => {
  const {
    userLocation,
    nearestWorkshops,
    isLocating,
    mapRef,
    locateWorkshops
  } = useWorkshopLocator();

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    
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
    locateWorkshops(workshops);
  };

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
        <GoogleMap
          center={{ lat: -15.77972, lng: -47.92972 }}
          zoom={5}
          onLoad={handleMapLoad}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
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
          }}
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
            />
          )}

          {(nearestWorkshops.length ? nearestWorkshops : workshops).map((workshop) => (
            <Marker
              key={workshop.id}
              position={{ lat: workshop.lat, lng: workshop.lng }}
              onClick={() => onSelectWorkshop(workshop)}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${nearestWorkshops.includes(workshop) ? '#FF6600' : '#666666'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                `),
                scaledSize: new google.maps.Size(
                  nearestWorkshops.includes(workshop) ? 40 : 32,
                  nearestWorkshops.includes(workshop) ? 40 : 32
                ),
                anchor: new google.maps.Point(
                  nearestWorkshops.includes(workshop) ? 20 : 16,
                  nearestWorkshops.includes(workshop) ? 40 : 32
                ),
              }}
            >
              <InfoWindow>
                <div className="p-2">
                  <h3 className="font-semibold text-lg">{workshop.name}</h3>
                  <p>{workshop.address}</p>
                  <p>{workshop.city}, {workshop.state}</p>
                  {workshop.distance && (
                    <p className="text-sm text-green-600">
                      {workshop.distance.toFixed(1)} km de distância
                    </p>
                  )}
                </div>
              </InfoWindow>
            </Marker>
          ))}
        </GoogleMap>
      </div>
    </div>
  );
};

export default WorkshopMap;
