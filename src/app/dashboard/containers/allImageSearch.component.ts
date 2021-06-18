import { AfterViewInit, Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

import * as fromDashboard from '../reducers';
import { DialogInfo, ImageInfo } from '../models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CloudData, CloudOptions, ZoomOnHoverOptions } from 'angular-tag-cloud-module';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-all-image-search',
  templateUrl: './templates/allImageSearch.html',
  styles: [
    `
    img {
      object-fit: contain;
    }
    `
  ],
  providers: [ Globals ]
})

export class AllImageSearchComponent implements AfterViewInit, OnDestroy {
  @ViewChild('imagePaginator') paginator!: MatPaginator;
  @ViewChild('detailDialog') detailDialog!: TemplateRef<any>;

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

  zoomOnHoverOptions: ZoomOnHoverOptions = {
    scale: 1.2,
    transitionTime: 0.5,
    color: '#C2185B'
  };

  options: CloudOptions = {
    width: 0.8,
    height: 0.8,
    strict: false,
    overflow: false,
    font: '1em Arial, sans-serif',
    realignOnResize: true,
    randomizeAngle: true,
    delay: 10,
    zoomOnHover: this.zoomOnHoverOptions,
  };

  constructor(private sanitizer: DomSanitizer,
              private computerStore: Store<fromDashboard.State>,
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
      map((images: ImageInfo[]) => images.map((image: any) => {
        return {
          ...image,
          keywords: image.keywords.map((ele: CloudData) => {
            return {
              ...ele,
              tooltip: `${ele.weight}`
            };
          }),
          wordlist: image.wordlist.map((ele: CloudData) => {
            return {
              ...ele,
              tooltip: `${ele.weight}`
            };
          }),
          keywordSummary: image.keywords.map((x: any) => x.text).slice(0, 10).join(', ')
        };
    })),
    ).subscribe((imageInfo: any) => {
        this.dataSource = new MatTableDataSource<ImageInfo[]>(imageInfo);
        this.dataSource.paginator = this.paginator;
        this.data$ = this.dataSource.connect();
    });
  }

  openContent(content: any) {
    this.dialogInfo = {
      address: content.address,
      keywords: [...content.keywords],
      wordlist: [...content.wordlist],
      rawtext: content.rawtext,
    };
    this.dialog.open(this.detailDialog, {
      panelClass: 'custom-dialog',
      width: '75vw',
      height: '80vh'
    });
  }

  ngOnDestroy() {
    this.dataSource.disconnect();
    this.selectImageInfoSubscription.unsubscribe();
  }
}
