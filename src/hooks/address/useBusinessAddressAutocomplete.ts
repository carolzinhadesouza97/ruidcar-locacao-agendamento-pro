
import { useState, useCallback, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { useMapboxServices } from '@/hooks/useMapboxServices';
import { useBusinessDetails } from './useBusinessDetails';
import type { BusinessData } from './useBusinessDetails';

interface UseBusinessAddressAutocompleteProps {
  form: UseFormReturn<any>;
  onBusinessSelected?: (business: BusinessData) => void;
}

export const useBusinessAddressAutocomplete = ({ 
  form, 
  onBusinessSelected 
}: UseBusinessAddressAutocompleteProps) => {
  const { isLoaded, getAddressSuggestions, getPlaceDetails } = useMapboxServices();
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressValidated, setAddressValidated] = useState(false);
  const { handlePlaceDetails } = useBusinessDetails(form, onBusinessSelected);

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = useCallback(
    debounce(async (input: string) => {
      if (!input || input.length < 3 || !isLoaded) return;
      
      setIsLoading(true);
      try {
        const results = await getAddressSuggestions(input);
        const sortedResults = [...results].sort((a, b) => {
          const aIsBusiness = a.types?.includes('establishment') ? 1 : 0;
          const bIsBusiness = b.types?.includes('establishment') ? 1 : 0;
          return bIsBusiness - aIsBusiness;
        });
        
        setSuggestions(sortedResults);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [isLoaded, getAddressSuggestions]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setAddressValidated(false);
    form.setValue('address', value, { shouldValidate: false });
    fetchSuggestions(value);
  };

  const handleSelectSuggestion = async (suggestion: any) => {
    setIsLoading(true);
    try {
      const placeDetails = await getPlaceDetails(suggestion.place_id);
      const fullAddress = handlePlaceDetails(placeDetails);
      setInputValue(fullAddress);
      setAddressValidated(true);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Error getting place details:', error);
      toast.error('Could not load business details.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inputValue,
    suggestions,
    isLoading,
    showSuggestions,
    addressValidated,
    setShowSuggestions,
    handleInputChange,
    handleSelectSuggestion,
    mapRef: useRef<HTMLDivElement>(null),
  };
};
