
import { Workshop } from '@/types/workshops';
import { convertToStandardWorkshop } from '@/utils/workshopDataConverter';
import { goiasWorkshops } from './goias';
import { dfWorkshops } from './distrito-federal';
import { matoGrossoWorkshops } from './mato-grosso';
import { matoGrossoSulWorkshops } from './mato-grosso-sul';

// Combine all workshops and convert them to the standard format
const allMidwestWorkshops = [
  ...goiasWorkshops,
  ...dfWorkshops,
  ...matoGrossoWorkshops,
  ...matoGrossoSulWorkshops
];

export const midwestWorkshops: Workshop[] = allMidwestWorkshops.map(convertToStandardWorkshop);
