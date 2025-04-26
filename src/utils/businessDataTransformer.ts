
import { BusinessData } from '@/hooks/address/useBusinessDetails';

export const transformPlaceDetails = (placeDetails: any): BusinessData => {
  let streetNumber = '';
  let route = '';
  let city = '';
  let state = '';
  let zipCode = '';
  let phone = placeDetails.formatted_phone_number || '';
  let website = placeDetails.website || '';

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

  const formattedAddress = placeDetails.formatted_address || '';
  const addressParts = formattedAddress.split(',');
  
  let fullAddress = '';
  if (placeDetails.types?.some((type: string) => 
    ['establishment', 'point_of_interest', 'store', 'car_repair'].includes(type)
  ) && placeDetails.name) {
    fullAddress = placeDetails.name;
  } else if (route) {
    fullAddress = route + (streetNumber ? ', ' + streetNumber : '');
  } else if (addressParts.length > 0) {
    fullAddress = addressParts[0].trim();
  }

  return {
    name: placeDetails.name || '',
    address: fullAddress,
    city,
    state,
    zipCode,
    phone,
    website,
    openingHours: placeDetails.opening_hours?.periods ? parseWeekdayHours(placeDetails.opening_hours.periods) : undefined
  };
};
