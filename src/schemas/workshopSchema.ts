
import { z } from 'zod';

export const workshopSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').nonempty('Nome é obrigatório'),
  email: z.string().email('Email inválido').nonempty('Email é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').nonempty('Senha é obrigatória'),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres').nonempty('Endereço é obrigatório'),
  city: z.string().min(2, 'Cidade inválida').nonempty('Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres').nonempty('Estado é obrigatório'),
  zipCode: z.string()
    .length(8, 'CEP deve ter 8 dígitos')
    .regex(/^[0-9]+$/, 'CEP deve conter apenas números')
    .nonempty('CEP é obrigatório'),
  phone: z.string().min(10, 'Telefone inválido').nonempty('Telefone é obrigatório'),
  website: z.string().url('Website inválido').optional().or(z.literal('')),
  pricePopular: z.string().min(1, 'Preço é obrigatório')
    .refine(val => !isNaN(parseFloat(val.replace(',', '.'))), {
      message: 'Formato inválido, insira um valor numérico'
    }),
  priceMedium: z.string().min(1, 'Preço é obrigatório')
    .refine(val => !isNaN(parseFloat(val.replace(',', '.'))), {
      message: 'Formato inválido, insira um valor numérico'
    }),
  priceImported: z.string().min(1, 'Preço é obrigatório')
    .refine(val => !isNaN(parseFloat(val.replace(',', '.'))), {
      message: 'Formato inválido, insira um valor numérico'
    }),
});

export type WorkshopFormInput = z.infer<typeof workshopSchema>;
