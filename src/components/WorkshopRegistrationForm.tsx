
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { WorkshopFormSections } from './workshop/WorkshopFormSections';
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
    mode: 'onChange',
  });

  const onSubmit = async (data: WorkshopFormInput) => {
    console.log('Form submitted with data:', data);
    await handleRegistration(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <WorkshopFormSections form={form} />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar Oficina'}
        </Button>
      </form>
    </Form>
  );
};

export default WorkshopRegistrationForm;
