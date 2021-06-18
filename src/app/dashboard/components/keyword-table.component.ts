import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CloudData } from 'angular-tag-cloud-module';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-keyword-table',
  template: `
    <table mat-table [dataSource]="dataSource" matSort class="w-100 mat-elevation-z8">
      <ng-container matColumnDef="ner">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> NER </th>
        <td mat-cell *matCellDef="let element"> {{element.tooltip}} </td>
      </ng-container>

      <ng-container matColumnDef="text">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> 關鍵詞 </th>
        <td mat-cell *matCellDef="let element"> {{element.text}} </td>
      </ng-container>

      <ng-container matColumnDef="weight">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> 出現次數 </th>
        <td mat-cell *matCellDef="let element"> {{element.weight}} </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    <mat-paginator [pageSizeOptions]="[10, 15, 20]" showFirstLastButtons></mat-paginator>
  `,
  styles: [
    ``
  ],
})
export class KeywordTableComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() data!: Observable<CloudData[]>;
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['ner', 'text', 'weight'];
  dataSubscription: any;

  constructor() {
  }

  ngAfterViewInit() {
    this.dataSubscription = this.data.subscribe((data: CloudData[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
    this.dataSource.disconnect();
  }

}
