
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
      
      // Primeiro, tente geocodificar o endereço antes de criar o usuário
      const formattedAddress = `${data.address}, ${data.city}, ${data.state}, ${data.zipCode}, Brasil`;
      console.log("Tentando geocodificar endereço:", formattedAddress);
      
      let location: google.maps.LatLng;
      try {
        location = await geocodeAddress(formattedAddress);
      } catch (geocodeError: any) {
        console.error("Erro na geocodificação:", geocodeError);
        toast.error(`Erro ao localizar endereço: ${geocodeError.message || 'Verifique se o endereço está correto'}`);
        setIsSubmitting(false);
        return;
      }
      
      // Se chegou aqui, a geocodificação foi bem-sucedida, então prossiga com o cadastro
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

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

  // Função auxiliar para geocodificar endereços com melhor tratamento de erros
  const geocodeAddress = (address: string): Promise<google.maps.LatLng> => {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps) {
        reject(new Error('Google Maps API não está carregada'));
        return;
      }

      const geocoder = new google.maps.Geocoder();
      
      geocoder.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          resolve(results[0].geometry.location);
        } else {
          let errorMessage = 'Falha ao geocodificar endereço';
          
          // Mapear códigos de status para mensagens mais amigáveis
          switch (status) {
            case google.maps.GeocoderStatus.ZERO_RESULTS:
              errorMessage = 'Nenhum resultado encontrado para este endereço';
              break;
            case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
              errorMessage = 'Limite de consultas à API do Google Maps excedido';
              break;
            case google.maps.GeocoderStatus.REQUEST_DENIED:
              errorMessage = 'Requisição negada pelo serviço de geocodificação';
              break;
            case google.maps.GeocoderStatus.INVALID_REQUEST:
              errorMessage = 'Requisição inválida de geocodificação';
              break;
          }
          
          reject(new Error(errorMessage));
        }
      });
    });
  };

  return { handleRegistration, isSubmitting };
};
