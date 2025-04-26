
import React from 'react';
import { Workshop } from '@/types/workshops';
import { Popup } from 'react-leaflet';

interface WorkshopPopupProps {
  workshop: Workshop;
  onSelectWorkshop: (workshop: Workshop) => void;
}

const WorkshopPopup: React.FC<WorkshopPopupProps> = ({ workshop, onSelectWorkshop }) => {
  return (
    <Popup>
      <div className="p-1 max-w-[200px] xs:max-w-xs sm:p-2">
        <h3 className="font-semibold text-sm sm:mb-2">{workshop.name}</h3>
        <p className="text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2">{workshop.address || `${workshop.city}, ${workshop.state}`}</p>
        <p className="text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2">{workshop.phone || 'Telefone não disponível'}</p>
        {workshop.distance && (
          <p className="text-xs sm:text-sm text-brand-orange">
            {workshop.distance.toFixed(1)} km de distância
          </p>
        )}
        <button 
          onClick={() => onSelectWorkshop(workshop)}
          className="text-xs sm:text-sm text-brand-orange hover:text-brand-orange-dark mt-1"
        >
          Ver detalhes
        </button>
      </div>
    </Popup>
  );
};

export default WorkshopPopup;
