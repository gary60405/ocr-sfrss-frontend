import { createReducer, on } from '@ngrx/store';
import { CloudData } from 'angular-tag-cloud-module';

import { ComputerActions } from 'src/app/dashboard/actions';
import { Computer, UserData } from '../models';

export const computersFeatureKey = 'computers';

export interface State {
  allKeywords: CloudData[];
  userQueryText: string;
  userQueryType: string;
  userData: UserData;
}

const initialState: State = {
  allKeywords: [],
  userQueryText: '',
  userQueryType: '電腦名稱',
  userData: {
    id: [],
    name: [],
    ase_id: [],
    department_id: [],
    computer_id: []
  }
};

export const reducer = createReducer(
  initialState,
  on(ComputerActions.updateQueryText, (state, { userQueryText }) => ({
    ...state,
    userQueryText, // ES6用法：等同於 userQueryText: userQueryText
  })),
  on(ComputerActions.fetchAllkeywordSuccess, (state, { allKeywords }) => ({
    ...state,
    allKeywords
  })),
  on(ComputerActions.setQueryType, (state, { userQueryType }) => ({
    ...state,
    userQueryType
  })),
  on(ComputerActions.updateIdList, (state, { idList }) => ({
    ...state,
    userData: {
      ...state.userData,
      id: [
        ...idList
      ]
    }
  })),
  on(ComputerActions.updateComputerIdList, (state, { computerIdList }) => ({
    ...state,
    userData: {
      ...state.userData,
      computer_id: [
        ...computerIdList
      ]
    }
  })),
  on(ComputerActions.updateASEIDList, (state, { aseList }) => ({
    ...state,
    userData: {
      ...state.userData,
      ase_id: [
        ...aseList
      ]
    }
  })),
  on(ComputerActions.updateNameList, (state, { nameList }) => ({
    ...state,
    userData: {
      ...state.userData,
      name: [
        ...nameList
      ]
    }
  })),
  on(ComputerActions.updateDepartmentIdList, (state, { departmentIdList }) => ({
    ...state,
    userData: {
      ...state.userData,
      department_id: [
        ...departmentIdList
      ]
    }
  })),
  on(ComputerActions.initialComputers, (state) => ({
    ...initialState
  }))
);

export const selectAllKeywords = (state: State): CloudData[] => state.allKeywords;
export const selectQueryText = (state: State): string => state.userQueryText;
export const selectQueryType = (state: State): string => state.userQueryType;
export const selectFilterOption = (state: State): string[] => {
  switch (state.userQueryType) {
    case '員工姓名':
      return state.userQueryText === ''
        ? state.userData.name
        : state.userData.name.filter(x => String(x).includes(state.userQueryText));
    case '員工編號':
      return state.userQueryText === ''
        ? state.userData.id
        : state.userData.id.filter(x => String(x).includes(state.userQueryText));
    case '電腦名稱':
      return state.userQueryText === ''
        ? state.userData.computer_id
        : state.userData.computer_id.filter(x => String(x).includes(state.userQueryText));
    case '部門代碼':
      return state.userQueryText === ''
        ? state.userData.department_id
        : state.userData.department_id.filter(x => String(x).includes(state.userQueryText));
    case 'ASEID':
      return state.userQueryText === ''
        ? state.userData.ase_id
        : state.userData.ase_id.filter(x => String(x).includes(state.userQueryText));
    default:
      return state.userQueryText === ''
        ? state.userData.name
        : state.userData.name.filter(x => String(x).includes(state.userQueryText));
  }
};
