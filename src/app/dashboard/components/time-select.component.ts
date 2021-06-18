import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { QueryTimeInfo } from '../models';

@Component({
  selector: 'app-time-select',
  template: `
    <div>
      <div class="row my-2">
        <div class="fw-bold fs-4">{{timingText}}日期與時間</div>
      </div>
      <div class="row flex-column">
        <div class="col my-2">
          <div class="row align-items-center justify-content-center">
            <div class="col-3 ps-4 pe-0">
              <div class="fs-5 text-end">日期：</div>
            </div>
            <div class="col">
              <mat-form-field appearance="standard">
                <mat-label>選擇{{timingText}}日期</mat-label>
                <input matInput #date [value]="timeRange.date" [matDatepicker]="start_picker"
                  (dateChange)="onTimeChange($event, 'date')">
                <mat-datepicker-toggle matSuffix [for]="start_picker"></mat-datepicker-toggle>
                <mat-datepicker #start_picker></mat-datepicker>
              </mat-form-field>
            </div>
          </div>
        </div>
        <div class="col my-2">
          <div class="row align-items-center justify-content-center">
            <div class="col-3 ps-4 pe-0">
              <div class="fs-5 text-end">時間：</div>
            </div>
            <div class="col">
              <ngx-timepicker-field #time [format]="24" [defaultTime]="timeRange.time"
                (timeChanged)="onTimeChange($event, 'time')"></ngx-timepicker-field>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    ``
  ],
})
export class TimeSelectComponent {

  @Input() timingText = '';
  @Input() timingType = '';
  @Input() timeRange = { date: '', time: '' };
  @Output() timeChange = new EventEmitter();

  @ViewChild('date')date!: ElementRef<HTMLInputElement>;
  @ViewChild('time')time!: {timepickerTime: string};

  getDateTime() {
    return {
      date: this.date.nativeElement.value.replace(/-/g, '/'),
      time:  `${this.time.timepickerTime}:00`
    };
  }


  onTimeChange($event: any, dataType: string) {
    if (dataType === 'date') {
      return {
        value: $event.value.format('YYYY/MM/DD'), // this.date.nativeElement.value.replace(/-/g, '/'),
        type: `${this.timingType}_${dataType}` // `${this.time.timepickerTime}:00`
      };

    } else if (dataType === 'time') {
      return {
        value: $event, // `${this.time.timepickerTime}:00`
        type: `${this.timingType}_${dataType}`
      };
    }
    return { value: '', type: '' };
  }
}
