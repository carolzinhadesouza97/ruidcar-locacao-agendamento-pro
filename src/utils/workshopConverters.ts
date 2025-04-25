
import { Workshop, WorkshopDTO } from '@/types/workshop';

export const convertDTOToWorkshop = (dto: WorkshopDTO): Workshop => ({
  ...dto,
  open_hours: typeof dto.open_hours === 'string'
    ? JSON.parse(dto.open_hours)
    : dto.open_hours,
  website: dto.website ?? '',
});
