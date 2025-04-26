
import React, { useState } from 'react';
import { Workshop } from '@/types/workshops';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet to fix the L namespace error
import 'leaflet/dist/leaflet.css';
import { useIsMobile } from '@/hooks/use-mobile';
import MapControls from './map/MapControls';
import MapUpdater from './map/MapUpdater';
import WorkshopPopup from './map/WorkshopPopup';
import { useMapbox } from '@/hooks/map/useMapbox';
import { workshopIcon, userLocationIcon } from './map/MapIcons';

interface WorkshopMapProps {
  onSelectWorkshop: (workshop: Workshop) => void;
  workshops: Workshop[];
  onSchedule: () => void;
  onUpdateNearestWorkshops?: (workshops: Workshop[]) => void;
}

const WorkshopMap: React.FC<WorkshopMapProps> = ({
  onSelectWorkshop,
  workshops,
  onUpdateNearestWorkshops,
}) => {
  const {
    userLocation,
    nearestWorkshops,
    isLocating,
    handleLocateWorkshops,
    viewport
  } = useMapbox();
  
  const [showAllWorkshops, setShowAllWorkshops] = useState(true);
  const [displayedWorkshops, setDisplayedWorkshops] = useState<Workshop[]>(workshops);
  const defaultCenter: L.LatLngExpression = [-15.77972, -47.92972];
  const isMobile = useIsMobile();

  const handleLocateClick = () => {
    handleLocateWorkshops(workshops);
  };

  const toggleWorkshopsDisplay = () => {
    if (showAllWorkshops) {
      setDisplayedWorkshops(nearestWorkshops);
      if (onUpdateNearestWorkshops) {
        onUpdateNearestWorkshops(nearestWorkshops);
      }
    } else {
      setDisplayedWorkshops(workshops);
      if (onUpdateNearestWorkshops) {
        onUpdateNearestWorkshops(workshops);
      }
    }
    setShowAllWorkshops(!showAllWorkshops);
  };

  return (
    <div className="h-full w-full relative">
      <MapControls 
        userLocation={userLocation}
        showAllWorkshops={showAllWorkshops}
        isLocating={isLocating}
        onToggleDisplay={toggleWorkshopsDisplay}
        onLocate={handleLocateClick}
        isMobile={isMobile}
      />
      
      <MapContainer
        style={{ width: '100%', height: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater 
          center={userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter} 
          zoom={userLocation ? 12 : 5}
        />

        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]}
          >
            <WorkshopPopup 
              workshop={{
                id: 'user-location',
                name: 'Sua localização',
                address: '',
                lat: userLocation.lat,
                lng: userLocation.lng,
                phone: '',
                distance: 0
              } as Workshop} 
              onSelectWorkshop={() => {}}
            />
          </Marker>
        )}

        {displayedWorkshops.map((workshop) => (
          <Marker
            key={workshop.id}
            position={[workshop.lat, workshop.lng]}
            eventHandlers={{
              click: () => onSelectWorkshop(workshop),
            }}
          >
            <WorkshopPopup workshop={workshop} onSelectWorkshop={onSelectWorkshop} />
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default WorkshopMap;
