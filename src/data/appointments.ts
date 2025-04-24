
import { Workshop } from "./workshops";

export interface Appointment {
  id: string;
  workshopId: string;
  customerName: string;
  contactPhone: string;
  licensePlate: string;
  carModel: string;
  comment?: string;
  date: Date | string;
  time: string;
  price: number;
  carType: "popular" | "medium" | "imported";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: Date | string;
}

// Mock appointment data
export const appointmentsData: Appointment[] = [
  {
    id: "a1",
    workshopId: "1",
    customerName: "Carlos Silva",
    contactPhone: "(11) 97777-1234",
    licensePlate: "ABC1D23",
    carModel: "Fiat Uno",
    comment: "Revisão de 30.000 km",
    date: "2025-05-05",
    time: "10:00",
    price: 250,
    carType: "popular",
    status: "confirmed",
    createdAt: "2025-05-01",
  },
  {
    id: "a2",
    workshopId: "1",
    customerName: "Ana Costa",
    contactPhone: "(11) 97777-2345",
    licensePlate: "DEF4G56",
    carModel: "Honda Civic",
    comment: "Problema no alternador",
    date: "2025-05-05",
    time: "14:00",
    price: 350,
    carType: "medium",
    status: "confirmed",
    createdAt: "2025-05-01",
  },
  {
    id: "a3",
    workshopId: "2",
    customerName: "Luiz Pereira",
    contactPhone: "(21) 97777-3456",
    licensePlate: "HIJ7K89",
    carModel: "Volkswagen Gol",
    date: "2025-05-06",
    time: "09:00",
    price: 200,
    carType: "popular",
    status: "pending",
    createdAt: "2025-05-02",
  },
  {
    id: "a4",
    workshopId: "3",
    customerName: "Fernanda Santos",
    contactPhone: "(31) 97777-4567",
    licensePlate: "LMN0P12",
    carModel: "Toyota Corolla",
    comment: "Troca de óleo e filtros",
    date: "2025-05-07",
    time: "11:00",
    price: 320,
    carType: "medium",
    status: "completed",
    createdAt: "2025-04-30",
  },
];

// Helper function to create a new appointment
export const createAppointment = (appointment: Omit<Appointment, "id" | "createdAt" | "status">): Appointment => {
  const id = `a${Math.floor(Math.random() * 10000)}`;
  
  return {
    ...appointment,
    id,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
};

// Helper function to get appointments by workshop ID
export const getAppointmentsByWorkshopId = (workshopId: string): Appointment[] => {
  return appointmentsData.filter((appointment) => appointment.workshopId === workshopId);
};
