
import React from 'react';
import { Popup } from 'react-map-gl';
import { OficinaWithDistance } from '@/hooks/map/useMapbox';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone } from 'lucide-react';

interface MapInfoPopupProps {
  oficina: OficinaWithDistance;
  onClose: () => void;
}

const MapInfoPopup: React.FC<MapInfoPopupProps> = ({ oficina, onClose }) => {
  return (
    <Popup
      longitude={oficina.lng}
      latitude={oficina.lat}
      onClose={onClose}
      closeButton={true}
      closeOnClick={false}
      anchor="bottom"
      className="map-popup-custom z-50"
      maxWidth="300px"
    >
      <div className="p-4 max-w-xs bg-white rounded-md">
        <h3 className="font-semibold mb-2 text-gray-900">{oficina.nome}</h3>
        <div className="flex items-start gap-2 mb-2">
          <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-gray-500" />
          <p className="text-sm text-gray-700">{oficina.endereco}</p>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Phone className="w-4 h-4 text-gray-500" />
          <p className="text-sm text-gray-700">{oficina.telefone || 'Telefone não disponível'}</p>
        </div>
        <Badge variant="outline" className="mt-2 bg-brand-orange/10 text-brand-orange border-brand-orange">
          {oficina.distance.toFixed(1)} km de distância
        </Badge>
      </div>
    </Popup>
  );
};

export default MapInfoPopup;
