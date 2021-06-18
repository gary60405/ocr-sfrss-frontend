import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

// CAUTION: Numbers are implicitly assumed to be milliseconds since epoch and strings are
// implicitly assumed to be valid for the Date() constructor.
export type DateInput = Date | number | string;

// The single-character values here are meant to match the mask placeholders used in the
// native formatDate() function.
export type DatePart =
  | 'y' | 'year' // Year
  | 'M' | 'month' // Month
  | 'd' | 'day' // Day
  | 'h' | 'hour' // Hour
  | 'm' | 'minute' // Minute
  | 's' | 'second' // Second
  | 'S' | 'millisecond' // Fractional second (millisecond)
  ;

@Injectable({
  providedIn: 'root',
})

export class DateService {

  constructor(private datePipe: DatePipe) { }

  public getLastDaysTimeRange(days: number) {
    const nowDate = new Date();
    if (days > 0) {
      return {
        start: this.format(nowDate, 'yyyy/MM/dd HH:mm:ss'),
        stop: this.format(this.add('d', days, nowDate), 'yyyy/MM/dd HH:mm:ss')
      };
    } else if (days < 0) {
      return {
        start: this.format(this.add('d', days, nowDate), 'yyyy/MM/dd HH:mm:ss'),
        stop: this.format(nowDate, 'yyyy/MM/dd HH:mm:ss')
      };
    } else {
      return {
        start: this.format(nowDate, 'yyyy/MM/dd HH:mm:ss'),
        stop: this.format(nowDate, 'yyyy/MM/dd HH:mm:ss'),
      };
    }

  }

  private format(date: Date, pattern: string): string {
    const result = this.datePipe.transform(date, pattern);
    return result === null ? '' : result;
  }

  private add(part: DatePart, delta: number, input: DateInput): Date {

    const result = new Date(input);
    switch (part) {
      case 'year':
      case 'y':
        result.setFullYear(result.getFullYear() + delta);
        break;
      case 'month':
      case 'M':
        result.setMonth(result.getMonth() + delta);
        break;
      case 'day':
      case 'd':
        result.setDate(result.getDate() + delta);
        break;
      case 'hour':
      case 'h':
        result.setHours(result.getHours() + delta);
        break;
      case 'minute':
      case 'm':
        result.setMinutes(result.getMinutes() + delta);
        break;
      case 'second':
      case 's':
        result.setSeconds(result.getSeconds() + delta);
        break;
      case 'millisecond':
      case 'S':
        result.setMilliseconds(result.getMilliseconds() + delta);
        break;
    }

    return (result);

  }

}
