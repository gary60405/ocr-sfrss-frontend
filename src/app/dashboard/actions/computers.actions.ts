import { createAction, props } from '@ngrx/store';
import { CloudData } from 'angular-tag-cloud-module';
import { Computer } from '../models';

export const initialComputers = createAction('[Computer] Initial Computers');
export const fetchAllkeyword = createAction('[Computer] Fetch All Keywords',
  props<{ userQueryText: string, userQueryType: string, start_datetime: string, stop_datetime: string, backdays: number }>()
);
export const fetchAllkeywordSuccess = createAction(
  '[Computer] Fetch All Keywords Success',
  props<{ allKeywords: CloudData[] }>()
);

export const setQueryType = createAction(
  '[Computer] Set Query Type',
  props<{ userQueryType: string }>()
);

export const updateQueryText = createAction(
  '[Computer] Update Query Text',
  props<{ userQueryText: string }>()
);
export const fetchUserData = createAction(
  '[Computer] Fetch User Data',
  props<{ userQueryType: string }>()
);
export const updateIdList = createAction(
  '[Computer] Update Id List',
  props<{ idList: string[] }>()
);
export const updateNameList = createAction(
  '[Computer] Update Name List',
  props<{ nameList: string[] }>()
);
export const updateASEIDList = createAction(
  '[Computer] Update ASEID List',
  props<{ aseList: string[] }>()
);
export const updateDepartmentIdList = createAction(
  '[Computer] Update Department Id List',
  props<{ departmentIdList: string[] }>()
);
export const updateComputerIdList = createAction(
  '[Computer] Update Computer Id List',
  props<{ computerIdList: string[] }>()
);



