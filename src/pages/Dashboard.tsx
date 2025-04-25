
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { WorkshopModal } from '@/components/workshop/WorkshopModal';
import { useWorkshops } from '@/hooks/useWorkshops';
import { WorkshopList } from '@/components/workshop/WorkshopList';
import { Workshop } from '@/types/workshop';

const Dashboard = () => {
  const [userId, setUserId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  
  const { workshops, loading, fetchWorkshops, deleteWorkshop } = useWorkshops(userId);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    
    fetchUser();
  }, []);

  const handleAddWorkshop = () => {
    setSelectedWorkshop(null);
    setIsModalOpen(true);
  };
  
  const handleEditWorkshop = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsModalOpen(true);
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
        <WorkshopList
          workshops={workshops}
          onEdit={handleEditWorkshop}
          onDelete={deleteWorkshop}
        />
      )}
      
      <WorkshopModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        workshop={selectedWorkshop}
        onWorkshopSaved={fetchWorkshops}
        userId={userId}
      />
    </div>
  );
};

export default Dashboard;
