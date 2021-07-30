import { createReducer, on } from '@ngrx/store';

import { LayoutActions } from 'src/app/core/actions';
import { AlertContent } from 'src/app/dashboard/models';

export const layoutFeatureKey = 'layout';

export interface State {
  showProgress: boolean;
  alertType: string;
}

const initialState: State = {
  showProgress: false,
  alertType: 'NORMAL'
};

export const reducer = createReducer(
  initialState,
  on(LayoutActions.closeProgressBar, (state) => ({
    ...state,
    showProgress: false
  })),
  on(LayoutActions.openProgressBar, (state) => ({
    ...state,
    showProgress: true
  })),
  on(LayoutActions.setAlertType, (state, { alertType }) => ({
    ...state,
    alertType
  })),
);

export const selectLoaded = (state: State): boolean => state.showProgress;
export const selectAlertInfo = (state: State): AlertContent => {
    switch (state.alertType) {
      case 'NORMAL':
        return {
          display: false,
          colorClass: '',
          content: ''
        };
      case 'QUERY NOT IN THE RANGE':
        return {
          display: true,
          colorClass: 'alert-danger',
          content: '條件範圍內查無資料！'
        };
      case 'EMPTY DATE':
        return {
          display: true,
          colorClass: 'alert-warning',
          content: '未填日期，故顯示最近@N日的統計資料'
        };
      case 'ERROR DATE FORMAT':
        return {
          display: true,
          colorClass: 'alert-warning',
          content: '日期格式錯誤，故顯示最近@N日的統計資料'
        };
      case 'EXECUTING QUERY':
        return {
          display: true,
          colorClass: 'alert-info',
          content: '資料查詢中...'
        };
      default:
        return {
          display: false,
          colorClass: '',
          content: ''
        };
    }
};
