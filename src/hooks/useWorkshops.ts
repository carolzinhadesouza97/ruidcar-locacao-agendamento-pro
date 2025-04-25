
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Workshop, WorkshopDTO } from '@/types/workshop';
import { convertDTOToWorkshop } from '@/utils/workshopConverters';
import { toast } from 'sonner';

export const useWorkshops = (userId: string) => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkshops = async () => {
    try {
      // Remove the generic type parameter and use a simpler approach
      const { data, error } = await supabase
        .from('workshops')
        .select(`
          id, name, address, city, state, zip_code,
          phone, email, lat, lng, open_hours,
          price_popular, price_medium, price_imported,
          approved, created_at, website
        `)
        .eq('owner_id', userId);
      
      if (error) throw error;
      
      // Cast to unknown first, then to WorkshopDTO[] to avoid type errors
      const workshopsData = (data as unknown) as WorkshopDTO[];
      const typedWorkshops = Array.isArray(workshopsData) 
        ? workshopsData.map(convertDTOToWorkshop)
        : [];
        
      setWorkshops(typedWorkshops);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar oficinas');
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkshop = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta oficina?')) {
      try {
        const { error } = await supabase
          .from('workshops')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        setWorkshops(workshops.filter(w => w.id !== id));
        toast.success('Oficina removida com sucesso');
      } catch (error: any) {
        console.error('Erro ao excluir oficina:', error);
        toast.error('Erro ao excluir oficina');
      }
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWorkshops();
    }
  }, [userId]);

  return {
    workshops,
    loading,
    fetchWorkshops,
    deleteWorkshop
  };
};
