
import { Workshop } from '@/types/workshops';
import { convertToStandardWorkshop } from '@/utils/workshopDataConverter';
import { paraWorkshops } from './para';
import { amazonasWorkshops } from './amazonas';
import { amapaWorkshops } from './amapa';
import { acreWorkshops } from './acre';
import { rondoniaWorkshops } from './rondonia';
import { tocantinsWorkshops } from './tocantins';

// Combine all workshops and convert them to the standard format
const allNorthWorkshops = [
  ...paraWorkshops,
  ...amazonasWorkshops,
  ...amapaWorkshops,
  ...acreWorkshops,
  ...rondoniaWorkshops,
  ...tocantinsWorkshops
];

export const northWorkshops: Workshop[] = allNorthWorkshops.map(convertToStandardWorkshop);
