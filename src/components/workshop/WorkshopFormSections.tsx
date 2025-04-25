
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { WorkshopFormInput } from '@/schemas/workshopSchema';
import { BasicInfoFields } from './BasicInfoFields';
import { AddressFields } from './AddressFields';
import { PriceFields } from './PriceFields';

interface WorkshopFormSectionsProps {
  form: UseFormReturn<WorkshopFormInput>;
}

export const WorkshopFormSections: React.FC<WorkshopFormSectionsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informações Básicas</h3>
        <BasicInfoFields form={form} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Endereço</h3>
        <AddressFields form={form} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Preços</h3>
        <PriceFields form={form} />
      </div>
    </div>
  );
};
