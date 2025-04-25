
import { useState, useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { WorkshopFormInput } from '@/schemas/workshopSchema';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

interface UseAddressAutocompleteProps {
  form: UseFormReturn<WorkshopFormInput>;
  mapRef: React.RefObject<HTMLDivElement>;
}

export const useAddressAutocomplete = ({ form, mapRef }: UseAddressAutocompleteProps) => {
  const { isLoaded, getAddressSuggestions, getPlaceDetails } = useGoogleMaps(mapRef);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressValidated, setAddressValidated] = useState(false);

  // Update inputValue when form value changes
  useEffect(() => {
    const addressValue = form.getValues('address');
    if (addressValue && addressValue !== inputValue) {
      setInputValue(addressValue);
    }
  }, [form, inputValue]);

  // Function to debounce API calls
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(
    debounce(async (input: string) => {
      if (!input || input.length < 3 || !isLoaded) return;
      
      setIsLoading(true);
      try {
        const results = await getAddressSuggestions(input);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
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

  const handleSelectSuggestion = async (suggestion: google.maps.places.AutocompletePrediction) => {
    setIsLoading(true);
    try {
      console.log("Obtendo detalhes para o place_id:", suggestion.place_id);
      const placeDetails = await getPlaceDetails(suggestion.place_id);
      
      // Extract address information
      let streetNumber = '';
      let route = '';
      let city = '';
      let state = '';
      let zipCode = '';
      
      if (placeDetails.address_components) {
        placeDetails.address_components.forEach(component => {
          if (component.types.includes('street_number')) {
            streetNumber = component.long_name;
          } else if (component.types.includes('route')) {
            route = component.long_name;
          } else if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
            city = component.long_name;
          } else if (component.types.includes('administrative_area_level_1')) {
            state = component.short_name;
          } else if (component.types.includes('postal_code')) {
            zipCode = component.long_name.replace('-', '');
          }
        });
      }
      
      // Check if it's a business place
      const isBusinessPlace = placeDetails.types?.some(type => 
        ['establishment', 'point_of_interest', 'store', 'car_repair'].includes(type)
      );
      
      const formattedAddress = placeDetails.formatted_address || '';
      const addressParts = formattedAddress.split(',');
      
      // For business locations, use name + address
      let fullAddress = '';
      if (isBusinessPlace && placeDetails.name) {
        fullAddress = placeDetails.name;
      } else if (route) {
        fullAddress = route + (streetNumber ? ', ' + streetNumber : '');
      } else if (addressParts.length > 0) {
        fullAddress = addressParts[0].trim();
      }
      
      // Update form with place details
      form.setValue('address', fullAddress, { shouldValidate: true });
      setInputValue(fullAddress);
      
      if (city) {
        form.setValue('city', city, { shouldValidate: true });
      } else if (addressParts.length > 1) {
        const possibleCity = addressParts[1].trim();
        if (possibleCity) {
          form.setValue('city', possibleCity, { shouldValidate: true });
        }
      }
      
      if (state) {
        form.setValue('state', state, { shouldValidate: true });
      }
      
      if (zipCode) {
        form.setValue('zipCode', zipCode, { shouldValidate: true });
      }
      
      setAddressValidated(true);
      setShowSuggestions(false);
      toast.success('Endereço validado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao obter detalhes do lugar:', error);
      toast.error('Não foi possível validar o endereço selecionado.');
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
  };
};
