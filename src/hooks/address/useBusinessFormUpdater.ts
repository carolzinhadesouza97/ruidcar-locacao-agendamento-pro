
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { BusinessData } from './useBusinessDetails';

export const useBusinessFormUpdater = (form: UseFormReturn<any>) => {
  const updateFormWithBusinessData = (businessData: BusinessData) => {
    if (businessData.name) {
      form.setValue('name', businessData.name, { shouldValidate: true });
    }
    form.setValue('address', businessData.address, { shouldValidate: true });
    
    if (businessData.city) {
      form.setValue('city', businessData.city, { shouldValidate: true });
    }
    if (businessData.state) {
      form.setValue('state', businessData.state, { shouldValidate: true });
    }
    if (businessData.zipCode) {
      form.setValue('zipCode', businessData.zipCode, { shouldValidate: true });
    }
    if (businessData.phone) {
      form.setValue('phone', businessData.phone.replace(/\D/g, ''), { shouldValidate: true });
    }
    if (businessData.website) {
      form.setValue('website', businessData.website, { shouldValidate: true });
    }

    toast.success('Business information loaded successfully!');
  };

  return { updateFormWithBusinessData };
};
