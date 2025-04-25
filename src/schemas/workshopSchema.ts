
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
  pricePopular: z.string().transform((val) => Number(val.replace(',', '.'))).refine((val) => !isNaN(val), { message: 'Preço inválido' }),
  priceMedium: z.string().transform((val) => Number(val.replace(',', '.'))).refine((val) => !isNaN(val), { message: 'Preço inválido' }),
  priceImported: z.string().transform((val) => Number(val.replace(',', '.'))).refine((val) => !isNaN(val), { message: 'Preço inválido' }),
});

export type WorkshopFormInput = {
  name: string;
  email: string;
  password: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  pricePopular: string;
  priceMedium: string;
  priceImported: string;
};

export type WorkshopFormData = z.infer<typeof workshopSchema>;
