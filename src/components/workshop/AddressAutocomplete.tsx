
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { WorkshopFormInput } from '@/schemas/workshopSchema';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { Check, MapPin, Loader2, Building, Store } from "lucide-react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Fechar sugestões quando clicar fora
  useOnClickOutside(suggestionsRef, () => setShowSuggestions(false));
  
  // Atualizar o inputValue quando o valor do formulário mudar
  useEffect(() => {
    const addressValue = form.getValues('address');
    if (addressValue && addressValue !== inputValue) {
      setInputValue(addressValue);
    }
  }, [form, inputValue]);
  
  // Função debounce para limitar chamadas de API
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };
  
  // Função para buscar sugestões com debounce
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
  
  // Função para lidar com a mudança no input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setAddressValidated(false);
    form.setValue('address', value, { shouldValidate: false });
    
    fetchSuggestions(value);
  };
  
  // Função para selecionar uma sugestão
  const handleSelectSuggestion = async (suggestion: google.maps.places.AutocompletePrediction) => {
    setIsLoading(true);
    try {
      console.log("Obtendo detalhes para o place_id:", suggestion.place_id);
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
          // Informações mais detalhadas para debug
          console.log("Componente de endereço:", component.types, component.long_name, component.short_name);
          
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
      
      // Verifica se é um estabelecimento comercial
      const isBusinessPlace = placeDetails.types?.some(type => 
        ['establishment', 'point_of_interest', 'store', 'car_repair'].includes(type)
      );
      
      console.log("É estabelecimento comercial:", isBusinessPlace);
      console.log("Tipos do lugar:", placeDetails.types);
      
      // Usar endereço formatado em vez de tentar montar manualmente
      const formattedAddress = placeDetails.formatted_address || '';
      const addressParts = formattedAddress.split(',');
      
      // Para endereços comerciais, usar nome + endereço
      let fullAddress = '';
      if (isBusinessPlace && placeDetails.name) {
        fullAddress = placeDetails.name;
      } else if (route) {
        fullAddress = route + (streetNumber ? ', ' + streetNumber : '');
      } else if (addressParts.length > 0) {
        fullAddress = addressParts[0].trim();
      }
      
      // Atualizar o formulário com os detalhes do lugar
      form.setValue('address', fullAddress, { shouldValidate: true });
      setInputValue(fullAddress);
      
      if (city) {
        form.setValue('city', city, { shouldValidate: true });
      } else if (addressParts.length > 1) {
        // Tentar extrair cidade do endereço formatado
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
      
      if (placeDetails.formatted_phone_number) {
        form.setValue('phone', placeDetails.formatted_phone_number.replace(/\D/g, ''), { shouldValidate: true });
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
  
  // Função para determinar ícone do tipo de lugar
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
  
  // Detectar tecla Enter para envio do formulário
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && showSuggestions && suggestions.length > 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[0]);
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
                  ref={inputRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite o nome da oficina ou endereço..."
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
              Digite o nome da oficina ou endereço completo e selecione uma das sugestões
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
              {getPlaceIcon(suggestion)}
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
