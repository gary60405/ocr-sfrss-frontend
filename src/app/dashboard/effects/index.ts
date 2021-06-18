import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ComputerActions, ComputerInfoActions } from '../actions';
import { ComputersService } from '../services/computer.service';
import { map, switchMap } from 'rxjs/operators';
import { Computer, QueryImageInfo, SelectedComputer } from '../models';
import { CloudData } from 'angular-tag-cloud-module';

@Injectable()
export class ComputersEffects {

  fetchAllkeyword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComputerActions.fetchAllkeyword),
      switchMap((action) =>
        this.computersService.fetchAllkeyword(
          action.start_datetime,
          action.stop_datetime,
          action.backdays
        )
          .pipe(
            map((jsonData: any) => jsonData.data),
            map((allKeywords: CloudData[]) => ComputerActions.fetchAllkeywordSuccess({ allKeywords }))
        )
      )
    )
  );

  fetchImageInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComputerInfoActions.fetchImageInfo),
      switchMap((action) =>
        this.computersService.fetchImageInfoData(
          action.backdays,
          action.start_datetime,
          action.stop_datetime,
          action.userQueryText,
          action.userQueryType,
          action.orQueryText,
          action.andQueryText,
          action.notQueryText,
        )
        .pipe(
          map((jsonData: any) => jsonData.data),
          map((queryImageInfo: QueryImageInfo) => ComputerInfoActions.fetchImageInfoSuccess({ queryImageInfo }))
        )
      )
    )
  );

  fetchUserData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComputerActions.fetchUserData),
      switchMap((action) =>
        this.computersService.fetchUserdata(
          action.userQueryType
        )
          .pipe(
            map((data: string[]) => {
              switch (action.userQueryType) {
                case '員工編號':
                  return ComputerActions.updateIdList({ idList: data });
                case 'ASEID':
                  return ComputerActions.updateASEIDList({ aseList: data });
                case '員工姓名':
                  return ComputerActions.updateNameList({ nameList: data });
                case '電腦名稱':
                  return ComputerActions.updateComputerIdList({ computerIdList: data });
                case '部門代碼':
                    return ComputerActions.updateDepartmentIdList({ departmentIdList: data });
                default:
                  return ComputerActions.updateNameList({ nameList: data });
              }

            })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private computersService: ComputersService
  ) {}
}
