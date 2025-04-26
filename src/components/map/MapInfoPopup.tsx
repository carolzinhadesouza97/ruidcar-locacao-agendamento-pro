
import React from 'react';
import { Popup } from 'react-map-gl';
import { WorkshopWithDistance } from '@/hooks/map/useMapbox';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone } from 'lucide-react';

interface MapInfoPopupProps {
  workshop: WorkshopWithDistance;
  onClose: () => void;
}

const MapInfoPopup: React.FC<MapInfoPopupProps> = ({ workshop, onClose }) => {
  return (
    <Popup
      longitude={workshop.lng}
      latitude={workshop.lat}
      onClose={onClose}
      closeButton={true}
      closeOnClick={false}
      anchor="bottom"
      className="map-popup-custom z-50"
      maxWidth="300px"
    >
      <div className="p-4 max-w-xs bg-white rounded-md">
        <h3 className="font-semibold mb-2 text-gray-900">{workshop.name}</h3>
        <div className="flex items-start gap-2 mb-2">
          <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-gray-500" />
          <p className="text-sm text-gray-700">{workshop.address}</p>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Phone className="w-4 h-4 text-gray-500" />
          <p className="text-sm text-gray-700">{workshop.phone || 'Telefone não disponível'}</p>
        </div>
        <Badge variant="outline" className="mt-2 bg-brand-orange/10 text-brand-orange border-brand-orange">
          {workshop.distance.toFixed(1)} km de distância
        </Badge>
      </div>
    </Popup>
  );
};

export default MapInfoPopup;
