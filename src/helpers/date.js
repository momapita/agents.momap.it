/**
 * 
 *  ESEMPIO DI UTILIZZO
 * 
 *   import DateHelper from '@/helpers/date';
    const dateHelper1 = new DateHelper();
 * 
 */

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Estendi dayjs per utilizzare i plugin utc e timezone
dayjs.extend(utc);
dayjs.extend(timezone);

class DateHelper {

  constructor() {
    this.fallbackTimezone = 'UTC';
    this.timeZone = dayjs.tz.guess() ?? fallbackTimezone;
  }

  getTimeZone() {
    return this.timeZone;
  }

  formatDate(date, format = 'YYYY-MM-DD HH:mm:ss', utcConversion = true) {
    
    if (date === '0000-00-00 00:00:00' || !dayjs(date).isValid()) {
      return null;
    }

    return utcConversion ? dayjs.utc(date).tz(this.timeZone).format(format) : dayjs(date).tz(this.timeZone).format(format);
  }

  getDateString(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  differenceTwoDates(date1, date2, unit = null) {
    const startDate = dayjs(date1);
    const endDate = dayjs(date2);

    return unit ? startDate.diff(endDate, unit) : {
      days: startDate.diff(endDate, 'd'),
      hours: startDate.diff(endDate, 'h'),
      years: startDate.diff(endDate, 'y'),
      months: startDate.diff(endDate, 'M'),
      minutes: startDate.diff(endDate, 'm'),
    };
  }

  checkDate(date) {
    return date !== '0000-00-00 00:00:00' && dayjs(date).isValid();
  }

  checkDateIsAfter(date) {
    const currentDate = dayjs();
    return this.formatDate(dayjs(date).isAfter(currentDate, 'day') ? currentDate : date);
  }

  isDateOlderThanNow(date) {
    return new Date(date) < new Date(new Date().getTime() - 15 * 60000);
  }

  dateFromHoursAndMinutes(time = '00:00', second = '00') {
    try {
     
      if (!/^\d{2}:\d{2}$/.test(time)) {
        throw new Error('Formato non valido');
      } 

      // Divido l'ora e i minuti e li converto in numeri interi
      const [hours, minutes] = time.split(':').map(Number);
      const correctedHours = Math.min(hours, 23);
      const correctedMinutes = hours > 23 ? 59 : Math.min(minutes, 59);

      return new Date(dayjs().set('hour', correctedHours).set('minute', correctedMinutes).set('second', second));
    } catch {
      return new Date(dayjs().set('hour', 0).set('minute', 0).set('second', 0));
    }
  }

  diffMonths(startDate, endDate) {
    if (!this.checkDate(startDate) || !this.checkDate(endDate)) {
        return null;
    } 
    return dayjs(endDate).diff(dayjs(startDate), 'month');
  }

}

export default DateHelper;