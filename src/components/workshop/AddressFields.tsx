
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { WorkshopFormInput } from '@/schemas/workshopSchema';
import { useCepValidation } from '@/hooks/useCepValidation';

interface AddressFieldsProps {
  form: UseFormReturn<WorkshopFormInput>;
}

export const AddressFields: React.FC<AddressFieldsProps> = ({ form }) => {
  const { validateCep } = useCepValidation(form);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    form.setValue('zipCode', cep, { shouldValidate: true });
    
    if (cep.length === 8) {
      validateCep(cep);
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="zipCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CEP</FormLabel>
            <FormControl>
              <Input
                {...field}
                onChange={handleCepChange}
                placeholder="Digite o CEP (somente números)"
                maxLength={8}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Rua, número, complemento" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Cidade" />
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
                <Input {...field} placeholder="UF" maxLength={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
