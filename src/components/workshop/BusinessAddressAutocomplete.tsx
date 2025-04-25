
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { Check, MapPin, Loader2, Building, Store } from "lucide-react";
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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

interface BusinessAddressAutocompleteProps {
  form: UseFormReturn<any>;
  onBusinessSelected?: (business: BusinessData) => void;
}

export const BusinessAddressAutocomplete: React.FC<BusinessAddressAutocompleteProps> = ({ 
  form, 
  onBusinessSelected 
}) => {
  // Ref for the map (not used directly, but needed for the hook)
  const mapRef = useRef<HTMLDivElement>(null);
  const { isLoaded, getAddressSuggestions, getPlaceDetails } = useGoogleMaps(mapRef);
  
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressValidated, setAddressValidated] = useState(false);
  
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Close suggestions when clicking outside
  useOnClickOutside(suggestionsRef, () => setShowSuggestions(false));
  
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
        // Filter to prioritize business locations
        const sortedResults = [...results].sort((a, b) => {
          const aIsBusiness = a.types?.includes('establishment') ? 1 : 0;
          const bIsBusiness = b.types?.includes('establishment') ? 1 : 0;
          return bIsBusiness - aIsBusiness;
        });
        
        setSuggestions(sortedResults);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [isLoaded, getAddressSuggestions]
  );
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setAddressValidated(false);
    form.setValue('address', value, { shouldValidate: false });
    
    fetchSuggestions(value);
  };
  
  // Function to parse weekday hours from Google Places
  const parseWeekdayHours = (periods?: google.maps.places.PlaceOpeningHoursPeriod[]) => {
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
  
  // Select a suggestion
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
      let phone = placeDetails.formatted_phone_number || '';
      let website = placeDetails.website || '';
      
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
      
      // Use formatted address instead of trying to build manually
      const formattedAddress = placeDetails.formatted_address || '';
      const addressParts = formattedAddress.split(',');
      
      // For business locations, use name + address
      let fullAddress = '';
      if (isBusinessPlace && placeDetails.name) {
        fullAddress = placeDetails.name;
        
        // If this is clearly a business, use its name as the workshop name
        if (isBusinessPlace && placeDetails.name && placeDetails.name.trim() !== '') {
          form.setValue('name', placeDetails.name, { shouldValidate: true });
        }
      } else if (route) {
        fullAddress = route + (streetNumber ? ', ' + streetNumber : '');
      } else if (addressParts.length > 0) {
        fullAddress = addressParts[0].trim();
      }
      
      // Parse opening hours if available
      const openingHours = parseWeekdayHours(placeDetails.opening_hours?.periods);
      
      // Update form with place details
      form.setValue('address', fullAddress, { shouldValidate: true });
      setInputValue(fullAddress);
      
      if (city) {
        form.setValue('city', city, { shouldValidate: true });
      } else if (addressParts.length > 1) {
        // Try to extract city from formatted address
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
      
      if (phone) {
        form.setValue('phone', phone.replace(/\D/g, ''), { shouldValidate: true });
      }
      
      if (website) {
        form.setValue('website', website, { shouldValidate: true });
      }
      
      // If callback is provided, pass the business data
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
      toast.success('Informações da empresa carregadas com sucesso!');
      
    } catch (error) {
      console.error('Erro ao obter detalhes do lugar:', error);
      toast.error('Não foi possível carregar os detalhes do estabelecimento.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Determine icon for place type
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
  
  // Detect Enter key for form submission
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && showSuggestions && suggestions.length > 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[0]);
    }
  };
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome ou Endereço da Oficina</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  {...field}
                  ref={inputRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite o nome da oficina ou CNPJ..."
                  autoComplete="off"
                  onClick={() => inputValue.length >= 3 && setShowSuggestions(true)}
                  className={cn(
                    addressValidated && "pr-10 border-green-500",
                    "transition-all"
                  )}
                />
                {addressValidated && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                )}
                {isLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </FormControl>
            <FormDescription>
              Digite o nome ou CNPJ da oficina e selecione nas sugestões para carregar informações automaticamente
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: São Paulo" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input maxLength={2} {...field} placeholder="Ex: SP" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: 01310100" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Suggestions list */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef} 
          className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto"
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {getPlaceIcon(suggestion)}
              <span className="text-sm">{suggestion.description}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Hidden element to initialize Google Maps */}
      <div ref={mapRef} className="hidden" />
    </div>
  );
};
