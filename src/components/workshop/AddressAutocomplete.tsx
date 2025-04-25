
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { WorkshopFormInput } from '@/schemas/workshopSchema';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { Check, MapPin, Loader2 } from "lucide-react";
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AddressAutocompleteProps {
  form: UseFormReturn<WorkshopFormInput>;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({ form }) => {
  // Ref para o mapa (não usamos o mapa diretamente, mas precisamos para o hook)
  const mapRef = useRef<HTMLDivElement>(null);
  const { isLoaded, getAddressSuggestions, getPlaceDetails } = useGoogleMaps(mapRef);
  
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressValidated, setAddressValidated] = useState(false);
  
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Fechar sugestões quando clicar fora
  useOnClickOutside(suggestionsRef, () => setShowSuggestions(false));
  
  // Atualizar o inputValue quando o valor do formulário mudar
  useEffect(() => {
    const addressValue = form.getValues('address');
    if (addressValue && addressValue !== inputValue) {
      setInputValue(addressValue);
    }
  }, [form.getValues('address')]);
  
  // Função para buscar sugestões
  const fetchSuggestions = async (input: string) => {
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
  };
  
  // Função para lidar com a mudança no input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setAddressValidated(false);
    form.setValue('address', value);
    
    // Debounce para evitar chamadas excessivas
    const timeoutId = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };
  
  // Função para selecionar uma sugestão
  const handleSelectSuggestion = async (suggestion: google.maps.places.AutocompletePrediction) => {
    setIsLoading(true);
    try {
      const placeDetails = await getPlaceDetails(suggestion.place_id);
      
      // Extrair informações do endereço
      let streetNumber = '';
      let route = '';
      let city = '';
      let state = '';
      let zipCode = '';
      let phone = '';
      
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
      
      // Atualizar o formulário com os detalhes do lugar
      const fullAddress = route + (streetNumber ? ', ' + streetNumber : '');
      
      form.setValue('address', fullAddress);
      setInputValue(fullAddress);
      
      if (city) {
        form.setValue('city', city);
      }
      
      if (state) {
        form.setValue('state', state);
      }
      
      if (zipCode) {
        form.setValue('zipCode', zipCode);
      }
      
      if (placeDetails.formatted_phone_number) {
        form.setValue('phone', placeDetails.formatted_phone_number.replace(/\D/g, ''));
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
  
  return (
    <div className="relative">
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  {...field}
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Digite para buscar um endereço..."
                  autoComplete="off"
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
              Digite o endereço e selecione uma das sugestões para validação automática
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Lista de sugestões */}
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
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm">{suggestion.description}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Elemento oculto para inicializar o Google Maps */}
      <div ref={mapRef} className="hidden" />
    </div>
  );
};
