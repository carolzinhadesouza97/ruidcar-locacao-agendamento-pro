
import React, { useEffect, useState } from 'react';
import { Workshop } from '@/types/workshops';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { findNearestWorkshops } from '@/utils/distance';
import MapControls from './map/MapControls';
import MapUpdater from './map/MapUpdater';
import WorkshopPopup from './map/WorkshopPopup';
import { userLocationIcon, workshopIcon } from './map/MapIcons';

interface WorkshopMapProps {
  onSelectWorkshop: (workshop: Workshop) => void;
  workshops: Workshop[];
  onSchedule: () => void;
  onUpdateNearestWorkshops?: (workshops: Workshop[]) => void;
}

const WorkshopMap: React.FC<WorkshopMapProps> = ({
  onSelectWorkshop,
  workshops,
  onUpdateNearestWorkshops
}) => {
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
  const [displayedWorkshops, setDisplayedWorkshops] = useState<Workshop[]>(workshops);
  const [showAllWorkshops, setShowAllWorkshops] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const defaultCenter: L.LatLngExpression = [-15.77972, -47.92972];
  const isMobile = useIsMobile();

  const handleLocateWorkshops = () => {
    setIsLocating(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = L.latLng(position.coords.latitude, position.coords.longitude);
          setUserLocation(userLoc);
          
          const nearest = findNearestWorkshops(workshops, userLoc.lat, userLoc.lng, 5);
          
          if (onUpdateNearestWorkshops) {
            onUpdateNearestWorkshops(nearest);
          }
          
          setDisplayedWorkshops(nearest);
          setShowAllWorkshops(false);
          
          setIsLocating(false);
          toast.success('Oficinas próximas encontradas!');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Não foi possível obter sua localização');
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    } else {
      toast.error('Geolocalização não suportada pelo seu navegador');
      setIsLocating(false);
    }
  };

  const toggleWorkshopsDisplay = () => {
    if (showAllWorkshops) {
      if (userLocation) {
        const nearest = findNearestWorkshops(workshops, userLocation.lat, userLocation.lng, 5);
        setDisplayedWorkshops(nearest);
        if (onUpdateNearestWorkshops) {
          onUpdateNearestWorkshops(nearest);
        }
      }
    } else {
      setDisplayedWorkshops(workshops);
      if (onUpdateNearestWorkshops) {
        onUpdateNearestWorkshops(workshops);
      }
    }
    setShowAllWorkshops(!showAllWorkshops);
  };

  useEffect(() => {
    setDisplayedWorkshops(workshops);
  }, [workshops]);

  return (
    <div className="h-full w-full relative">
      <MapControls 
        userLocation={userLocation}
        showAllWorkshops={showAllWorkshops}
        isLocating={isLocating}
        onToggleDisplay={toggleWorkshopsDisplay}
        onLocate={handleLocateWorkshops}
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
