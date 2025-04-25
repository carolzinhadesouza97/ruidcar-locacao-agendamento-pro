
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { WorkshopForm } from './WorkshopForm';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { useRef, useState } from 'react';
import { Workshop } from '@/types/workshop';

interface WorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshop: Workshop | null;
  onWorkshopSaved: () => void;
  userId: string;
}

export function WorkshopModal({ 
  isOpen, 
  onClose, 
  workshop, 
  onWorkshopSaved, 
  userId 
}: WorkshopModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const { geocodeAddress } = useGoogleMaps(mapRef);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const pricePopular = parseFloat(data.pricePopular.replace(',', '.'));
      const priceMedium = parseFloat(data.priceMedium.replace(',', '.'));
      const priceImported = parseFloat(data.priceImported.replace(',', '.'));
      
      const { data: { user } } = await supabase.auth.getUser();
      const userEmail = user?.email || '';

      let lat = 0;
      let lng = 0;
      
      try {
        const fullAddress = `${data.address}, ${data.city}, ${data.state}, ${data.zipCode}, Brasil`;
        const location = await geocodeAddress(fullAddress);
        lat = location.lat();
        lng = location.lng();
      } catch (error) {
        console.error('Error geocoding address:', error);
        toast.warning('Não foi possível obter coordenadas precisas do endereço. O mapa pode não exibir a localização correta.');
      }
      
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
        open_hours: data.open_hours,
        owner_id: userId,
        email: userEmail,
        lat,
        lng
      };
      
      let response;
      
      if (workshop?.id) {
        response = await supabase
          .from('workshops')
          .update(workshopData)
          .eq('id', workshop.id)
          .select()
          .single();
      } else {
        response = await supabase
          .from('workshops')
          .insert(workshopData)
          .select()
          .single();
      }
      
      if (response.error) throw response.error;
      
      toast.success(workshop?.id ? 'Oficina atualizada com sucesso!' : 'Oficina cadastrada com sucesso!');
      onWorkshopSaved();
      onClose();
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

        <WorkshopForm
          initialData={workshop}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={onClose}
        />

        {/* Hidden element to initialize Google Maps */}
        <div ref={mapRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
