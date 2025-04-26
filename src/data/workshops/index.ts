
import { Workshop } from '@/types/workshops';
import { northWorkshops } from './north';
import { southWorkshops } from './south';
import { southeastWorkshops } from './southeast';

export const allWorkshops: Workshop[] = [
  ...northWorkshops,
  ...southWorkshops,
  ...southeastWorkshops
];

export const getWorkshopById = (id: string): Workshop | undefined => {
  return allWorkshops.find((workshop) => workshop.id === id);
};

export { calculateDistances, getDistanceFromLatLonInKm } from './utils';
export type { Workshop } from '@/types/workshops';
