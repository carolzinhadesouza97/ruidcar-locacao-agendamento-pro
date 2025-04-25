
import React, { useState, useCallback, useRef } from 'react';
import { Workshop } from '@/data/workshops';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { oficinasRUIDCAR } from '@/data/oficinasRUIDCAR';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

// Extended interface to include distance property
interface OficinaWithDistance extends Workshop {
  distance: number;
}

interface WorkshopMapProps {
  onSelectWorkshop: (workshop: Workshop) => void;
  workshops: Workshop[];
  onSchedule: () => void;
}

// Define o estilo do mapa
const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

// Centro inicial do mapa (Brasil)
const center = {
  lat: -15.77972,
  lng: -47.92972
};

// Opções do mapa
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
  
  const [selectedOficina, setSelectedOficina] = useState<OficinaWithDistance | null>(null);
  const [nearestOficinas, setNearestOficinas] = useState<OficinaWithDistance[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  
  // Carrega a API do Google Maps
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyC4k4JCq9xSBL7gWhN_v7Rf6ps0BQlQbac',
    libraries: ['geometry', 'places']
  });
  
  // Callback quando o mapa é carregado
  const onMapLoad = useCallback((map: google.maps.Map) => {
    console.log("Mapa carregado com sucesso!");
    setMapInstance(map);
  }, []);

  // Callback para limpar a referência quando o mapa é desmontado
  const onUnmount = useCallback(() => {
    setMapInstance(null);
  }, []);

  const handleLocateOficinas = useCallback(() => {
    if (!isLoaded || !mapInstance) {
      toast.error("Google Maps não está carregado ainda. Tente novamente em alguns segundos.");
      return;
    }
    
    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: userLat, longitude: userLng } = position.coords;
        const userLoc = { lat: userLat, lng: userLng };
        setUserLocation(userLoc);
        
        // Calcular distâncias usando Google Maps Geometry Library
        const computeDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number => {
          const p1 = new google.maps.LatLng(point1.lat, point1.lng);
          const p2 = new google.maps.LatLng(point2.lat, point2.lng);
          const distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
          return parseFloat((distanceInMeters / 1000).toFixed(2)); // Converter para km com 2 casas decimais
        };
        
        const oficinasWithDistance: OficinaWithDistance[] = oficinasRUIDCAR.map(oficina => ({
          ...oficina as unknown as Workshop, // Type cast necessário
          distance: computeDistance(userLoc, { lat: oficina.lat, lng: oficina.lng })
        }));

        const nearest = oficinasWithDistance
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5);

        setNearestOficinas(nearest);
        
        if (mapInstance && nearest.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(new google.maps.LatLng(userLat, userLng));
          
          nearest.forEach(oficina => {
            bounds.extend(new google.maps.LatLng(oficina.lat, oficina.lng));
          });
          
          mapInstance.fitBounds(bounds);
          
          // Ajustar zoom se estiver muito aproximado
          google.maps.event.addListenerOnce(mapInstance, 'bounds_changed', () => {
            if (mapInstance.getZoom() && mapInstance.getZoom() > 12) {
              mapInstance.setZoom(12);
            }
          });
        }

        setIsLocating(false);
        toast.success('Oficinas próximas encontradas!');
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        toast.error(`Não foi possível obter sua localização: ${error.message}`);
        setIsLocating(false);
      }
    );
  }, [mapInstance, isLoaded]);

  const handleMarkerClick = (oficina: OficinaWithDistance) => {
    setSelectedOficina(oficina);
    setShowInfoWindow(true);
    
    if (mapInstance) {
      mapInstance.panTo({ lat: oficina.lat, lng: oficina.lng });
      mapInstance.setZoom(15);
    }
  };

  // Renderiza conteúdo baseado no estado de carregamento
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
          onClick={handleLocateOficinas}
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
        {/* Marcador da posição do usuário */}
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
        
        {/* Marcadores das oficinas */}
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
        
        {/* InfoWindow para oficina selecionada */}
        {selectedOficina && showInfoWindow && (
          <InfoWindow
            position={{ lat: selectedOficina.lat, lng: selectedOficina.lng }}
            onCloseClick={() => setShowInfoWindow(false)}
          >
            <div className="p-4 max-w-xs">
              <h3 className="font-semibold mb-2">{selectedOficina.nome}</h3>
              <p className="text-sm mb-1">{selectedOficina.endereco}</p>
              <p className="text-sm mb-2">{selectedOficina.telefone}</p>
              <p className="text-sm text-orange-500 font-semibold">
                {selectedOficina.distance.toFixed(2)} km de distância
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default WorkshopMap;
