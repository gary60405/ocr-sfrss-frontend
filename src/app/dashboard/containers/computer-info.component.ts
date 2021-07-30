import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, take } from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import { ComputerActions, ComputerInfoActions } from '../actions';
import { QueryTimeInfo, DatetimeRange, AlertContent } from '../models';
import { CloudData } from 'angular-tag-cloud-module';
import { TimeSelectComponent } from './../components/time-select.component';

import * as fromDashboard from '../reducers';
import * as fromRoot from '../../reducers';

import { ActivatedRoute, Router } from '@angular/router';
import { MatChipInputEvent } from '@angular/material/chips';
import { Globals } from 'src/app/globals';
import { LayoutActions } from 'src/app/core/actions';
import { CdkAccordionItem } from '@angular/cdk/accordion';


@Component({
  selector: 'app-computer-info',
  templateUrl: './templates/computer-info.html',
  styleUrls: ['./css/computer-info.sass'],
})

export class ComputerInfoComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('start_datetime_pickper') startDatetimePickper!: TimeSelectComponent;
  @ViewChild('stop_datetime_pickper') stopDatetimePickper!: TimeSelectComponent;
  @ViewChild('panel') panel!: CdkAccordionItem;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  searchTypes = [ '員工姓名', '電腦名稱', '員工編號', '部門代碼', 'ASEID'];

  userQueryType$: Observable<string>;
  selectDatetimeRange$: Observable<DatetimeRange>;
  filterOption$: Observable<string[]>;
  isDataLoaded$: Observable<boolean>;
  alertContent$: Observable<AlertContent>;

  userQueryTextSubscription!: Subscription;
  userQueryTypeSubscription!: Subscription;
  orQueryfieldSubscription!: Subscription;
  andQueryfieldSubscription!: Subscription;
  notQueryfieldSubscription!: Subscription;
  userQueryTextControlSubscription!: Subscription;

  // 為了解決UI顯示的問題，所以分兩個
  routeSubscription1!: Subscription;
  routeSubscription2!: Subscription;

  orQueryfield: string[] = [];
  andQueryfield: string[] = [];
  notQueryfield: string[] = [];
  userQueryText = '';
  userQueryType = '';

  computerId = '';
  selectedMode = '';
  panelOpenState = true;
  userQueryTextControl = new FormControl();
  timeRange: QueryTimeInfo = {
    start_date: '',
    stop_date: '',
    start_time: '',
    stop_time: '',
  };

  constructor(private layoutStore: Store<fromRoot.State>,
              private computerStore: Store<fromDashboard.State>,
              private global: Globals,
              private router: Router,
              private routes: ActivatedRoute) {
    this.isDataLoaded$ = layoutStore.select(fromRoot.selectLoaded);
    this.userQueryType$ = computerStore.select(fromDashboard.selectQueryType);
    this.selectDatetimeRange$ = computerStore.select(fromDashboard.selectDatetimeRange);
    this.filterOption$ = computerStore.select(fromDashboard.selectFilterOption);
    this.alertContent$ = layoutStore.select(fromRoot.selectAlertInfo).pipe(map((content: AlertContent) => {
      return {
        ...content,
        content: content.content.replace('@N', `${-global.backdaysNum}`)
      };
    }));
  }

  ngOnInit() {
    this.userQueryTextControlSubscription = this.userQueryTextControl.valueChanges
        .subscribe(value => this.onTypeUserQueryText(value));
    this.userQueryTextSubscription = this.computerStore.select(fromDashboard.selectQueryText)
        .subscribe(userQueryText => this.userQueryText = userQueryText);
    this.userQueryTypeSubscription = this.computerStore.select(fromDashboard.selectQueryType)
        .subscribe(userQueryType => this.userQueryType = userQueryType);
    this.orQueryfieldSubscription = this.computerStore.select(fromDashboard.selectOrQueryText)
        .subscribe(orQueryText => this.orQueryfield = [...orQueryText]);
    this.andQueryfieldSubscription = this.computerStore.select(fromDashboard.selectAndQueryText)
        .subscribe(andQueryText => this.andQueryfield = [...andQueryText]);
    this.notQueryfieldSubscription = this.computerStore.select(fromDashboard.selectNotQueryText)
        .subscribe(notQueryText => this.notQueryfield = [...notQueryText]);

    this.layoutStore.select(fromRoot.selectRouteNestedParam()) // 只負責第一次進來的查詢
        .pipe(take(1))
        .toPromise()
        .then((params) => {
          const url = this.router.url;
          ['wordCloud', 'table', 'allImageSearch']
            .forEach(mode => {
              if (url.includes(mode)) {
                this.selectedMode = mode;
                this.computerStore.dispatch(ComputerInfoActions.setComputerInfoMode({ mode }));
              }
            });
          if (this.getNonNullString(params.mode) === '') {
            this.router.navigate([`/dashboard/computerInfo/${this.selectedMode}`, { mode: this.selectedMode }]);
          } else {
            if (['wordCloud', 'table'].includes(params.mode)) {
              this.computerStore.dispatch(ComputerActions.fetchAllkeyword({
                userQueryText: this.userQueryText,
                userQueryType: this.userQueryType,
                start_datetime: this.getNonNullString(params.start_datetime),
                stop_datetime: this.getNonNullString(params.stop_datetime),
                backdays: -this.global.backdaysNum
              }));
            } else {
              if (this.selectedMode !== '') {
                this.computerStore.dispatch(ComputerInfoActions.fetchImageInfo({
                  backdays: -this.global.backdaysNum,
                  start_datetime: this.getNonNullString(params.start_datetime),
                  stop_datetime: this.getNonNullString(params.stop_datetime),
                  userQueryText: this.getNonNullString(params.userQueryText),
                  userQueryType: this.getNonNullString(params.userQueryType),
                  orQueryText: this.orQueryfield === undefined ? [] : [...this.orQueryfield],
                  andQueryText: this.andQueryfield === undefined ? [] : [...this.andQueryfield],
                  notQueryText: this.notQueryfield === undefined ? [] : [...this.notQueryfield],
                }));
              }
            }
          }
        });

    this.routeSubscription1 = this.layoutStore.select(fromRoot.selectRouteNestedParam())
        .subscribe((params) => {
          if (params.invoke !== true) {
            this.selectedMode = this.getNonNullString(params.mode);
            this.userQueryType = this.getNonNullString(params.userQueryType);
            this.userQueryText = this.getNonNullString(params.userQueryText);
            this.timeRange.start_date = this.getDateObject(params.start_datetime?.split(' ')[0]);
            this.timeRange.stop_date = this.getDateObject(params.stop_datetime?.split(' ')[0]);
            this.timeRange.start_time = this.getTimeString(params.start_datetime?.split(' ')[1]);
            this.timeRange.stop_time = this.getTimeString(params.stop_datetime?.split(' ')[1]);
            this.computerStore.dispatch(ComputerActions.setQueryType({userQueryType: this.userQueryType}));
            this.computerStore.dispatch(ComputerActions.updateQueryText({userQueryText: this.userQueryText}));
            this.computerStore.dispatch(ComputerInfoActions.updateDatetime({
              start_datetime: this.getNonNullString(params.start_datetime),
              stop_datetime: this.getNonNullString(params.stop_datetime)
            }));

            if (!['wordCloud', 'table'].includes(params.mode) && this.selectedMode !== '') {
              this.userQueryTextControl.setValue(this.getNonNullString(params.userQueryText));
              this.orQueryfield = this.queryStringToList(params.orQueryfield);
              this.andQueryfield = this.queryStringToList(params.andQueryfield);
              this.notQueryfield = this.queryStringToList(params.notQueryfield);
              this.computerStore.dispatch(ComputerActions.fetchUserData({userQueryType: this.userQueryType}));
              this.computerStore.dispatch(ComputerInfoActions.updateOrQueryText({orQueryText: this.orQueryfield}));
              this.computerStore.dispatch(ComputerInfoActions.updateAndQueryText({andQueryText: this.andQueryfield}));
              this.computerStore.dispatch(ComputerInfoActions.updateNotQueryText({notQueryText: this.notQueryfield}));
            }
          }
        });
  }

  ngAfterViewInit() {
    this.routeSubscription2 = this.layoutStore.select(fromRoot.selectRouteNestedParam())
      .subscribe((params) => {
        if (params.invoke !== true) {
          this.onSelectUserQueryType({value: params.userQueryType});
          this.userQueryTextControl.setValue(params.userQueryText);
          if (this.selectedMode !== '') {
            if (['wordCloud', 'table'].includes(params.mode)) {
              this.computerStore.dispatch(ComputerActions.fetchAllkeyword({
                userQueryText: this.userQueryText,
                userQueryType: this.userQueryType,
                start_datetime: this.getNonNullString(params.start_datetime),
                stop_datetime: this.getNonNullString(params.stop_datetime),
                backdays: -this.global.backdaysNum
              }));
            } else {
              this.computerStore.dispatch(ComputerInfoActions.fetchImageInfo({
                backdays: -this.global.backdaysNum,
                start_datetime: this.getNonNullString(params.start_datetime),
                stop_datetime: this.getNonNullString(params.stop_datetime),
                userQueryText: this.getNonNullString(params.userQueryText),
                userQueryType: this.getNonNullString(params.userQueryType),
                orQueryText: this.orQueryfield === undefined ? [] : [ ...this.orQueryfield ],
                andQueryText: this.andQueryfield === undefined ? [] : [ ...this.andQueryfield ],
                notQueryText: this.notQueryfield === undefined ? [] : [ ...this.notQueryfield ],
              }));
            }
          }
        }
      });
  }

  onInvolvePanel() {
    this.panel.toggle();
  }

  onTimeChange(data: any) {
    switch (data.type) {
      case 'start_date':
        this.timeRange.start_date = data.value;
        break;
      case 'start_time':
        this.timeRange.start_time = data.value;
        break;
      case 'stop_date':
        this.timeRange.stop_date = data.value;
        break;
      case 'stop_time':
        this.timeRange.stop_time = data.value;
        break;
    }
  }


  onModeChange(event: any) {
    this.selectedMode = event.value;
    this.computerStore.dispatch(ComputerInfoActions.setComputerInfoMode({ mode: event.value }));
    this.onQuery();
  }

  onQuery() {
    this.computerStore.dispatch(LayoutActions.setAlertType({ alertType: 'EXECUTING QUERY' }));
    if (['wordCloud', 'table'].includes(this.selectedMode)) {
      this.computerStore.dispatch(ComputerActions.fetchAllkeyword({
        userQueryText: this.userQueryText,
        userQueryType: this.userQueryType,
        start_datetime: `${this.startDatetimePickper.getDateTime().date} ${this.startDatetimePickper.getDateTime().time}`,
        stop_datetime: `${this.stopDatetimePickper.getDateTime().date} ${this.stopDatetimePickper.getDateTime().time}`,
        backdays: -this.global.backdaysNum
      }));

      if (this.isDatetimeValid() === 'EMPTY DATE' || this.isDatetimeValid() === 'ERROR DATE FORMAT') {
          this.router.navigate([`/dashboard/computerInfo/${this.selectedMode}`, {
            mode: this.selectedMode,
            userQueryText: this.userQueryText,
            userQueryType: this.userQueryType,
          }], { relativeTo: this.routes });
      } else {
          this.router.navigate([`/dashboard/computerInfo/${this.selectedMode}`, {
            mode: this.selectedMode,
            userQueryText: this.userQueryText,
            userQueryType: this.userQueryType,
            start_datetime: `${this.startDatetimePickper.getDateTime().date} ${this.startDatetimePickper.getDateTime().time}`,
            stop_datetime: `${this.stopDatetimePickper.getDateTime().date} ${this.stopDatetimePickper.getDateTime().time}`
          }], { relativeTo: this.routes });
      }
  } else {
    this.invokeRouteParam();
    if (this.isDatetimeValid() === 'EMPTY DATE' || this.isDatetimeValid() === 'ERROR DATE FORMAT') {
      this.router.navigate([`/dashboard/computerInfo/${this.selectedMode}`, {
        mode: this.selectedMode,
        userQueryText: this.userQueryText,
        userQueryType: this.userQueryType,
        orQueryfield: this.orQueryfield,
        andQueryfield: this.andQueryfield,
        notQueryfield: this.notQueryfield,
        start_datetime: '',
        stop_datetime: '',
      }], { relativeTo: this.routes });
    } else {
      this.router.navigate([`/dashboard/computerInfo/${this.selectedMode}`, {
        mode: this.selectedMode,
        userQueryText: this.userQueryText,
        userQueryType: this.userQueryType,
        orQueryfield: this.orQueryfield,
        andQueryfield: this.andQueryfield,
        notQueryfield: this.notQueryfield,
        start_datetime: `${this.startDatetimePickper.getDateTime().date} ${this.startDatetimePickper.getDateTime().time}`,
        stop_datetime: `${this.stopDatetimePickper.getDateTime().date} ${this.stopDatetimePickper.getDateTime().time}`,
      }], { relativeTo: this.routes });
    }
  }
}

  invokeRouteParam() { // 讓網址產生變動，解決相同條件下，搜尋不會觸發事件的問題
    this.router.navigate([`/dashboard/computerInfo/${this.selectedMode}`, {
      invoke: true
    }], { relativeTo: this.routes });
  }

  isDatetimeValid() {
    if (this.startDatetimePickper.getDateTime().date === ''
          && this.startDatetimePickper.getDateTime().time === 'undefined:00'
          && this.stopDatetimePickper.getDateTime().date === ''
          && this.stopDatetimePickper.getDateTime().time === 'undefined:00') {
      this.computerStore.dispatch(LayoutActions.setAlertType({ alertType: 'EMPTY DATE' }));
      return 'EMPTY DATE';
    } else if ( ! (/\d{4}\/\d{2}\/\d{2}/.test(this.startDatetimePickper.getDateTime().date)
                  && /\d{2}:\d{2}:\d{2}/.test(this.startDatetimePickper.getDateTime().time)
                  && /\d{4}\/\d{2}\/\d{2}/.test(this.stopDatetimePickper.getDateTime().date)
                  && /\d{2}:\d{2}:\d{2}/.test(this.stopDatetimePickper.getDateTime().time))) {
      this.computerStore.dispatch(LayoutActions.setAlertType({ alertType: 'ERROR DATE FORMAT' }));
      return 'ERROR DATE FORMAT';
    } else {
      return 'NORMAL';
    }
  }

  ngOnDestroy() {
    this.routeSubscription1.unsubscribe();
    this.routeSubscription2.unsubscribe();
    this.userQueryTextSubscription.unsubscribe();
    this.userQueryTypeSubscription.unsubscribe();
    this.orQueryfieldSubscription.unsubscribe();
    this.andQueryfieldSubscription.unsubscribe();
    this.notQueryfieldSubscription.unsubscribe();
    this.userQueryTextControlSubscription.unsubscribe();
  }

  // 以下為更新Queryfield對應的function
  onSelectUserQueryType(event: any) {
    this.userQueryType = event.value;
    this.userQueryTextControl.setValue('');
    this.computerStore.dispatch(ComputerActions.setQueryType({userQueryType: this.userQueryType}));
    this.computerStore.dispatch(ComputerActions.fetchUserData({userQueryType: this.userQueryType}));
  }

  onTypeUserQueryText(value: any) {
    this.userQueryText = value;
    this.computerStore.dispatch(ComputerActions.updateQueryText({userQueryText: this.userQueryText}));
  }

  onAddKeywordQueryText(event: MatChipInputEvent, type: string): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      switch (type) {
        case ('OR'):
          this.orQueryfield.push(value.trim());
          break;
        case ('AND'):
          this.andQueryfield.push(value.trim());
          break;
        case ('NOT'):
          this.notQueryfield.push(value.trim());
          break;
      }
      input.value = '';
    }
  }

  onRemoveKeywordQueryText(querytext: string, type: string): void {
    let index = 0;
    switch (type) {
      case ('OR'):
        index = this.orQueryfield.indexOf(querytext);
        if (index >= 0) {
          this.orQueryfield.splice(index, 1);
        }
        break;
      case ('AND'):
        index = this.andQueryfield.indexOf(querytext);
        if (index >= 0) {
          this.andQueryfield.splice(index, 1);
        }
        break;
      case ('NOT'):
        index = this.notQueryfield.indexOf(querytext);
        if (index >= 0) {
          this.notQueryfield.splice(index, 1);
        }
        break;
    }
  }

  // 以下為修正格式用的function
  getNonNullString(text: any) {
    return text === null || text === undefined ? '' : text;
  }

  getDateObject(text: any) {
    if (text === null || text === undefined) {
      return '';
    } else {
      const dateInfo = text.split('/');
      return new Date(dateInfo[0], dateInfo[1] - 1, dateInfo[2]);
    }
  }

  getTimeString(text: any) {
    return text === null || text === undefined ? '' : text.slice(0, 5);
  }

  queryStringToList(text: string | null | undefined) {
    if (text === '' || text === null || text === undefined) {
      return [];
    } else if (text.includes(',')) {
      return text.split(',');
    } else {
      return [ text ];
    }
  }

}
