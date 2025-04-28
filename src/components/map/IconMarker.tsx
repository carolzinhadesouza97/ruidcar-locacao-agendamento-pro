
import React from 'react';
import { Marker, MarkerProps } from 'react-leaflet';
import L from 'leaflet';

// Interface for our custom marker that includes the icon and children
interface IconMarkerProps {
  position: L.LatLngExpression;
  icon?: L.Icon;
  children?: React.ReactNode;
  eventHandlers?: any;
}

// Componente de marcador personalizado que lida corretamente com o ícone
const IconMarker: React.FC<IconMarkerProps> = ({ 
  icon, 
  children, 
  position, 
  eventHandlers,
  ...props 
}) => {
  return (
    <Marker 
      position={position}
      eventHandlers={eventHandlers}
      {...props}
    >
      {children}
    </Marker>
  );
};

export default IconMarker;
