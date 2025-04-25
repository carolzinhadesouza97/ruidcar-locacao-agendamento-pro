
import React from 'react';
import { Workshop } from '@/types/workshop';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

interface WorkshopListProps {
  workshops: Workshop[];
  onEdit: (workshop: Workshop) => void;
  onDelete: (id: string) => void;
}

export const WorkshopList: React.FC<WorkshopListProps> = ({
  workshops,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid gap-4">
      {workshops.map((workshop) => (
        <div 
          key={workshop.id} 
          className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center"
        >
          <div>
            <h2 className="font-semibold text-lg">{workshop.name}</h2>
            <p className="text-sm text-gray-500">{workshop.address}, {workshop.city}/{workshop.state}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(workshop)}>
              <Edit className="h-4 w-4" />
              <span className="ml-1 hidden md:inline">Editar</span>
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(workshop.id)}>
              <Trash className="h-4 w-4" />
              <span className="ml-1 hidden md:inline">Excluir</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
