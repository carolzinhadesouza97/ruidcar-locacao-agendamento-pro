
import React from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { OficinaWithDistance } from '@/hooks/map/useMapLocation';

interface MapInfoWindowProps {
  oficina: OficinaWithDistance;
  onClose: () => void;
}

const MapInfoWindow: React.FC<MapInfoWindowProps> = ({ oficina, onClose }) => {
  return (
    <InfoWindow
      position={{ lat: oficina.lat, lng: oficina.lng }}
      onCloseClick={onClose}
    >
      <div className="p-4 max-w-xs">
        <h3 className="font-semibold mb-2">{oficina.nome}</h3>
        <p className="text-sm mb-1">{oficina.endereco}</p>
        <p className="text-sm mb-2">{oficina.telefone}</p>
        <p className="text-sm text-orange-500 font-semibold">
          {oficina.distance.toFixed(2)} km de distância
        </p>
      </div>
    </InfoWindow>
  );
};

export default MapInfoWindow;
