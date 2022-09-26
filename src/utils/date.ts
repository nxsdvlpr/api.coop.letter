import { format } from 'date-fns';

export const currentDayName = () => {
  const date = new Date();
  const day = date.toLocaleString('en-us', { weekday: 'long' });
  return day;
};

export const currentDate = (dateFormat = 'yyyy-MM-dd') => {
  return format(new Date(), dateFormat);
};

export const lastDaysDate = (days: number) => {
  const daysDate = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    daysDate.push(date.toISOString().split('T')[0]);
  }

  return daysDate;
};
