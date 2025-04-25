
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
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data: LoginFormValues) => {
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
      toast.error(error.message || 'Erro ao fazer login');
    }
  };

  const handleResetPassword = async (email: string) => {
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
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isResetting ? 'Recuperar Senha' : 'Login'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(isResetting ? 
            () => handleResetPassword(form.getValues('email')) : 
            handleLogin)} 
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
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isResetting && (
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
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full">
                {isResetting ? 'Enviar link de recuperação' : 'Entrar'}
              </Button>

              <div className="flex justify-between items-center mt-2">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setIsResetting(!isResetting)}
                  className="text-sm"
                >
                  {isResetting ? 'Voltar ao login' : 'Esqueci minha senha'}
                </Button>

                {!isResetting && (
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      onClose();
                      navigate('/register-workshop');
                    }}
                    className="text-sm"
                  >
                    Cadastrar-se
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
