
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { WorkshopFormSections } from './workshop/WorkshopFormSections';
import { workshopSchema, WorkshopFormInput } from '@/schemas/workshopSchema';
import { useWorkshopRegistration } from '@/hooks/useWorkshopRegistration';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const WorkshopRegistrationForm = () => {
  const { handleRegistration, isSubmitting } = useWorkshopRegistration();
  const [formErrors, setFormErrors] = useState<string[]>([]);
  
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
    try {
      setFormErrors([]);
      console.log('Form submitted with data:', data);
      
      // Validação adicional de preços
      const pricePopular = data.pricePopular.replace(',', '.');
      const priceMedium = data.priceMedium.replace(',', '.');
      const priceImported = data.priceImported.replace(',', '.');
      
      if (isNaN(parseFloat(pricePopular)) || isNaN(parseFloat(priceMedium)) || isNaN(parseFloat(priceImported))) {
        toast.error('Os preços devem ser valores numéricos válidos');
        return;
      }
      
      await handleRegistration(data);
    } catch (error: any) {
      console.error('Erro ao enviar formulário:', error);
      toast.error('Erro ao enviar formulário: ' + (error.message || 'Tente novamente'));
      setFormErrors(prev => [...prev, error.message || 'Erro desconhecido']);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulário submetido, iniciando validação');
    
    // Força a validação de todos os campos
    form.trigger().then(isValid => {
      console.log('Validação do formulário:', isValid ? 'válido' : 'inválido');
      if (isValid) {
        form.handleSubmit(onSubmit)(e);
      } else {
        console.log('Erros de validação:', form.formState.errors);
        const errorMessages = Object.entries(form.formState.errors).map(
          ([field, error]) => `${field}: ${error.message}`
        );
        setFormErrors(errorMessages);
        toast.error('Por favor, corrija os erros no formulário');
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <WorkshopFormSections form={form} />
        
        {formErrors.length > 0 && (
          <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
            <p className="font-semibold">Erros no formulário:</p>
            <ul className="list-disc pl-5">
              {formErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cadastrando...
            </>
          ) : 'Cadastrar Oficina'}
        </Button>
      </form>
    </Form>
  );
};

export default WorkshopRegistrationForm;
