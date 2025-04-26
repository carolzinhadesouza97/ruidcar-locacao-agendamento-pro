
import { useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { WorkshopFormInput } from '@/schemas/workshopSchema';

interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const useCepValidation = (form: UseFormReturn<WorkshopFormInput>) => {
  const validateCep = useCallback(async (cep: string) => {
    if (!cep || cep.length !== 8) {
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data: CepResponse = await response.json();

      if (data.erro) {
        toast.error('CEP não encontrado');
        return;
      }

      // Atualiza os campos do formulário
      if (data.logradouro) {
        form.setValue('address', data.logradouro, { shouldValidate: true });
      }
      if (data.localidade) {
        form.setValue('city', data.localidade, { shouldValidate: true });
      }
      if (data.uf) {
        form.setValue('state', data.uf, { shouldValidate: true });
      }

      toast.success('Endereço preenchido com sucesso!');
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast.error('Erro ao buscar o CEP. Tente novamente.');
    }
  }, [form]);

  return { validateCep };
};
