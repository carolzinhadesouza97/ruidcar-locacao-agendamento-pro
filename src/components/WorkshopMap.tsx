
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Workshop } from '@/data/workshops';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { oficinasRUIDCAR } from '@/data/oficinasRUIDCAR';
import Map, { Marker, GeolocateControl, NavigationControl } from 'react-map-gl';
import { useMapbox, OficinaWithDistance, MapViewport } from '@/hooks/map/useMapbox';
import MapInfoPopup from '@/components/map/MapInfoPopup';
import 'mapbox-gl/dist/mapbox-gl.css';

interface WorkshopMapProps {
  onSelectWorkshop: (workshop: Workshop) => void;
  workshops: Workshop[];
  onSchedule: () => void;
  onUpdateNearestWorkshops?: (workshops: Workshop[]) => void;
}

// Use import.meta.env instead of process.env for Vite
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiY2Fyb2x6aW5oYWRlc291emEyMDExIiwiYSI6ImNtOXhhNzUzOTE1NGMyaW9iY25xeW8xcXoifQ.gOOrD0UKK0cPdoMkUbvvdQ';

const WorkshopMap: React.FC<WorkshopMapProps> = ({ 
  onSelectWorkshop,
  onSchedule,
  workshops,
  onUpdateNearestWorkshops 
}) => {
  const mapRef = useRef<any>(null);
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

  const handleFindNearestWorkshops = useCallback(() => {
    handleLocateOficinas(oficinasRUIDCAR, workshops);
  }, [handleLocateOficinas, workshops]);

  // Otimização: Memorize os markers para evitar re-renderizações desnecessárias
  const renderMarkers = useCallback(() => {
    return nearestOficinas.map((oficina) => (
      <Marker
        key={`${oficina.nome}-${oficina.lat}-${oficina.lng}`}
        longitude={oficina.lng}
        latitude={oficina.lat}
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          setSelectedOficina(oficina);
          setViewport({
            latitude: oficina.lat,
            longitude: oficina.lng,
            zoom: 15,
            transitionDuration: 500
          });
        }}
      >
        <div className="cursor-pointer transform hover:scale-110 transition-transform">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="#22c55e"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-lg"
          >
            <path d="M19 7v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7"></path>
            <rect width="20" height="5" x="2" y="3" rx="2"></rect>
            <circle cx="12" cy="14" r="2"></circle>
          </svg>
        </div>
      </Marker>
    ));
  }, [nearestOficinas, setViewport]);

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
        attributionControl={false}
        reuseMaps
        maxZoom={16}
        minZoom={2}
        cooperativeGestures={true}
        dragRotate={false}
        touchPitch={false}
        optimizeForTerrain={false}
        renderWorldCopies={true}
      >
        <NavigationControl position="top-left" visualizePitch={false} />
        <GeolocateControl
          position="top-left"
          trackUserLocation
          showUserLocation
          onGeolocate={(e) => {
            setViewport({
              latitude: e.coords.latitude,
              longitude: e.coords.longitude,
              zoom: 13,
              transitionDuration: 1000
            });
          }}
        />
        
        {userLocation && (
          <Marker
            longitude={userLocation.lng}
            latitude={userLocation.lat}
          >
            <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-md" title="Sua localização" />
          </Marker>
        )}
        
        {renderMarkers()}
        
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
