
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useMapboxServices, AutocompletePrediction } from '@/hooks/useMapboxServices';
import { UseFormReturn } from 'react-hook-form';

interface BusinessData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  website: string;
  openingHours?: {
    [key: string]: string;
  };
}

interface UseBusinessAddressAutocompleteProps {
  form: UseFormReturn<any>;
  onBusinessSelected?: (business: BusinessData) => void;
}

export const useBusinessAddressAutocomplete = ({ 
  form, 
  onBusinessSelected 
}: UseBusinessAddressAutocompleteProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { isLoaded, getAddressSuggestions, getPlaceDetails } = useMapboxServices();
  
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompletePrediction[]>([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressValidated, setAddressValidated] = useState(false);

  useEffect(() => {
    const addressValue = form.getValues('address');
    if (addressValue && addressValue !== inputValue) {
      setInputValue(addressValue);
    }
  }, [form, inputValue]);

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

  const parseWeekdayHours = (periods?: any[]) => {
    if (!periods || periods.length === 0) return null;
    
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const result: {[key: string]: string} = {
      monday: 'Fechado',
      tuesday: 'Fechado',
      wednesday: 'Fechado',
      thursday: 'Fechado',
      friday: 'Fechado',
      saturday: 'Fechado',
      sunday: 'Fechado',
    };
    
    periods.forEach(period => {
      if (period.open && period.close) {
        const dayIndex = period.open.day;
        const day = daysOfWeek[dayIndex];
        
        const openHour = period.open.time.substring(0, 2) + ':' + period.open.time.substring(2);
        const closeHour = period.close.time.substring(0, 2) + ':' + period.close.time.substring(2);
        
        result[day] = `${openHour} - ${closeHour}`;
      }
    });
    
    return result;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setAddressValidated(false);
    form.setValue('address', value, { shouldValidate: false });
    fetchSuggestions(value);
  };

  const handleSelectSuggestion = async (suggestion: AutocompletePrediction) => {
    setIsLoading(true);
    try {
      const placeDetails = await getPlaceDetails(suggestion.place_id);
      
      let streetNumber = '', route = '', city = '', state = '', zipCode = '', 
          phone = placeDetails.formatted_phone_number || '', 
          website = placeDetails.website || '';
      
      placeDetails.address_components?.forEach(component => {
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

      const isBusinessPlace = placeDetails.types?.some(type => 
        ['establishment', 'point_of_interest', 'store', 'car_repair'].includes(type)
      );
      
      const formattedAddress = placeDetails.formatted_address || '';
      const addressParts = formattedAddress.split(',');
      
      let fullAddress = '';
      if (isBusinessPlace && placeDetails.name) {
        fullAddress = placeDetails.name;
        
        if (placeDetails.name && placeDetails.name.trim() !== '') {
          form.setValue('name', placeDetails.name, { shouldValidate: true });
        }
      } else if (route) {
        fullAddress = route + (streetNumber ? ', ' + streetNumber : '');
      } else if (addressParts.length > 0) {
        fullAddress = addressParts[0].trim();
      }
      
      const openingHours = parseWeekdayHours(placeDetails.opening_hours?.periods);
      
      form.setValue('address', fullAddress, { shouldValidate: true });
      setInputValue(fullAddress);
      
      if (city) {
        form.setValue('city', city, { shouldValidate: true });
      }
      if (state) {
        form.setValue('state', state, { shouldValidate: true });
      }
      if (zipCode) {
        form.setValue('zipCode', zipCode, { shouldValidate: true });
      }
      if (phone) {
        form.setValue('phone', phone.replace(/\D/g, ''), { shouldValidate: true });
      }
      if (website) {
        form.setValue('website', website, { shouldValidate: true });
      }
      
      if (onBusinessSelected) {
        onBusinessSelected({
          name: placeDetails.name || '',
          address: fullAddress,
          city,
          state,
          zipCode,
          phone,
          website,
          openingHours: openingHours || undefined
        });
      }
      
      setAddressValidated(true);
      setShowSuggestions(false);
      toast.success('Business information loaded successfully!');
      
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
    mapRef,
  };
};
