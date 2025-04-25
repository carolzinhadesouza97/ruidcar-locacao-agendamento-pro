
import React, { useRef } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Check, Loader2 } from "lucide-react";
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { cn } from '@/lib/utils';
import { SuggestionsList } from './address/SuggestionsList';
import { useBusinessAddressAutocomplete } from '@/hooks/address/useBusinessAddressAutocomplete';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const {
    inputValue,
    suggestions,
    isLoading,
    showSuggestions,
    addressValidated,
    setShowSuggestions,
    handleInputChange,
    handleSelectSuggestion,
    mapRef,
  } = useBusinessAddressAutocomplete({ form, onBusinessSelected });
  
  useOnClickOutside(suggestionsRef, () => setShowSuggestions(false));
  
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
            <FormLabel>Workshop Name or Address</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  {...field}
                  ref={inputRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter workshop name or CNPJ..."
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
              Enter workshop name or CNPJ to automatically load information
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
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
