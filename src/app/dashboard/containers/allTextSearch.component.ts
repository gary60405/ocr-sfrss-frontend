import { AfterViewInit, Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromDashboard from '../reducers';
import { MatTableDataSource } from '@angular/material/table';
import { DialogInfo, ImageInfo } from '../models';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-all-text-search',
  template: `
    <div class="container-fliud">
      <div class="row m-0">
        <div class="col-6" *ngFor="let data of (data$ | async)">
          <app-text-card
            [date]="data.date"
            [time]="data.time"
            [userData]="data.user"
            [address]="data.address"
            [rawtext]="data.rawtext"
            (getImage)="openImage($event)"></app-text-card>
        </div>
        <mat-paginator #textPaginator [ngClass]="{'invisible': (isLoaded$ | async) === false}" [pageSizeOptions]="[12, 24, 36]"></mat-paginator>
      </div>
    </div>

    <ng-template #imageDialog>
      <h1 mat-dialog-title class="text-center fw-bold">滾輪可調整圖片大小</h1>
      <div mat-dialog-content class="row justify-content-center" style="height:calc(80vh - 100px - 48px);">
        <pinch-zoom class="h-100">
          <img class="m-0" src="{{ baseUrl }}/{{ dialogInfo.address }}">
        </pinch-zoom>
      </div>
      <div mat-dialog-actions class="row justify-content-center">
        <button class='w-50' mat-raised-button color="primary" mat-dialog-close>關閉</button>
      </div>
    </ng-template>
  `,
  styles: [],
  providers: [ Globals ]
})
export class AllTextSearchComponent implements AfterViewInit, OnDestroy {

  @ViewChild('textPaginator') paginator!: MatPaginator;
  @ViewChild('imageDialog') imageDialog!: TemplateRef<any>;

  baseUrl: string;
  data$!: BehaviorSubject<any>;
  isLoaded$: Observable<boolean>;
  dataSource!: MatTableDataSource<ImageInfo[]>;
  selectImageInfoSubscription!: Subscription;
  dialogInfo: DialogInfo = {
    address: '',
    keywords: [],
    wordlist: [],
    rawtext: '',
  };

  constructor(private computerStore: Store<fromDashboard.State>,
              public dialog: MatDialog,
              private global: Globals) {
        this.baseUrl = `${global.baseUrl}/static`;
        this.dataSource = new MatTableDataSource<ImageInfo[]>([]);
        this.dataSource.paginator = this.paginator;

        this.isLoaded$ = computerStore.select(fromDashboard.selectImageInfo).pipe(
          map((images: ImageInfo[]): boolean => images.length !== 0)
        );
  }

  ngAfterViewInit() {
    this.selectImageInfoSubscription = this.computerStore.select(fromDashboard.selectImageInfo).pipe(
      map((images: ImageInfo[]) => images)
    ).subscribe((imageInfo: any) => {
        this.dataSource = new MatTableDataSource<ImageInfo[]>(imageInfo);
        this.dataSource.paginator = this.paginator;
        this.data$ = this.dataSource.connect();
    });
  }

  openImage(address: string) {
    this.dialogInfo.address = address;
    this.dialog.open(this.imageDialog, {
      width: '75vw',
      height: '80vh'
    });
  }

  ngOnDestroy() {
    this.dataSource.disconnect();
    this.selectImageInfoSubscription.unsubscribe();
  }
}
