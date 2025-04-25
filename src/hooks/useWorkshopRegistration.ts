
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { WorkshopFormInput } from '@/schemas/workshopSchema';

export const useWorkshopRegistration = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegistration = async (data: WorkshopFormInput) => {
    try {
      setIsSubmitting(true);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      const address = `${data.address}, ${data.city}, ${data.state}`;
      const geocoder = new google.maps.Geocoder();
      
      const geocodeResult = await new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
            resolve(results[0].geometry.location);
          } else {
            reject(new Error('Falha ao geocodificar endereço'));
          }
        });
      });

      const location = geocodeResult as google.maps.LatLng;

      // Parse string values to numbers for price fields
      const pricePopular = parseFloat(data.pricePopular.replace(',', '.'));
      const priceMedium = parseFloat(data.priceMedium.replace(',', '.'));
      const priceImported = parseFloat(data.priceImported.replace(',', '.'));

      const { data: workshopData, error: workshopError } = await supabase
        .from('workshops')
        .insert({
          name: data.name,
          email: data.email,
          address: data.address,
          city: data.city,
          state: data.state,
          zip_code: data.zipCode,
          lat: location.lat(),
          lng: location.lng(),
          phone: data.phone,
          price_popular: pricePopular,
          price_medium: priceMedium,
          price_imported: priceImported,
          open_hours: {
            weekdays: '08:00 - 18:00',
            saturday: '08:00 - 12:00',
            sunday: 'Fechado',
          },
        })
        .select()
        .single();

      if (workshopError) throw workshopError;

      const { error: linkError } = await supabase
        .from('workshop_accounts')
        .insert({
          id: authData.user?.id,
          email: data.email,
          password: data.password,
          workshop_id: workshopData.id,
        });

      if (linkError) throw linkError;

      toast.success('Oficina cadastrada com sucesso! Aguarde a aprovação.');
      navigate('/');
    } catch (error: any) {
      console.error('Erro ao cadastrar oficina:', error);
      toast.error(error.message || 'Erro ao cadastrar oficina');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleRegistration, isSubmitting };
};
