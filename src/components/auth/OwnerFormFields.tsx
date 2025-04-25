
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RegisterOwnerFormValues } from "@/schemas/ownerSchema";

interface OwnerFormFieldsProps {
  form: UseFormReturn<RegisterOwnerFormValues>;
  isLoading: boolean;
}

export const OwnerFormFields = ({ form, isLoading }: OwnerFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome completo</FormLabel>
            <FormControl>
              <Input 
                placeholder="Seu nome completo" 
                disabled={isLoading}
                {...field} 
              />
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
            <FormControl>
              <Input 
                type="email" 
                placeholder="seu@email.com" 
                disabled={isLoading}
                {...field} 
              />
            </FormControl>
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
              <Input 
                type="password" 
                placeholder="••••••••" 
                disabled={isLoading}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirme a senha</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="••••••••" 
                disabled={isLoading}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
