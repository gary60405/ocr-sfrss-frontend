import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { KeywordUser } from '../models';

@Component({
  selector: 'app-user-table',
  template: `
    <table mat-table [dataSource]="dataSource" matSort class="bg-secondary mat-elevation-z8 w-100" >
      <ng-container matColumnDef="computer_id">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> 電腦代號 </th>
        <td mat-cell *matCellDef="let element"> {{element.computer_id}} </td>
      </ng-container>
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> 員工編號 </th>
        <td mat-cell *matCellDef="let element"> {{element.id}} </td>
      </ng-container>
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> 員工姓名 </th>
        <td mat-cell *matCellDef="let element"> {{element.name}} </td>
      </ng-container>
      <ng-container matColumnDef="ase_id">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> ASEKHID </th>
        <td mat-cell *matCellDef="let element">{{element.ase_id}} </td>
      </ng-container>
      <ng-container matColumnDef="department_id">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> 部門代號 </th>
        <td mat-cell *matCellDef="let element">{{element.department_id}} </td>
      </ng-container>
      <ng-container matColumnDef="datetime">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> 截圖時間 </th>
        <td mat-cell *matCellDef="let element">{{element.datetime}} </td>
      </ng-container>
      <ng-container matColumnDef="image">
        <th mat-header-cell *matHeaderCellDef > 觀看原圖 </th>
        <td mat-cell *matCellDef="let element">
          <button mat-raised-button (click)="onClickImage(element.address)" color="primary">觀看</button>
        </td>
      </ng-container>
      <ng-container matColumnDef="detail">
        <th mat-header-cell *matHeaderCellDef > 查看細節 </th>
        <td mat-cell *matCellDef="let element">
          <button [mat-dialog-close] mat-raised-button (click)="onClickDetail(element.computer_id)" color="primary">前往</button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    <mat-paginator class="bg-secondary" [pageSizeOptions]="[10, 15, 20]" showFirstLastButtons></mat-paginator>
  `,
  styles: [
    `:host ::ng-deep .mat-sort-header-container {
        border-bottom-color: transparent !important;
    }`
  ],
})
export class UserTableComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() data: KeywordUser[];
  @Output() clickImage = new EventEmitter();
  @Output() clickDetail = new EventEmitter();

  dataSource: MatTableDataSource<any>;
  displayedColumns = ['computer_id', 'id', 'name',  'ase_id', 'department_id', 'datetime', 'image', 'detail'];

  constructor() {
    this.data = [];
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onClickImage(address: string) {
    this.clickImage.emit(address);
  }

  onClickDetail(computerId: string) {
    this.clickDetail.emit(computerId);
  }

  ngOnDestroy() {
    this.dataSource.disconnect();
  }

}
