
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useState } from 'react';
import { toast } from 'sonner';

// User registration schema
const userSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirme sua senha'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type UserFormValues = z.infer<typeof userSchema>;

const RegisterUser = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  const handleRegister = async (data: UserFormValues) => {
    setIsLoading(true);
    try {
      // Here we'd normally connect to a backend API
      console.log('Registering user:', data);
      
      // Simulate a registration delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success('Cadastro realizado com sucesso! Por favor, faça login.');
      navigate('/');
    } catch (error: any) {
      console.error('Error registering user:', error);
      toast.error(error.message || 'Erro ao cadastrar usuário');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Mock Google authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.info('Funcionalidade de login com Google será implementada em breve!');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm border">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Cadastro de Usuário</h1>
              <p className="text-muted-foreground mt-2">
                Crie sua conta para agendar serviços nas melhores oficinas
              </p>
            </div>
            
            <Button 
              className="w-full flex gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100" 
              onClick={handleSignInWithGoogle}
              disabled={isLoading}
            >
              <LogIn className="h-4 w-4" /> 
              Continuar com Google
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-2 text-sm text-muted-foreground">
                  Ou cadastre-se com email
                </span>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="seu-email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Mínimo de 6 caracteres" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirme sua senha <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Digite sua senha novamente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full mt-4" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                  </Button>
                </div>
                
                <div className="text-center text-sm">
                  Já possui uma conta?{' '}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => navigate('/')}
                  >
                    Faça login
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterUser;
