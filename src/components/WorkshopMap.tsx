
import React, { useState, useEffect, useRef } from 'react';
import { Workshop } from '@/data/workshops';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { oficinasRUIDCAR } from '@/data/oficinasRUIDCAR';
import Map, { Marker, GeolocateControl, NavigationControl } from 'react-map-gl';
import { useMapbox, OficinaWithDistance } from '@/hooks/map/useMapbox';
import MapInfoPopup from '@/components/map/MapInfoPopup';
import 'mapbox-gl/dist/mapbox-gl.css';

interface WorkshopMapProps {
  onSelectWorkshop: (workshop: Workshop) => void;
  workshops: Workshop[];
  onSchedule: () => void;
  onUpdateNearestWorkshops?: (workshops: Workshop[]) => void;
}

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2Fyb2x6aW5oYWRlc291emEyMDExIiwiYSI6ImNtOXhhNzUzOTE1NGMyaW9iY25xeW8xcXoifQ.gOOrD0UKK0cPdoMkUbvvdQ';

const WorkshopMap: React.FC<WorkshopMapProps> = ({ 
  onSelectWorkshop,
  onSchedule,
  workshops,
  onUpdateNearestWorkshops 
}) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedOficina, setSelectedOficina] = useState<OficinaWithDistance | null>(null);
  
  const {
    userLocation,
    nearestOficinas,
    nearestWorkshops,
    isLocating,
    handleLocateOficinas,
    viewport,
    setViewport
  } = useMapbox();

  // Update parent component with nearest workshops when they change
  useEffect(() => {
    if (nearestWorkshops && nearestWorkshops.length > 0 && onUpdateNearestWorkshops) {
      onUpdateNearestWorkshops(nearestWorkshops);
    }
  }, [nearestWorkshops, onUpdateNearestWorkshops]);

  // Force rerender map after component mounts to fix blank map issue
  useEffect(() => {
    // Give a little time for the component to fully mount
    const timer = setTimeout(() => {
      console.log("Initializing map with viewport:", viewport);
      setViewport(prev => ({
        ...prev,
        latitude: prev.latitude || -15.77972,
        longitude: prev.longitude || -47.92972,
        zoom: prev.zoom || 4
      }));
      setMapLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleMarkerClick = (oficina: OficinaWithDistance) => {
    setSelectedOficina(oficina);
    
    setViewport({
      latitude: oficina.lat,
      longitude: oficina.lng,
      zoom: 15
    });
  };

  const handleFindNearestWorkshops = () => {
    handleLocateOficinas(oficinasRUIDCAR, workshops);
  };

  return (
    <div className="h-full w-full relative">
      <div className="absolute top-4 right-4 z-10">
        <Button 
          onClick={handleFindNearestWorkshops}
          className="bg-brand-orange hover:bg-opacity-90 text-white flex items-center gap-2 shadow-lg"
          disabled={isLocating}
        >
          <Navigation className="w-4 h-4" />
          {isLocating ? 'Localizando...' : 'Localizar Oficinas'}
        </Button>
      </div>
      
      <Map
        ref={mapRef}
        {...viewport}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMove={evt => setViewport(evt.viewState)}
        attributionControl={true}
        initialViewState={{
          latitude: -15.77972,
          longitude: -47.92972,
          zoom: 4
        }}
      >
        <NavigationControl position="top-left" />
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          position="top-left"
        />
        
        {userLocation && (
          <Marker
            longitude={userLocation.lng}
            latitude={userLocation.lat}
          >
            <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-md" title="Sua localização" />
          </Marker>
        )}
        
        {nearestOficinas.length > 0 ? 
          nearestOficinas.map((oficina) => (
            <Marker
              key={oficina.nome}
              longitude={oficina.lng}
              latitude={oficina.lat}
              onClick={() => handleMarkerClick(oficina)}
            >
              <div className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="#FF6600"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 7v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7"></path>
                  <rect width="20" height="5" x="2" y="3" rx="2"></rect>
                  <circle cx="12" cy="14" r="2"></circle>
                </svg>
              </div>
            </Marker>
          ))
        : 
          oficinasRUIDCAR.slice(0, 10).map((oficina) => (
            <Marker
              key={oficina.nome}
              longitude={oficina.lng}
              latitude={oficina.lat}
            >
              <div className="cursor-pointer opacity-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="#94a3b8"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 7v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7"></path>
                  <rect width="20" height="5" x="2" y="3" rx="2"></rect>
                  <circle cx="12" cy="14" r="2"></circle>
                </svg>
              </div>
            </Marker>
          ))
        }
        
        {selectedOficina && (
          <MapInfoPopup
            oficina={selectedOficina}
            onClose={() => setSelectedOficina(null)}
          />
        )}
      </Map>
    </div>
  );
};

export default WorkshopMap;
