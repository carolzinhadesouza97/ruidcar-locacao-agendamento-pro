import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const workshopSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  city: z.string().min(2, 'Cidade inválida'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  zipCode: z.string().min(8, 'CEP inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  pricePopular: z.string().transform((val) => Number(val)),
  priceMedium: z.string().transform((val) => Number(val)),
  priceImported: z.string().transform((val) => Number(val)),
});

type WorkshopFormData = z.infer<typeof workshopSchema>;

const WorkshopRegistrationForm = () => {
  const navigate = useNavigate();
  const form = useForm<WorkshopFormData>({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      pricePopular: '',
      priceMedium: '',
      priceImported: '',
    },
  });

  const onSubmit = async (data: WorkshopFormData) => {
    try {
      // Primeiro, criar a conta da oficina
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      // Geocodificar o endereço para obter lat/lng
      const address = `${data.address}, ${data.city}, ${data.state}`;
      const geocoder = new google.maps.Geocoder();
      
      const geocodeResult = await new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
            resolve(results[0].geometry.location);
          } else {
            reject(new Error('Falha ao geocodificar endereço'));
          }
        });
      });

      const location = geocodeResult as google.maps.LatLng;

      // Inserir dados da oficina
      const { data: workshopData, error: workshopError } = await supabase
        .from('workshops')
        .insert({
          name: data.name,
          email: data.email,
          address: data.address,
          city: data.city,
          state: data.state,
          zip_code: data.zipCode,
          lat: location.lat(),
          lng: location.lng(),
          phone: data.phone,
          price_popular: data.pricePopular,
          price_medium: data.priceMedium,
          price_imported: data.priceImported,
          open_hours: {
            weekdays: '08:00 - 18:00',
            saturday: '08:00 - 12:00',
            sunday: 'Fechado',
          },
        })
        .select()
        .single();

      if (workshopError) throw workshopError;

      // Vincular a conta à oficina
      const { error: linkError } = await supabase
        .from('workshop_accounts')
        .insert({
          id: authData.user?.id,
          email: data.email,
          password: data.password,
          workshop_id: workshopData.id,
        });

      if (linkError) throw linkError;

      toast.success('Oficina cadastrada com sucesso! Aguarde a aprovação.');
      navigate('/');
    } catch (error: any) {
      console.error('Erro ao cadastrar oficina:', error);
      toast.error(error.message || 'Erro ao cadastrar oficina');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Oficina</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
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
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input maxLength={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="pricePopular"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço Popular</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priceMedium"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço Médio</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priceImported"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço Importado</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          Cadastrar Oficina
        </Button>
      </form>
    </Form>
  );
};

export default WorkshopRegistrationForm;
