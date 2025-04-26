
export const parseWeekdayHours = (periods?: any[]) => {
  if (!periods || periods.length === 0) return null;
  
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const result: {[key: string]: string} = {
    monday: 'Fechado',
    tuesday: 'Fechado',
    wednesday: 'Fechado',
    thursday: 'Fechado',
    friday: 'Fechado',
    saturday: 'Fechado',
    sunday: 'Fechado',
  };
  
  periods.forEach(period => {
    if (period.open && period.close) {
      const dayIndex = period.open.day;
      const day = daysOfWeek[dayIndex];
      
      const openHour = period.open.time.substring(0, 2) + ':' + period.open.time.substring(2);
      const closeHour = period.close.time.substring(0, 2) + ':' + period.close.time.substring(2);
      
      result[day] = `${openHour} - ${closeHour}`;
    }
  });
  
  return result;
};
