import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CloudData } from 'angular-tag-cloud-module';
import { Globals } from 'src/app/globals';
import { Computer } from '../models';

@Component({
  selector: 'app-image-card',
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
        <div matRipple>
          <img mat-card-image
          role="button"
          (click)="checkContent()"
          class="m-0"
          src="{{baseUrl}}/{{ address }}">
        </div>
        <div class="fs-6 fw-bold text-center mt-3">頻率前10關鍵字</div>
        <div class="mt-2 mx-3">{{ keywordSummary }}</div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    ``
  ],
})
export class ImageCardComponent {
  @Input() date?: string | undefined;
  @Input() time?: string | undefined;
  @Input() userData!: Computer;
  @Input() address?: string | undefined;
  @Input() keywordSummary?: string | undefined;
  @Input() keywords?: CloudData[] | undefined;
  @Input() wordlist?: CloudData[] | undefined;
  @Input() rawtext?: string;
  @Output() getContent = new EventEmitter<any>();

  baseUrl: string;

  constructor(private global: Globals) {
    this.baseUrl = `${global.baseUrl}/static`;
  }

  checkContent() {
    this.getContent.emit({
      address: this.address,
      keywords: this.keywords,
      wordlist: this.wordlist,
      rawtext: this.rawtext
    });
  }
}
