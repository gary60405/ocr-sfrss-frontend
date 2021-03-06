import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LayoutActions } from '../../core/actions';
import { ComputerActions, ComputerInfoActions } from '../actions';
import { ComputersService } from '../services/computer.service';
import { map, switchMap } from 'rxjs/operators';
import { QueryImageInfo } from '../models';
import { CloudData } from 'angular-tag-cloud-module';


@Injectable()
export class ComputersEffects {

  fetchAllkeyword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComputerActions.fetchAllkeyword),
      switchMap((action) =>
        this.computersService.fetchAllkeyword(
          action.userQueryText,
          action.userQueryType,
          action.start_datetime,
          action.stop_datetime,
          action.backdays
        )
        .pipe(
          map((jsonData: any) => jsonData.data),
          switchMap((allKeywords: CloudData[]) => [
            ComputerActions.fetchAllkeywordSuccess({ allKeywords }),
            LayoutActions.setAlertType({ alertType: 'NORMAL' })
          ])
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
          switchMap((queryImageInfo: QueryImageInfo) => [
            ComputerInfoActions.fetchImageInfoSuccess({ queryImageInfo }),
            LayoutActions.setAlertType({ alertType: 'NORMAL' })
          ]),
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
                case '????????????':
                  return ComputerActions.updateIdList({ idList: data });
                case 'ASEID':
                  return ComputerActions.updateASEIDList({ aseList: data });
                case '????????????':
                  return ComputerActions.updateNameList({ nameList: data });
                case '????????????':
                  return ComputerActions.updateComputerIdList({ computerIdList: data });
                case '????????????':
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
