import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateUtil {
  static getFormattedDate(date: Date): string {
    return date.toISOString().substring(0, 10);
  }

  static addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);

    return newDate;
  }

  static addMonths(date: Date, months: number): Date {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);

    return newDate;
  }
}
