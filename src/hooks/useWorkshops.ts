
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
      // Completely bypass TypeScript's complex type inference
      const result = await supabase
        .from('workshops')
        .select('*')
        .eq('owner_id', userId);
      
      // Cast the result to a simple structure after the query is complete
      const data = result.data as WorkshopDTO[] | null;
      const error = result.error;
        
      if (error) throw error;
      
      // Process the data with our converter
      const rawData = (data ?? []);
      const typedWorkshops = rawData.map(convertDTOToWorkshop);
      
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
