
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WorkingHoursFieldProps {
  value: { [key: string]: string };
  onChange: (value: { [key: string]: string }) => void;
}

export const WorkingHoursField: React.FC<WorkingHoursFieldProps> = ({ value, onChange }) => {
  const daysOfWeek = [
    { id: 'monday', label: 'Segunda-feira' },
    { id: 'tuesday', label: 'Terça-feira' },
    { id: 'wednesday', label: 'Quarta-feira' },
    { id: 'thursday', label: 'Quinta-feira' },
    { id: 'friday', label: 'Sexta-feira' },
    { id: 'saturday', label: 'Sábado' },
    { id: 'sunday', label: 'Domingo' },
  ];
  
  const options = [
    { value: "Fechado", label: "Fechado" },
    { value: "custom", label: "Horário personalizado" },
  ];
  
  const handleHoursChange = (day: string, newValue: string) => {
    onChange({
      ...value,
      [day]: newValue,
    });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label>Horário de Funcionamento</Label>
      </div>
      
      <div className="space-y-2 border rounded-md p-4">
        {daysOfWeek.map((day) => (
          <div key={day.id} className="grid grid-cols-3 gap-2 items-center">
            <div className="text-sm font-medium">{day.label}</div>
            <div className="col-span-2">
              <Select
                value={value[day.id] === "Fechado" ? "Fechado" : "custom"}
                onValueChange={(selectedValue) => {
                  if (selectedValue === "Fechado") {
                    handleHoursChange(day.id, "Fechado");
                  } else if (selectedValue === "custom" && value[day.id] === "Fechado") {
                    // Default custom value when switching from "Fechado"
                    handleHoursChange(day.id, "08:00 - 18:00");
                  }
                }}
              >
                <SelectTrigger className="h-8 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {value[day.id] !== "Fechado" && (
                <Input 
                  className="mt-1 h-8"
                  value={value[day.id]} 
                  onChange={(e) => handleHoursChange(day.id, e.target.value)} 
                  placeholder="Ex: 08:00 - 18:00"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
