import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { WorkshopFormInput } from '@/schemas/workshopSchema';
import { useMapboxServices } from '@/hooks/useMapboxServices';
import { useAuth } from '@/hooks/useAuth';

export const useWorkshopRegistration = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const { isLoaded, geocodeAddress } = useMapboxServices();
  const { user } = useAuth();

  const handleRegistration = async (data: WorkshopFormInput) => {
    if (isSubmitting) {
      console.log("Submissão já em andamento, ignorando clique repetido");
      return;
    }

    if (!user) {
      toast.error("Você precisa estar logado para cadastrar uma oficina");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Iniciando registro de oficina com dados:", data);
      
      if (!isLoaded) {
        toast.error("O serviço de geocodificação não está disponível. Tente novamente em alguns instantes.");
        throw new Error("Serviço de geocodificação indisponível");
      }
      
      const formattedAddress = `${data.address}, ${data.city}, ${data.state}, ${data.zipCode}, Brasil`;
      console.log("Tentando geocodificar endereço:", formattedAddress);
      
      let location: { lat: () => number; lng: () => number };
      try {
        toast.info('Validando localização...');
        
        location = await geocodeAddress(formattedAddress);
        console.log("Geocodificação bem-sucedida:", location.lat(), location.lng());
      } catch (geocodeError: any) {
        console.error("Erro na geocodificação:", geocodeError);
        
        try {
          const simpleAddress = `${data.city}, ${data.state}, Brasil`;
          console.log("Tentando geocodificar com endereço simplificado:", simpleAddress);
          
          location = await geocodeAddress(simpleAddress);
          console.log("Geocodificação simplificada bem-sucedida:", location.lat(), location.lng());
          
          toast.warning('Usando localização aproximada baseada na cidade. Para melhor precisão, selecione um endereço da lista de sugestões.');
        } catch (secondError) {
          console.error("Erro também na geocodificação simplificada:", secondError);
          throw new Error(`Erro ao localizar endereço: ${geocodeError.message || 'Verifique se o endereço está correto'}`);
        }
      }
      
      // Parse string values to numbers for price fields
      const pricePopular = parseFloat(data.pricePopular.replace(',', '.'));
      const priceMedium = parseFloat(data.priceMedium.replace(',', '.'));
      const priceImported = parseFloat(data.priceImported.replace(',', '.'));

      if (isNaN(pricePopular) || isNaN(priceMedium) || isNaN(priceImported)) {
        throw new Error("Os preços informados não são valores numéricos válidos");
      }

      console.log("Inserindo dados da oficina na tabela workshops");
      const { data: workshopData, error: workshopError } = await supabase
        .from('workshops')
        .insert({
          name: data.name,
          email: user.email,
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
          owner_id: user.id,
        })
        .select()
        .single();

      if (workshopError) {
        console.error("Erro ao inserir oficina:", workshopError);
        throw new Error(`Erro ao cadastrar oficina: ${workshopError.message}`);
      }

      if (!workshopData?.id) {
        console.error("Oficina criada sem ID");
        throw new Error("Erro interno: oficina criada sem ID");
      }

      console.log("Oficina inserida com sucesso. ID:", workshopData.id);
      console.log("Vinculando oficina ao usuário");

      const { error: linkError } = await supabase
        .from('workshop_accounts')
        .insert({
          id: user.id,
          email: user.email,
          password: data.password,
          workshop_id: workshopData.id,
        });

      if (linkError) {
        console.error("Erro ao vincular oficina ao usuário:", linkError);
        throw new Error(`Erro ao vincular oficina ao usuário: ${linkError.message}`);
      }

      console.log("Cadastro concluído com sucesso");
      toast.success('Oficina cadastrada com sucesso! Aguarde a aprovação.');
      
      // Atraso pequeno para garantir que o toast seja mostrado antes da navegação
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (error: any) {
      console.error('Erro ao cadastrar oficina:', error);
      toast.error(error.message || 'Erro ao cadastrar oficina');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleRegistration, isSubmitting };
};
