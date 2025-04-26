
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
import { Globe, Mail, Phone } from 'lucide-react';

interface BasicInfoFieldsProps {
  form: UseFormReturn<WorkshopFormInput>;
}

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome da Oficina</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <div className="relative">
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Senha</FormLabel>
            <FormControl>
              <Input type="password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone</FormLabel>
            <div className="relative">
              <FormControl>
                <Input
                  {...field}
                  type="tel" 
                  placeholder="(XX) XXXXX-XXXX"
                />
              </FormControl>
              <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website (opcional)</FormLabel>
            <div className="relative">
              <FormControl>
                <Input 
                  {...field} 
                  type="url" 
                  placeholder="https://www.seusite.com.br"
                />
              </FormControl>
              <Globe className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
