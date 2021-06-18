import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AfterViewInit, Component, OnInit, Output, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { CloudData, CloudOptions, ZoomOnHoverOptions } from 'angular-tag-cloud-module';

import { ComputersService } from '../services/computer.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { Globals } from 'src/app/globals';
import * as fromDashboard from '../reducers';
import * as fromRoot from '../../reducers';
import { DatetimeRange, KeywordUser } from '../models';
import { LayoutActions } from 'src/app/core/actions';
import { ComputerInfoActions } from '../actions';

@Component({
  selector: 'app-word-cloud',
  template: `
    <div class="row justify-content-center computer-group mt-5" style="height: calc(100vh);">
      <angular-tag-cloud [data]="(data$ | async)" [config]="options" (clicked)="onClickWord($event)">
      </angular-tag-cloud>
    </div>

    <ng-template #userDialog>
      <h1 mat-dialog-title class="text-center fw-bold">過去{{backdays}}日關鍵字出現概況</h1>
      <div mat-dialog-content class="row justify-content-center" style="height:calc(80vh - 100px - 48px);">
        <app-user-table
          [data]="users"
          (clickImage)="onOpenImage($event)"
          (clickDetail)="onNavigateDetail($event)"
          ></app-user-table>
      </div>
      <div mat-dialog-actions class="row justify-content-center">
        <button class='w-50' mat-raised-button color="primary" mat-dialog-close>關閉</button>
      </div>
    </ng-template>

    <ng-template #openImageDialog>
      <h1 mat-dialog-title class="text-center fw-bold">滾輪可調整圖片大小</h1>
      <div mat-dialog-content class="row justify-content-center" style="height:calc(80vh - 100px - 48px);">
        <pinch-zoom class="h-100">
          <img class="m-0" src="{{ baseUrl }}/{{ address }}">
        </pinch-zoom>
      </div>
      <div mat-dialog-actions class="row justify-content-center">
        <button class='w-50' mat-raised-button color="primary" mat-dialog-close>關閉</button>
      </div>
    </ng-template>
  `,
  styles: [
    `
    :host ::ng-deep angular-tag-cloud span {
      z-index: 1;
    }
    `
  ],
  providers: [ Globals ]
})
export class WordCloudComponent implements OnInit, AfterViewInit {
  @Output() involvePanel = new EventEmitter<any>();
  @ViewChild('userDialog') userDialog!: TemplateRef<any>;
  @ViewChild('openImageDialog') openImageDialog!: TemplateRef<any>;

  data$: Observable<CloudData[]>;
  clickWord!: any;
  dateTimeRange!: DatetimeRange;
  backdays: number;
  baseUrl: string;
  address: string;
  users: KeywordUser[];
  zoomOnHoverOptions: ZoomOnHoverOptions = {
    scale: 1.3,
    transitionTime: 0.5,
    color: '#C2185B'
  };
  options: CloudOptions = {
    width: 1,
    height: 0.8,
    strict: false,
    overflow: false,
    font: '1.5em Arial, sans-serif',
    realignOnResize: true,
    randomizeAngle: true,
    delay: 10,
    zoomOnHover: this.zoomOnHoverOptions,
  };

  constructor(private layoutStore: Store<fromRoot.State>,
              private computerStore: Store<fromDashboard.State>,
              private computersService: ComputersService,
              public dialog: MatDialog,
              private global: Globals,
              private router: Router,
              private routes: ActivatedRoute) {
    this.users = [];
    this.address = '';
    this.baseUrl = `${global.baseUrl}/static`;
    this.backdays = -global.backdaysNum; // 負數轉正
    this.data$ = computerStore.select(fromDashboard.selectAllKeywords).pipe(
        map((wordlist: CloudData[]): CloudData[] => {
          return wordlist.map((ele: CloudData): CloudData => {
            return {
              ...ele,
              tooltip: `${ele.weight}`
            };
          });
        })
      );
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.computerStore.dispatch(LayoutActions.closeProgressBar());
  }
  onClickWord($event: CloudData) {
    this.clickWord = $event.text;

     // 選目前ComputerInfo狀態的時間範圍去查詢
    this.computerStore.select(fromDashboard.selectDatetimeRange)
        .pipe(take(1))
        .toPromise()
        .then((range: DatetimeRange) => {
          this.dateTimeRange = range;
          this.computersService.fetchKeywordUser(range.start_datetime, range.stop_datetime, this.backdays, $event.text || '')
              .toPromise()
              .then((users: KeywordUser[]) => {
                  this.users = users;
                  this.dialog.open(this.userDialog, {
                    width: '75vw',
                    height: '80vh'
                  });
              });
        });
  }

  onOpenImage(address: string) {
    this.address = address;
    this.dialog.open(this.openImageDialog, {
      width: '75vw',
      height: '80vh'
    });
  }

  onNavigateDetail(computerId: string) {
    this.computerStore.dispatch(ComputerInfoActions.updateAndQueryText({andQueryText: [ this.clickWord ]}));
    // this.computerStore.dispatch(ComputerInfoActions.setComputerInfoMode({mode: 'allTextSearch'}));
    this.router.navigate(['./allTextSearch', {
      mode: 'allTextSearch',
      userQueryText: computerId,
      userQueryType: '電腦名稱',
      orQueryfield: [],
      andQueryfield: [ this.clickWord ],
      notQueryfield: [],
      start_datetime: this.dateTimeRange.start_datetime,
      stop_datetime: this.dateTimeRange.stop_datetime,
    }], { relativeTo: this.routes });
    this.involvePanel.emit();
  }
}
