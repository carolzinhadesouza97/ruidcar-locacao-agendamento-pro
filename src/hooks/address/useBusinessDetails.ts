
import { UseFormReturn } from 'react-hook-form';
import { parseWeekdayHours } from '@/utils/businessHours';
import { transformPlaceDetails } from '@/utils/businessDataTransformer';
import { useBusinessFormUpdater } from './useBusinessFormUpdater';

export interface BusinessData {
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

export const useBusinessDetails = (form: UseFormReturn<any>, onBusinessSelected?: (business: BusinessData) => void) => {
  const { updateFormWithBusinessData } = useBusinessFormUpdater(form);

  const handlePlaceDetails = (placeDetails: any) => {
    const businessData = transformPlaceDetails(placeDetails);
    updateFormWithBusinessData(businessData);
    
    if (onBusinessSelected) {
      onBusinessSelected(businessData);
    }

    return businessData.address;
  };

  return { handlePlaceDetails };
};
