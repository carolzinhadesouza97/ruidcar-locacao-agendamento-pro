
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { BasicInfoFields } from './workshop/BasicInfoFields';
import { AddressFields } from './workshop/AddressFields';
import { PriceFields } from './workshop/PriceFields';
import { workshopSchema, WorkshopFormInput } from '@/schemas/workshopSchema';
import { useWorkshopRegistration } from '@/hooks/useWorkshopRegistration';

const WorkshopRegistrationForm = () => {
  const { handleRegistration, isSubmitting } = useWorkshopRegistration();
  
  const form = useForm<WorkshopFormInput>({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      pricePopular: '',
      priceMedium: '',
      priceImported: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegistration)} className="space-y-4">
        <BasicInfoFields form={form} />
        <AddressFields form={form} />
        <PriceFields form={form} />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar Oficina'}
        </Button>
      </form>
    </Form>
  );
};

export default WorkshopRegistrationForm;
