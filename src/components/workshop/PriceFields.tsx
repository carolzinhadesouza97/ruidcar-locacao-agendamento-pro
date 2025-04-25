
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { WorkshopFormInput } from '@/schemas/workshopSchema';

interface PriceFieldsProps {
  form: UseFormReturn<WorkshopFormInput>;
}

export const PriceFields: React.FC<PriceFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name="pricePopular"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preço Popular</FormLabel>
            <FormControl>
              <Input type="text" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="priceMedium"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preço Médio</FormLabel>
            <FormControl>
              <Input type="text" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="priceImported"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preço Importado</FormLabel>
            <FormControl>
              <Input type="text" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
