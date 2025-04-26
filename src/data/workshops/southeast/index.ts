
import { Workshop } from '@/types/workshops';
import { LegacyWorkshopData, convertToStandardWorkshop } from '@/utils/workshopDataConverter';
import { espiritoSantoWorkshops } from './espirito-santo';
import { minasGeraisWorkshops } from './minas-gerais';
import { rioDeJaneiroWorkshops } from './rio-de-janeiro';
import { saoPauloWorkshops } from './sao-paulo';

// Combine all workshops from the southeast states
const southeastWorkshopsData: LegacyWorkshopData[] = [
  ...espiritoSantoWorkshops,
  ...minasGeraisWorkshops,
  ...rioDeJaneiroWorkshops,
  ...saoPauloWorkshops
];

// Convert to standard Workshop format
export const southeastWorkshops: Workshop[] = southeastWorkshopsData.map(convertToStandardWorkshop);
