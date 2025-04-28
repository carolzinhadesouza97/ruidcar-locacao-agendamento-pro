
import React from 'react';
import { Marker, MarkerProps } from 'react-leaflet';
import L from 'leaflet';

// Estendendo MarkerProps para incluir a propriedade icon
interface IconMarkerProps extends Omit<MarkerProps, 'icon'> {
  icon?: L.Icon;
  children?: React.ReactNode;
}

// Componente de marcador personalizado que lida corretamente com o ícone
const IconMarker: React.FC<IconMarkerProps> = ({ icon, children, ...props }) => {
  return (
    <Marker 
      {...props}
      icon={icon}
    >
      {children}
    </Marker>
  );
};

export default IconMarker;
