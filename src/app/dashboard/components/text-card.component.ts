import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Computer } from '../models';

@Component({
  selector: 'app-text-card',
  template: `
    <mat-card class="mt-3">
      <mat-card-header>
        <mat-card-title
          matTooltip="電腦名稱： {{ userData.computer_id }}&#13;ASEID： {{ userData.ase_id }}&#13;部門代碼： {{ userData.department_id }}"
          matTooltipPosition="right"
          matTooltipClass="allow-cr"
        >{{ userData.name }}({{ userData.id }})</mat-card-title>
        <mat-card-subtitle> 截圖時間： {{ date }} {{ time }} </mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="row m-0">
          <div class="mt-2 px-3 fs-6 text-break" [innerHTML]="rawtext"></div>
        </div>
      </mat-card-content>
      <mat-card-actions class="row justify-content-center p-0">
        <button mat-button (click)="checkImage()">檢視圖片</button>
      </mat-card-actions>
    </mat-card>
  `,
})
export class TextCardComponent {
  @Input() date?: string | undefined;
  @Input() time?: string | undefined;
  @Input() address?: string | undefined;
  @Input() userData!: Computer;
  @Input() rawtext?: string;
  @Output() getContent = new EventEmitter<any>();
  @Output() getImage = new EventEmitter<any>();

  checkImage() {
    this.getImage.emit(this.address);
  }
}
