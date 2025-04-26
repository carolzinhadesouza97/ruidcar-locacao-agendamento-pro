
import { Workshop } from '@/types/workshops';
import { convertToStandardWorkshop } from '@/utils/workshopDataConverter';
import { cearaWorkshops } from './ceara';
import { maranhaoWorkshops } from './maranhao';
import { paraibaWorkshops } from './paraiba';
import { pernambucoWorkshops } from './pernambuco';
import { rioGrandeNorteWorkshops } from './rio-grande-norte';

// Combine all workshops and convert them to the standard format
const allNortheastWorkshops = [
  ...cearaWorkshops,
  ...maranhaoWorkshops,
  ...paraibaWorkshops,
  ...pernambucoWorkshops,
  ...rioGrandeNorteWorkshops
];

export const northeastWorkshops: Workshop[] = allNortheastWorkshops.map(convertToStandardWorkshop);
