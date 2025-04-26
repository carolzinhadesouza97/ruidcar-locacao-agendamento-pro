
import { z } from 'zod';

export const workshopSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  city: z.string().min(2, 'Cidade inválida'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  zipCode: z.string().length(8, 'CEP deve ter 8 dígitos').refine(value => /^[0-9]+$/.test(value), 'CEP deve conter apenas números'),
  phone: z.string().min(10, 'Telefone inválido'),
  pricePopular: z.string().min(1, 'Preço é obrigatório'),
  priceMedium: z.string().min(1, 'Preço é obrigatório'),
  priceImported: z.string().min(1, 'Preço é obrigatório'),
});

export type WorkshopFormInput = z.infer<typeof workshopSchema>;
