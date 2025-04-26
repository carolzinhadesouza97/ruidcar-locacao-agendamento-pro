
import { Workshop } from '@/types/workshops';
import { northWorkshops } from './north';
import { southWorkshops } from './south';
import { southeastWorkshops } from './southeast';
import { northeastWorkshops } from './northeast';
import { midwestWorkshops } from './midwest';

// Ensure all workshop entries have required fields from both interfaces
export const allWorkshops: Workshop[] = [
  ...northWorkshops,
  ...southWorkshops,
  ...southeastWorkshops,
  ...northeastWorkshops,
  ...midwestWorkshops
];

export const getWorkshopById = (id: string): Workshop | undefined => {
  return allWorkshops.find((workshop) => workshop.id === id);
};

export { calculateDistances, getDistanceFromLatLonInKm } from './utils';
export type { Workshop } from '@/types/workshops';
