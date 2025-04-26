
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { parseWeekdayHours } from '@/utils/businessHours';

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
  const handlePlaceDetails = (placeDetails: any) => {
    let streetNumber = '', route = '', city = '', state = '', zipCode = '', 
        phone = placeDetails.formatted_phone_number || '', 
        website = placeDetails.website || '';
    
    placeDetails.address_components?.forEach((component: any) => {
      if (component.types.includes('street_number')) {
        streetNumber = component.long_name;
      } else if (component.types.includes('route')) {
        route = component.long_name;
      } else if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
        city = component.long_name;
      } else if (component.types.includes('administrative_area_level_1')) {
        state = component.short_name;
      } else if (component.types.includes('postal_code')) {
        zipCode = component.long_name.replace('-', '');
      }
    });

    const isBusinessPlace = placeDetails.types?.some((type: string) => 
      ['establishment', 'point_of_interest', 'store', 'car_repair'].includes(type)
    );
    
    const formattedAddress = placeDetails.formatted_address || '';
    const addressParts = formattedAddress.split(',');
    
    let fullAddress = '';
    if (isBusinessPlace && placeDetails.name) {
      fullAddress = placeDetails.name;
      
      if (placeDetails.name && placeDetails.name.trim() !== '') {
        form.setValue('name', placeDetails.name, { shouldValidate: true });
      }
    } else if (route) {
      fullAddress = route + (streetNumber ? ', ' + streetNumber : '');
    } else if (addressParts.length > 0) {
      fullAddress = addressParts[0].trim();
    }
    
    const openingHours = parseWeekdayHours(placeDetails.opening_hours?.periods);
    
    form.setValue('address', fullAddress, { shouldValidate: true });
    
    if (city) {
      form.setValue('city', city, { shouldValidate: true });
    }
    if (state) {
      form.setValue('state', state, { shouldValidate: true });
    }
    if (zipCode) {
      form.setValue('zipCode', zipCode, { shouldValidate: true });
    }
    if (phone) {
      form.setValue('phone', phone.replace(/\D/g, ''), { shouldValidate: true });
    }
    if (website) {
      form.setValue('website', website, { shouldValidate: true });
    }
    
    if (onBusinessSelected) {
      onBusinessSelected({
        name: placeDetails.name || '',
        address: fullAddress,
        city,
        state,
        zipCode,
        phone,
        website,
        openingHours: openingHours || undefined
      });
    }

    toast.success('Business information loaded successfully!');
    return fullAddress;
  };

  return { handlePlaceDetails };
};
