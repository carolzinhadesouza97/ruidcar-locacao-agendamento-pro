
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { WorkshopFormInput, workshopFormSchema } from '@/schemas/workshopFormSchema';
import { BusinessAddressAutocomplete } from './BusinessAddressAutocomplete';
import { WorkingHoursField } from './WorkingHoursField';
import { PriceFields } from './PriceFields';

interface WorkshopFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const WorkshopForm: React.FC<WorkshopFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const [workingHours, setWorkingHours] = useState<Record<string, string>>({
    monday: '08:00 - 18:00',
    tuesday: '08:00 - 18:00',
    wednesday: '08:00 - 18:00',
    thursday: '08:00 - 18:00',
    friday: '08:00 - 18:00',
    saturday: '08:00 - 12:00',
    sunday: 'Fechado',
  });

  const form = useForm<WorkshopFormInput>({
    resolver: zodResolver(workshopFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      zipCode: initialData?.zip_code || '',
      phone: initialData?.phone || '',
      website: initialData?.website || '',
      pricePopular: initialData?.price_popular?.toString() || '',
      priceMedium: initialData?.price_medium?.toString() || '',
      priceImported: initialData?.price_imported?.toString() || '',
    },
  });

  const handleSubmit = async (data: WorkshopFormInput) => {
    try {
      await onSubmit({ ...data, open_hours: workingHours });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Erro ao salvar oficina');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <BusinessAddressAutocomplete 
          form={form} 
          onBusinessSelected={(business) => {
            if (business.openingHours) {
              setWorkingHours(business.openingHours);
            }
          }}
        />
        
        <WorkingHoursField 
          value={workingHours} 
          onChange={setWorkingHours} 
        />
        
        <PriceFields form={form} />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Oficina'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
