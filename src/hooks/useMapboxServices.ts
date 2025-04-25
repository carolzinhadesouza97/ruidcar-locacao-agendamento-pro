
import { useState } from 'react';

// Define types for mapbox results
export interface AutocompletePrediction {
  place_id: string;
  description: string;
  types?: string[];
  matched_substrings: any[];
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  terms: any[];
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface PlaceDetails {
  name?: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  address_components?: AddressComponent[];
  types?: string[];
  opening_hours?: {
    periods?: {
      open: { day: number; time: string };
      close: { day: number; time: string };
    }[];
  };
}

// Simple mock for geocoding to replace Google Maps functionality
export const useMapboxServices = () => {
  const [isLoaded, setIsLoaded] = useState(true);

  const geocodeAddress = async (address: string): Promise<{ lat: () => number; lng: () => number }> => {
    console.log('Geocoding address:', address);
    // In a real implementation, this would call the Mapbox geocoding API
    // For now, we'll return a mock result for testing purposes
    
    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock coordinates (random variations near Brazil)
    return {
      lat: () => -15.77972 + (Math.random() - 0.5) * 10,
      lng: () => -47.92972 + (Math.random() - 0.5) * 10
    };
  };

  const getAddressSuggestions = async (input: string): Promise<AutocompletePrediction[]> => {
    console.log('Getting address suggestions for:', input);
    // In a real implementation, this would call the Mapbox geocoding API
    // with autocomplete=true parameter
    
    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return mock suggestions with the required properties
    return [
      {
        place_id: 'place_id_1',
        description: `${input} - Location 1, Brazil`,
        types: ['establishment'],
        matched_substrings: [],
        structured_formatting: {
          main_text: `${input} - Location 1`,
          secondary_text: 'Brazil'
        },
        terms: [{ value: input }, { value: 'Brazil' }]
      },
      {
        place_id: 'place_id_2',
        description: `${input} - Location 2, Brazil`,
        types: ['route'],
        matched_substrings: [],
        structured_formatting: {
          main_text: `${input} - Location 2`,
          secondary_text: 'Brazil'
        },
        terms: [{ value: input }, { value: 'Brazil' }]
      },
      {
        place_id: 'place_id_3',
        description: `${input} - Location 3, Brazil`,
        types: ['street_address'],
        matched_substrings: [],
        structured_formatting: {
          main_text: `${input} - Location 3`,
          secondary_text: 'Brazil'
        },
        terms: [{ value: input }, { value: 'Brazil' }]
      }
    ];
  };

  const getPlaceDetails = async (placeId: string): Promise<PlaceDetails> => {
    console.log('Getting place details for:', placeId);
    // In a real implementation, this would call the Mapbox place details API
    
    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Return mock place details
    return {
      name: 'Example Business',
      formatted_address: 'Av. Example, 123, City, State, Brazil',
      formatted_phone_number: '+55 11 1234-5678',
      website: 'https://example.com',
      types: ['establishment', 'point_of_interest'],
      address_components: [
        {
          long_name: '123',
          short_name: '123',
          types: ['street_number']
        },
        {
          long_name: 'Av. Example',
          short_name: 'Av. Example',
          types: ['route']
        },
        {
          long_name: 'City',
          short_name: 'City',
          types: ['locality']
        },
        {
          long_name: 'State',
          short_name: 'ST',
          types: ['administrative_area_level_1']
        },
        {
          long_name: '12345-678',
          short_name: '12345-678',
          types: ['postal_code']
        }
      ],
      opening_hours: {
        periods: [
          {
            open: { day: 1, time: '0800' },
            close: { day: 1, time: '1800' }
          },
          {
            open: { day: 2, time: '0800' },
            close: { day: 2, time: '1800' }
          },
          {
            open: { day: 3, time: '0800' },
            close: { day: 3, time: '1800' }
          },
          {
            open: { day: 4, time: '0800' },
            close: { day: 4, time: '1800' }
          },
          {
            open: { day: 5, time: '0800' },
            close: { day: 5, time: '1800' }
          },
          {
            open: { day: 6, time: '0900' },
            close: { day: 6, time: '1400' }
          }
        ]
      }
    };
  };

  return {
    isLoaded,
    geocodeAddress,
    getAddressSuggestions,
    getPlaceDetails
  };
};
