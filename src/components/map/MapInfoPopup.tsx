
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
      className="map-popup-custom"
    >
      <div className="p-4 max-w-xs bg-white rounded-md shadow-md">
        <h3 className="font-semibold mb-2 text-gray-900">{oficina.nome}</h3>
        <p className="text-sm mb-1 text-gray-700">{oficina.endereco}</p>
        <p className="text-sm mb-2 text-gray-700">{oficina.telefone}</p>
        <p className="text-sm text-orange-500 font-semibold">
          {oficina.distance.toFixed(2)} km de distância
        </p>
      </div>
    </Popup>
  );
};

export default MapInfoPopup;
