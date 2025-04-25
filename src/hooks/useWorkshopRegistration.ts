
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { WorkshopFormInput } from '@/schemas/workshopSchema';
import { useGoogleMaps } from './useGoogleMaps';

export const useWorkshopRegistration = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Usamos um ref vazio apenas para inicializar o hook
  const mapRef = useRef<HTMLDivElement>(null);
  const { isLoaded, geocodeAddress } = useGoogleMaps(mapRef);

  const handleRegistration = async (data: WorkshopFormInput) => {
    try {
      setIsSubmitting(true);
      
      if (!isLoaded) {
        toast.error("O serviço de geocodificação não está disponível. Tente novamente em alguns instantes.");
        setIsSubmitting(false);
        return;
      }
      
      // Primeiro, tente geocodificar o endereço antes de criar o usuário
      const formattedAddress = `${data.address}, ${data.city}, ${data.state}, ${data.zipCode}, Brasil`;
      console.log("Tentando geocodificar endereço:", formattedAddress);
      
      let location: google.maps.LatLng;
      try {
        // Fazemos três tentativas de geocodificação
        toast.info('Validando localização...');
        
        location = await geocodeAddress(formattedAddress);
        console.log("Geocodificação bem-sucedida:", location.lat(), location.lng());
      } catch (geocodeError: any) {
        console.error("Erro na geocodificação:", geocodeError);
        
        // Segunda tentativa: apenas cidade e estado
        try {
          const simpleAddress = `${data.city}, ${data.state}, Brasil`;
          console.log("Tentando geocodificar com endereço simplificado:", simpleAddress);
          
          location = await geocodeAddress(simpleAddress);
          console.log("Geocodificação simplificada bem-sucedida:", location.lat(), location.lng());
          
          // Aviso de que estamos usando localização aproximada
          toast.warning('Usando localização aproximada baseada na cidade. Para melhor precisão, selecione um endereço da lista de sugestões.');
        } catch (secondError) {
          toast.error(`Erro ao localizar endereço: ${geocodeError.message || 'Verifique se o endereço está correto'}`);
          setIsSubmitting(false);
          return;
        }
      }
      
      // Se chegou aqui, a geocodificação foi bem-sucedida, então prossiga com o cadastro
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        throw authError;
      }

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

      if (workshopError) {
        throw workshopError;
      }

      const { error: linkError } = await supabase
        .from('workshop_accounts')
        .insert({
          id: authData.user?.id,
          email: data.email,
          password: data.password,
          workshop_id: workshopData.id,
        });

      if (linkError) {
        throw linkError;
      }

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
