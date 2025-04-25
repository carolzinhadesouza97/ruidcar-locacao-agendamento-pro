
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { registerOwnerSchema, type RegisterOwnerFormValues } from '@/schemas/ownerSchema';
import { OwnerFormFields } from '@/components/auth/OwnerFormFields';
import { useOwnerRegistration } from '@/hooks/useOwnerRegistration';

const RegisterOwner = () => {
  const navigate = useNavigate();
  const { isLoading, handleRegister, handleSignInWithGoogle } = useOwnerRegistration();
  
  const form = useForm<RegisterOwnerFormValues>({
    resolver: zodResolver(registerOwnerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm border">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Cadastro de Proprietário</h1>
              <p className="text-muted-foreground mt-2">
                Crie sua conta para gerenciar suas oficinas
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
                <OwnerFormFields form={form} isLoading={isLoading} />
                
                <Button 
                  type="submit" 
                  className="w-full mt-4" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
                
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

export default RegisterOwner;
