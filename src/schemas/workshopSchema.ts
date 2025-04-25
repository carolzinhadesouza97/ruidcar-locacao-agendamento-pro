import { z } from 'zod';

export const workshopSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  city: z.string().min(2, 'Cidade inválida'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  zipCode: z.string().min(8, 'CEP inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  pricePopular: z.string().min(1, 'Preço é obrigatório'),
  priceMedium: z.string().min(1, 'Preço é obrigatório'),
  priceImported: z.string().min(1, 'Preço é obrigatório'),
});

export type WorkshopFormInput = z.infer<typeof workshopSchema>;

// This type is no longer needed since we're handling the conversion manually
// export type WorkshopFormData = z.infer<typeof workshopSchema>;
