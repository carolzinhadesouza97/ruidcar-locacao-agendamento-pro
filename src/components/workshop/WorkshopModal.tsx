
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BusinessAddressAutocomplete } from './BusinessAddressAutocomplete';
import { WorkingHoursField } from './WorkingHoursField';

const workshopSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  city: z.string().min(2, 'Cidade inválida'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  zipCode: z.string().min(8, 'CEP inválido'),
  phone: z.string().min(10, 'Telefone inválido').optional(),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  pricePopular: z.string().min(1, 'Preço é obrigatório'),
  priceMedium: z.string().min(1, 'Preço é obrigatório'),
  priceImported: z.string().min(1, 'Preço é obrigatório'),
});

type WorkshopFormInput = z.infer<typeof workshopSchema>;

interface WorkingHours {
  [key: string]: string;
}

interface Workshop {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  phone?: string;
  website?: string;
  price_popular?: number | string;
  price_medium?: number | string;
  price_imported?: number | string;
  open_hours?: WorkingHours;
}

interface WorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshop: Workshop | null;
  onWorkshopSaved: () => void;
  userId: string;
}

export function WorkshopModal({ isOpen, onClose, workshop, onWorkshopSaved, userId }: WorkshopModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    monday: '08:00 - 18:00',
    tuesday: '08:00 - 18:00',
    wednesday: '08:00 - 18:00',
    thursday: '08:00 - 18:00',
    friday: '08:00 - 18:00',
    saturday: '08:00 - 12:00',
    sunday: 'Fechado',
  });
  
  const form = useForm<WorkshopFormInput>({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      name: workshop?.name || '',
      address: workshop?.address || '',
      city: workshop?.city || '',
      state: workshop?.state || '',
      zipCode: workshop?.zip_code || '',
      phone: workshop?.phone || '',
      website: workshop?.website || '',
      pricePopular: workshop?.price_popular?.toString() || '',
      priceMedium: workshop?.price_medium?.toString() || '',
      priceImported: workshop?.price_imported?.toString() || '',
    },
  });
  
  useEffect(() => {
    if (workshop?.open_hours) {
      setWorkingHours(workshop.open_hours);
    }
  }, [workshop]);

  const handleSubmit = async (data: WorkshopFormInput) => {
    setIsSubmitting(true);
    
    try {
      // Parse string values to numbers for price fields
      const pricePopular = parseFloat(data.pricePopular.replace(',', '.'));
      const priceMedium = parseFloat(data.priceMedium.replace(',', '.'));
      const priceImported = parseFloat(data.priceImported.replace(',', '.'));
      
      const workshopData = {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        phone: data.phone || null,
        website: data.website || null,
        price_popular: pricePopular,
        price_medium: priceMedium,
        price_imported: priceImported,
        open_hours: workingHours,
        owner_id: userId,
      };
      
      let response;
      
      if (workshop?.id) {
        // Update existing workshop
        response = await supabase
          .from('workshops')
          .update(workshopData)
          .eq('id', workshop.id)
          .select()
          .single();
      } else {
        // Create new workshop
        response = await supabase
          .from('workshops')
          .insert(workshopData)
          .select()
          .single();
      }
      
      if (response.error) throw response.error;
      
      toast.success(workshop?.id ? 'Oficina atualizada com sucesso!' : 'Oficina cadastrada com sucesso!');
      onWorkshopSaved();
    } catch (error: any) {
      console.error('Erro ao salvar oficina:', error);
      toast.error(error.message || 'Erro ao salvar oficina');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {workshop?.id ? 'Editar Oficina' : 'Nova Oficina'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Oficina</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <BusinessAddressAutocomplete 
              form={form} 
              onBusinessSelected={(business) => {
                // Update hours if available from Google Places
                if (business.openingHours) {
                  setWorkingHours(business.openingHours);
                }
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="(11) 95555-1234" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://www.suaoficina.com.br" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <WorkingHoursField 
              value={workingHours} 
              onChange={setWorkingHours} 
            />
            
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="pricePopular"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Popular</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceMedium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Médio</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceImported"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Importado</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Oficina'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
