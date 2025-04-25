
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { WorkshopModal } from '@/components/workshop/WorkshopModal';
import { toast } from 'sonner';

interface Workshop {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWorkshop, setCurrentWorkshop] = useState<Workshop | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
        return;
      }
      
      setUser(session.user);
      setLoading(false);
      fetchWorkshops(session.user.id);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate('/');
        } else if (session?.user) {
          setUser(session.user);
          fetchWorkshops(session.user.id);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchWorkshops = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('workshops')
        .select('id, name, address, city, state')
        .eq('owner_id', userId);

      if (error) throw error;
      setWorkshops(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar oficinas:', error);
      toast.error('Não foi possível carregar suas oficinas');
    }
  };

  const handleAddWorkshop = () => {
    setCurrentWorkshop(null);
    setIsModalOpen(true);
  };

  const handleEditWorkshop = (workshop: Workshop) => {
    setCurrentWorkshop(workshop);
    setIsModalOpen(true);
  };

  const handleDeleteWorkshop = async (workshopId: string) => {
    if (confirm('Tem certeza que deseja excluir esta oficina?')) {
      try {
        const { error } = await supabase
          .from('workshops')
          .delete()
          .eq('id', workshopId);

        if (error) throw error;
        
        setWorkshops(workshops.filter(w => w.id !== workshopId));
        toast.success('Oficina removida com sucesso');
      } catch (error: any) {
        console.error('Erro ao excluir oficina:', error);
        toast.error('Erro ao excluir oficina');
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-1 container py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-brand-gray">Meu Painel</h1>
              <p className="text-brand-gray">
                Bem-vindo(a), {user?.user_metadata?.name || user?.email}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddWorkshop}>
                <Plus className="w-4 h-4 mr-1" />
                Nova Oficina
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Minhas Oficinas</h2>
            
            {workshops.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-md">
                <p className="text-muted-foreground mb-4">
                  Você ainda não possui oficinas cadastradas
                </p>
                <Button onClick={handleAddWorkshop}>
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar Oficina
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {workshops.map((workshop) => (
                  <div key={workshop.id} className="py-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-lg">{workshop.name}</h3>
                      <p className="text-muted-foreground">
                        {workshop.address}, {workshop.city}/{workshop.state}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditWorkshop(workshop)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteWorkshop(workshop.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {isModalOpen && (
          <WorkshopModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            workshop={currentWorkshop}
            onWorkshopSaved={() => {
              setIsModalOpen(false);
              fetchWorkshops(user.id);
            }}
            userId={user.id}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
