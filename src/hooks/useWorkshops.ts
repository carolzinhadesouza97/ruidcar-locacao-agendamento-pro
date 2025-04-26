
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Workshop } from '@/types/workshop';
import { convertDTOToWorkshop } from '@/utils/workshopDataConverter';
import { toast } from 'sonner';
import { PostgrestError } from '@supabase/supabase-js';

export const useWorkshops = (userId: string) => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkshops = async () => {
    try {
      // @ts-ignore TS2589
      const { data, error } = await supabase
        .from('workshops')
        .select('*')
        .eq('owner_id', userId);
      
      if (error) throw error as PostgrestError;
      
      if (data) {
        const typedWorkshops = data.map(item => convertDTOToWorkshop(item));
        setWorkshops(typedWorkshops);
      } else {
        setWorkshops([]);
      }
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
        // @ts-ignore TS2589
        const { error } = await supabase
          .from('workshops')
          .delete()
          .eq('id', id);
          
        if (error) throw error as PostgrestError;
        
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
