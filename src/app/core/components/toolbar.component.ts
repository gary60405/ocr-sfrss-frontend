import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromRoot from 'src/app/reducers';
import * as fromDashboard from './../../dashboard/reducers';

@Component({
  selector: 'app-toolbar',
  template: `
    <mat-toolbar  color="primary">
      <mat-toolbar-row>
        <button mat-icon-button class="ms-1" >
          <img src="assets/og.png" width="40" height="39.7" class="d-inline-block align-top" alt="">
        </button>
        <span class="ml-2">日月光即時監控儀表板</span>
      </mat-toolbar-row>
  </mat-toolbar>
  <mat-progress-bar *ngIf="checkNonNull(loaded$ | async)" color="accent" mode="indeterminate"></mat-progress-bar>
  `,
  styles: [
    `
    :host ::ng-deep .mat-progress-bar-fill::after {
      background-color: #20c997 !important;
    }
    `
  ]
})
export class ToolbarComponent {
  loaded$: Observable<boolean>;

  constructor(private computerStore: Store<fromDashboard.State>,){
    this.loaded$ = computerStore.select(fromRoot.selectLoaded);
  }

  checkNonNull(value: any) {
    return value !== null || undefined ? value : false;
  }
}
