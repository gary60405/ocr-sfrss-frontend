import { createReducer, on } from '@ngrx/store';
import { CloudData } from 'angular-tag-cloud-module';

import { ComputerInfoActions } from 'src/app/dashboard/actions';
import { QueryTimeInfo, ImageInfo, DatetimeRange } from '../models';

export const computerInfoFeatureKey = 'computerInfo';

export interface State {
  mode: string;
  start_datetime: string;
  stop_datetime: string;
  orQueryText: string[];
  andQueryText: string[];
  notQueryText: string[];
  imageInfo: ImageInfo[];
}

const initialState: State = {
  mode: '',
  start_datetime: '',
  stop_datetime: '',
  orQueryText: [],
  andQueryText: [],
  notQueryText: [],
  imageInfo: [],
};

export const reducer = createReducer(
  initialState,
  on(ComputerInfoActions.updateDatetime, (state, { start_datetime, stop_datetime }) => ({
    ...state,
    start_datetime,
    stop_datetime
  })),
  on(ComputerInfoActions.fetchImageInfoSuccess, (state, { queryImageInfo }) => ({
    ...state,
    start_datetime: queryImageInfo.start_datetime,
    stop_datetime: queryImageInfo.stop_datetime,
    imageInfo: [
      ...queryImageInfo.imageInfo,
    ]
  })),
  on(ComputerInfoActions.setComputerInfoMode, (state, { mode }) => ({
    ...state,
    mode
  })),
  on(ComputerInfoActions.updateOrQueryText, (state, { orQueryText }) => ({
    ...state,
    orQueryText: [
      ...orQueryText
    ]
  })),
  on(ComputerInfoActions.updateAndQueryText, (state, { andQueryText }) => ({
    ...state,
    andQueryText: [
      ...andQueryText
    ]
  })),
  on(ComputerInfoActions.updateNotQueryText, (state, { notQueryText }) => ({
    ...state,
    notQueryText: [
      ...notQueryText
    ]
  })),
  on(ComputerInfoActions.initialComputerInfo, (state) => ({
    ...initialState,
  })),
);

export const selectMode = (state: State): string => state.mode;
export const selectAndQueryText = (state: State): string[] => state.andQueryText;
export const selectOrQueryText = (state: State): string[] => state.orQueryText;
export const selectNotQueryText = (state: State): string[] => state.notQueryText;
export const selectDatetimeRange = (state: State): DatetimeRange => {
  return {start_datetime: state.start_datetime, stop_datetime: state.stop_datetime};
};

export const selectCadidateKeyword = (state: State): string[] => [...new Set([...state.andQueryText, ...state.orQueryText])];
export const selectImageInfo = (state: State): ImageInfo[] => state.imageInfo.map((image: ImageInfo) => {
  let rawtext = image.rawtext.replaceAll('>', '&gt;').replaceAll('<', '&lt;'); // 轉跳脫字元，否則轉DOM會出事
  const cadidateKeyword = [...new Set([...state.andQueryText, ...state.orQueryText])];
  cadidateKeyword.forEach((text: string) => {
    rawtext = rawtext.replaceAll(text, `<span class="text-info">${text}</span>`);
  });
  return {
    ...image,
    rawtext
  };
});
export const selectTimeRange = (state: State): QueryTimeInfo => {
  return {
    start_date: state.start_datetime.split(' ')[0],
    start_time: state.start_datetime !== '' ? String(state.start_datetime.split(' ')[1]).split(':').slice(0, 2).join(':') : '',
    stop_date: state.stop_datetime.split(' ')[0],
    stop_time: state.stop_datetime !== '' ? String(state.stop_datetime.split(' ')[1]).split(':').slice(0, 2).join(':') : '',
  };
};
