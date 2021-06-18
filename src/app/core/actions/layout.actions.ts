import { createAction, props } from '@ngrx/store';

export const openProgressBar = createAction('[Layout] Open Progress Bar');
export const closeProgressBar = createAction('[Layout] Close Progress Bar');
export const setAlertType = createAction('[Layout] Set Alert Type',
  props<{ alertType: string }>()
);
