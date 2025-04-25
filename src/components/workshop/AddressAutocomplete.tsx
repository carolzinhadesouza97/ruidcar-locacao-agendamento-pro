
import React, { useRef } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { WorkshopFormInput } from '@/schemas/workshopSchema';
import { Check, Loader2 } from "lucide-react";
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { cn } from '@/lib/utils';
import { useAddressAutocomplete } from '@/hooks/address/useAddressAutocomplete';
import { SuggestionsList } from './address/SuggestionsList';

interface AddressAutocompleteProps {
  form: UseFormReturn<WorkshopFormInput>;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({ form }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    inputValue,
    suggestions,
    isLoading,
    showSuggestions,
    addressValidated,
    setShowSuggestions,
    handleInputChange,
    handleSelectSuggestion,
  } = useAddressAutocomplete({ form, mapRef });
  
  // Close suggestions when clicking outside
  useOnClickOutside(suggestionsRef, () => setShowSuggestions(false));
  
  // Detect Enter key for form submission
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
      
      {/* Suggestions list */}
      {showSuggestions && suggestions.length > 0 && (
        <SuggestionsList
          suggestions={suggestions}
          onSelectSuggestion={handleSelectSuggestion}
          suggestionsRef={suggestionsRef}
        />
      )}
      
      {/* Hidden element to initialize Google Maps */}
      <div ref={mapRef} className="hidden" />
    </div>
  );
};
