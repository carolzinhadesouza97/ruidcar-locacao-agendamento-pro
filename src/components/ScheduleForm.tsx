
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from "lucide-react";
import { Workshop } from '@/data/workshops';
import { createAppointment } from '@/data/appointments';
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// License plate validation regex for Brazilian plates (old and new formats)
const licensePlateRegex = /^[A-Z]{3}[0-9]{1}[A-Z0-9]{1}[0-9]{2}$|^[A-Z]{3}[0-9]{4}$/;

// Schema for form validation
const scheduleFormSchema = z.object({
  customerName: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  contactPhone: z.string().min(10, { message: "Telefone inválido" }),
  licensePlate: z.string().regex(licensePlateRegex, { message: "Placa inválida (formato: ABC1234 ou ABC1D23)" }),
  carModel: z.string().min(2, { message: "Modelo do carro é obrigatório" }),
  comment: z.string().optional(),
  date: z.date({ required_error: "Selecione uma data" }),
  time: z.string({ required_error: "Selecione um horário" }),
  carType: z.enum(["popular", "medium", "imported"], { required_error: "Selecione o tipo de veículo" }),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

interface ScheduleFormProps {
  workshop: Workshop;
  onScheduleSuccess: () => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ workshop, onScheduleSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      customerName: "",
      contactPhone: "",
      licensePlate: "",
      carModel: "",
      comment: "",
      carType: "popular",
    },
  });

  // Get the price based on car type selection
  const getPrice = (carType: string): number => {
    switch (carType) {
      case "popular":
        return workshop.pricePopular;
      case "medium":
        return workshop.priceMedium;
      case "imported":
        return workshop.priceImported;
      default:
        return workshop.pricePopular;
    }
  };

  // Get available time slots for the selected date
  const getAvailableTimeSlots = (): string[] => {
    return [
      "08:00", "09:00", "10:00", "11:00", 
      "13:00", "14:00", "15:00", "16:00", "17:00"
    ];
  };

  // Handle form submission
  const onSubmit = async (data: ScheduleFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      const price = getPrice(data.carType);
      const appointment = createAppointment({
        workshopId: workshop.id,
        customerName: data.customerName,
        contactPhone: data.contactPhone,
        licensePlate: data.licensePlate,
        carModel: data.carModel,
        comment: data.comment,
        date: format(data.date, 'yyyy-MM-dd'),
        time: data.time,
        price,
        carType: data.carType as any,
      });
      
      // Simulate a server request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Agendamento realizado com sucesso!", {
        description: `Seu agendamento para ${format(data.date, 'dd/MM/yyyy')} às ${data.time} foi confirmado.`,
      });
      
      form.reset();
      onScheduleSuccess();
    } catch (error) {
      toast.error("Erro ao agendar", {
        description: "Não foi possível realizar o agendamento. Tente novamente.",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Watch the carType field to display the price
  const watchCarType = form.watch("carType");
  const currentPrice = getPrice(watchCarType);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-brand-gray">
          Agendar Serviço em {workshop.name}
        </CardTitle>
        <CardDescription>
          Preencha os dados abaixo para agendar seu serviço
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="João Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone/WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 98765-4321" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="licensePlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa do veículo</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ABC1234" 
                        {...field} 
                        value={field.value ? field.value.toUpperCase() : ''}
                        onChange={e => field.onChange(e.target.value.toUpperCase())}
                        maxLength={7}
                      />
                    </FormControl>
                    <FormDescription>
                      Formatos: ABC1234 ou ABC1D23
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="carModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo do veículo</FormLabel>
                    <FormControl>
                      <Input placeholder="Gol 1.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="carType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de veículo</FormLabel>
                  <FormDescription>
                    Selecione o tipo do seu veículo para calcular o valor do serviço
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="popular" />
                        </FormControl>
                        <FormLabel className="font-normal flex-1">
                          Popular
                          <span className="text-sm text-muted-foreground block">
                            Fiat Uno, VW Gol, Chevrolet Onix, etc.
                          </span>
                        </FormLabel>
                        <span className="font-semibold text-brand-orange">
                          R$ {workshop.pricePopular.toFixed(2)}
                        </span>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="medium" />
                        </FormControl>
                        <FormLabel className="font-normal flex-1">
                          Médio 
                          <span className="text-sm text-muted-foreground block">
                            Honda Civic, Toyota Corolla, Nissan Sentra, etc.
                          </span>
                        </FormLabel>
                        <span className="font-semibold text-brand-orange">
                          R$ {workshop.priceMedium.toFixed(2)}
                        </span>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="imported" />
                        </FormControl>
                        <FormLabel className="font-normal flex-1">
                          Importado
                          <span className="text-sm text-muted-foreground block">
                            BMW, Mercedes, Audi, Land Rover, etc.
                          </span>
                        </FormLabel>
                        <span className="font-semibold text-brand-orange">
                          R$ {workshop.priceImported.toFixed(2)}
                        </span>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data do serviço</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            // Disable past dates and Sundays
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return (
                              date < today ||
                              date.getDay() === 0 || // Sunday
                              date > new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
                            );
                          }}
                          locale={ptBR}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={!form.watch("date")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um horário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getAvailableTimeSlots().map(time => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentários adicionais (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva detalhes do serviço ou problemas específicos do veículo"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">Valor total:</span>
                  <p className="text-sm text-muted-foreground">
                    Serviço + Diagnóstico
                  </p>
                </div>
                <span className="text-xl font-bold text-brand-orange">
                  R$ {currentPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-brand-orange hover:bg-opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processando..." : "Agendar Serviço"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ScheduleForm;
