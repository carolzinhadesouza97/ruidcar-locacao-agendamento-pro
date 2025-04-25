
import React from 'react';
import { Popup } from 'react-map-gl';
import { OficinaWithDistance } from '@/hooks/map/useMapbox';

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
    >
      <div className="p-4 max-w-xs">
        <h3 className="font-semibold mb-2">{oficina.nome}</h3>
        <p className="text-sm mb-1">{oficina.endereco}</p>
        <p className="text-sm mb-2">{oficina.telefone}</p>
        <p className="text-sm text-orange-500 font-semibold">
          {oficina.distance.toFixed(2)} km de distância
        </p>
      </div>
    </Popup>
  );
};

export default MapInfoPopup;
