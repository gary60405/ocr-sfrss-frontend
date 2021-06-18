import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CloudData } from 'angular-tag-cloud-module';
import * as fromDashboard from '../reducers';

@Component({
  selector: 'app-table',
  template:
  `
    <div class="row justify-content-center mt-3">
      <div class="col-6">
        <app-keyword-table [data]="data$"></app-keyword-table>
      </div>
    </div>
  `,
  styles: [],
})

export class TableComponent implements OnInit {
  data$: Observable<CloudData[]>;

  constructor(private computerStore: Store<fromDashboard.State>) {
    this.data$ = computerStore.select(fromDashboard.selectAllKeywords);
  }
  ngOnInit() {
  }
}
