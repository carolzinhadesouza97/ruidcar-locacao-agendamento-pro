
import React from 'react';
import { Marker, MarkerProps } from 'react-leaflet';
import L from 'leaflet';

// Extend MarkerProps to include the icon property
interface IconMarkerProps extends Omit<MarkerProps, 'icon'> {
  icon?: L.Icon;
  children?: React.ReactNode;
}

// Custom marker component that handles the icon correctly
const IconMarker: React.FC<IconMarkerProps> = ({ icon, children, ...props }) => {
  // Use internal ref to set the icon on the leaflet element
  return (
    <Marker 
      {...props}
      // @ts-ignore - We know this prop exists in Leaflet even if the types don't recognize it
      icon={icon}
    >
      {children}
    </Marker>
  );
};

export default IconMarker;
