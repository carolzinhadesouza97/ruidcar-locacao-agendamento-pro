
import React from 'react';
import { Store, Building, MapPin } from "lucide-react";

interface SuggestionsListProps {
  suggestions: google.maps.places.AutocompletePrediction[];
  onSelectSuggestion: (suggestion: google.maps.places.AutocompletePrediction) => void;
  suggestionsRef: React.RefObject<HTMLDivElement>;
}

export const SuggestionsList: React.FC<SuggestionsListProps> = ({
  suggestions,
  onSelectSuggestion,
  suggestionsRef,
}) => {
  const getPlaceIcon = (suggestion: google.maps.places.AutocompletePrediction) => {
    const types = suggestion.types || [];
    
    if (types.includes('establishment')) {
      return <Store className="h-4 w-4 text-brand-orange flex-shrink-0" />;
    } else if (types.includes('street_address') || types.includes('route')) {
      return <Building className="h-4 w-4 text-blue-500 flex-shrink-0" />;
    } else {
      return <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
    }
  };

  return (
    <div 
      ref={suggestionsRef} 
      className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto"
    >
      {suggestions.map((suggestion) => (
        <div
          key={suggestion.place_id}
          className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
          onClick={() => onSelectSuggestion(suggestion)}
        >
          {getPlaceIcon(suggestion)}
          <span className="text-sm">{suggestion.description}</span>
        </div>
      ))}
    </div>
  );
};
