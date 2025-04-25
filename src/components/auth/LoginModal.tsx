
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Google } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isResetting, setIsResetting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      toast.success('Login realizado com sucesso!');
      onClose();
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      const errorMessage = 
        error.message === 'Invalid login credentials' 
          ? 'Email ou senha incorretos'
          : error.message || 'Erro ao fazer login';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });
      
      if (error) throw error;
      // Redirect is handled by Supabase
    } catch (error: any) {
      console.error('Erro ao fazer login com Google:', error);
      toast.error(error.message || 'Erro ao fazer login com Google');
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    if (!email) {
      toast.error('Por favor, informe seu email');
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
      setIsResetting(false);
    } catch (error: any) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      toast.error(error.message || 'Erro ao solicitar recuperação de senha');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isResetting ? 'Recuperar Senha' : 'Acesso para Oficinas'}
          </DialogTitle>
        </DialogHeader>

        {isResetting ? (
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(() => handleResetPassword(form.getValues('email')))} 
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="seu@email.com" 
                        disabled={isLoading}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-col gap-2">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
                </Button>
                
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setIsResetting(false)}
                  className="text-sm"
                  disabled={isLoading}
                >
                  Voltar ao login
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <>
            <Button 
              className="w-full flex gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100" 
              onClick={handleSignInWithGoogle}
              disabled={isLoading}
            >
              <Google className="h-4 w-4" /> 
              Continuar com Google
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-2 text-sm text-muted-foreground">
                  Ou continue com email
                </span>
              </div>
            </div>

            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(handleLogin)} 
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="seu@email.com" 
                          disabled={isLoading}
                          {...field} 
                        />
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
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          disabled={isLoading}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>

                  <div className="flex justify-between items-center mt-2">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setIsResetting(true)}
                      className="text-sm"
                      disabled={isLoading}
                    >
                      Esqueci minha senha
                    </Button>

                    <Button
                      type="button"
                      variant="link"
                      onClick={() => {
                        onClose();
                        navigate('/register-workshop');
                      }}
                      className="text-sm"
                      disabled={isLoading}
                    >
                      Cadastrar-se
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
