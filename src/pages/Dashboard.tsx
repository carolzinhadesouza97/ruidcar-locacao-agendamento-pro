
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { WorkshopModal } from '@/components/workshop/WorkshopModal';
import { Json } from '@/integrations/supabase/types';

// Separate type for OpenHours to simplify the Workshop interface
type OpenHours = Record<string, string>;

// Helper function to convert Json to OpenHours
const convertOpenHours = (hours: Json): OpenHours => {
  if (typeof hours === 'string') {
    return JSON.parse(hours);
  }
  if (Array.isArray(hours)) {
    return Object.fromEntries(hours as [string, string][]);
  }
  if (typeof hours === 'object' && hours !== null) {
    return Object.entries(hours).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: String(value)
    }), {} as OpenHours);
  }
  return {};
};

// Base Workshop interface with common properties
interface WorkshopBase {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  phone?: string;
  website?: string;
  price_popular?: number;
  price_medium?: number;
  price_imported?: number;
  rating?: number;
  approved?: boolean;
  created_at?: string;
  email?: string;
  lat?: number;
  lng?: number;
}

// Extended Workshop interface with OpenHours
interface Workshop extends WorkshopBase {
  open_hours: OpenHours;
}

const Dashboard = () => {
  const [userId, setUserId] = useState<string>('');
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

  useEffect(() => {
    const fetchUserAndWorkshops = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
          
          const { data, error } = await supabase
            .from('workshops')
            .select('*')
            .eq('owner_id', user.id);
            
          if (error) throw error;
          
          // Explicitly map the raw data to our Workshop interface with simplified typing
          const typedWorkshops: Workshop[] = (data || []).map(item => ({
            id: item.id,
            name: item.name,
            address: item.address,
            city: item.city,
            state: item.state,
            zip_code: item.zip_code,
            phone: item.phone,
            website: item.website,
            price_popular: item.price_popular,
            price_medium: item.price_medium,
            price_imported: item.price_imported,
            rating: item.rating,
            approved: item.approved,
            created_at: item.created_at,
            email: item.email,
            lat: item.lat,
            lng: item.lng,
            open_hours: convertOpenHours(item.open_hours)
          }));
          
          setWorkshops(typedWorkshops);
        }
      } catch (error: any) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar oficinas');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserAndWorkshops();
  }, []);

  const handleAddWorkshop = () => {
    setSelectedWorkshop(null);
    setIsModalOpen(true);
  };
  
  const handleEditWorkshop = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsModalOpen(true);
  };
  
  const handleDeleteWorkshop = async (id: string) => {
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
  
  const handleWorkshopSaved = async () => {
    try {
      const { data, error } = await supabase
        .from('workshops')
        .select('*')
        .eq('owner_id', userId);
        
      if (error) throw error;
      
      // Explicitly map the raw data to our Workshop interface with simplified typing
      const typedWorkshops: Workshop[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        address: item.address,
        city: item.city,
        state: item.state,
        zip_code: item.zip_code,
        phone: item.phone,
        website: item.website,
        price_popular: item.price_popular,
        price_medium: item.price_medium,
        price_imported: item.price_imported,
        rating: item.rating,
        approved: item.approved,
        created_at: item.created_at,
        email: item.email,
        lat: item.lat,
        lng: item.lng,
        open_hours: convertOpenHours(item.open_hours)
      }));
      
      setWorkshops(typedWorkshops);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Erro ao atualizar lista de oficinas:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Minhas Oficinas</h1>
        <Button onClick={handleAddWorkshop}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Oficina
        </Button>
      </div>
      
      {workshops.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg border border-dashed">
          <p className="text-gray-500">Você ainda não possui oficinas cadastradas.</p>
          <Button onClick={handleAddWorkshop} variant="outline" className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" />
            Cadastrar minha primeira oficina
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {workshops.map((workshop) => (
            <div 
              key={workshop.id} 
              className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-lg">{workshop.name}</h2>
                <p className="text-sm text-gray-500">{workshop.address}, {workshop.city}/{workshop.state}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEditWorkshop(workshop)}>
                  <Edit className="h-4 w-4" />
                  <span className="ml-1 hidden md:inline">Editar</span>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteWorkshop(workshop.id)}>
                  <Trash className="h-4 w-4" />
                  <span className="ml-1 hidden md:inline">Excluir</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <WorkshopModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        workshop={selectedWorkshop}
        onWorkshopSaved={handleWorkshopSaved}
        userId={userId}
      />
    </div>
  );
};

export default Dashboard;
