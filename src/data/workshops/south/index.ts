
import { Workshop } from '@/types/workshops';
import { LegacyWorkshopData, convertToStandardWorkshop } from '@/utils/workshopDataConverter';
import { rioGrandeSulWorkshops } from './rio-grande-sul';
import { santaCatarinaWorkshops } from './santa-catarina';
import { paranaWorkshops } from './parana';

// Combine all workshops from the southern states
const southWorkshopsData: LegacyWorkshopData[] = [
  ...rioGrandeSulWorkshops,
  ...santaCatarinaWorkshops,
  ...paranaWorkshops
];

// Convert to standard Workshop format
export const southWorkshops: Workshop[] = southWorkshopsData.map(convertToStandardWorkshop);
