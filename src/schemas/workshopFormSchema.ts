
import * as z from 'zod';

export const workshopFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  city: z.string().min(2, 'Cidade inválida'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  zipCode: z.string().min(8, 'CEP inválido'),
  phone: z.string().min(10, 'Telefone inválido').optional(),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  pricePopular: z.string().min(1, 'Preço é obrigatório'),
  priceMedium: z.string().min(1, 'Preço é obrigatório'),
  priceImported: z.string().min(1, 'Preço é obrigatório'),
});

export type WorkshopFormInput = z.infer<typeof workshopFormSchema>;
