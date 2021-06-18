import { createAction, props } from '@ngrx/store';
import { QueryImageInfo, SelectedComputer } from '../models';

export const initialComputerInfo = createAction('[Computer Info] Initial Computer Info');

export const setComputerInfoMode = createAction(
  '[Computer Info] Set Computer Info Mode',
  props<{ mode: string }>()
  );

export const updateOrQueryText = createAction(
  '[Computer Info] Update OrQueryText',
  props<{ orQueryText: string[] }>()
  );
export const updateAndQueryText = createAction(
  '[Computer Info] Update AndQueryText',
  props<{ andQueryText: string[] }>()
  );
export const updateNotQueryText = createAction(
  '[Computer Info] Update NotQueryText',
  props<{ notQueryText: string[] }>()
  );

export const updateDatetime = createAction(
  '[Computer Info] Update Datetime',
  props<{ start_datetime: string, stop_datetime: string }>()
  );

export const fetchImageInfo = createAction(
  '[Computer Info] Fetch Image Info',
  props<{
    backdays: number,
    start_datetime: string,
    stop_datetime: string,
    userQueryText: string,
    userQueryType: string,
    orQueryText: string[],
    andQueryText: string[],
    notQueryText: string[]}>()
  );

export const fetchImageInfoSuccess = createAction(
  '[Computer Info] Fetch Image Info Success',
  props<{ queryImageInfo: QueryImageInfo }>()
  );

