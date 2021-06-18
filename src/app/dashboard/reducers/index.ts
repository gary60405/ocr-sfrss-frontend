import {
  createSelector,
  createFeatureSelector,
  combineReducers,
  Action,
} from '@ngrx/store';
import * as fromComputers from './computers.reducer';
import * as fromComputerinfo from './computerinfo.reducer';
import * as fromRoot from './../../reducers';

export const dashboardFeatureKey = 'dashboard';

export interface DashboardState {
  [fromComputers.computersFeatureKey]: fromComputers.State;
  [fromComputerinfo.computerInfoFeatureKey]: fromComputerinfo.State;
}

export interface State extends fromRoot.State {
  [dashboardFeatureKey]: DashboardState;
}


/** Provide reducer in AoT-compilation happy way */
export function reducers(state: DashboardState | undefined, action: Action) {
  return combineReducers({
    [fromComputers.computersFeatureKey]: fromComputers.reducer,
    [fromComputerinfo.computerInfoFeatureKey]: fromComputerinfo.reducer,
  })(state, action);
}

export const selectDashboardState = createFeatureSelector<State, DashboardState>(
  dashboardFeatureKey
);

// Part of all computer
export const selectComputerEntitiesState = createSelector(
  selectDashboardState,
  (state) => state.computers
);

export const selectAllKeywords = createSelector(
  selectComputerEntitiesState,
  fromComputers.selectAllKeywords
);
export const selectFilterOption = createSelector(
  selectComputerEntitiesState,
  fromComputers.selectFilterOption
);
export const selectQueryText = createSelector(
  selectComputerEntitiesState,
  fromComputers.selectQueryText
);
export const selectQueryType = createSelector(
  selectComputerEntitiesState,
  fromComputers.selectQueryType
);

// Part of computer info
export const selectComputerInfoEntitiesState = createSelector(
  selectDashboardState,
  (state) => state.computerInfo
);

export const selectMode = createSelector(
    selectComputerInfoEntitiesState,
    fromComputerinfo.selectMode
);
export const selectTimeRange = createSelector(
  selectComputerInfoEntitiesState,
  fromComputerinfo.selectTimeRange
);
export const selectCadidateKeyword = createSelector(
  selectComputerInfoEntitiesState,
  fromComputerinfo.selectCadidateKeyword
);
export const selectImageInfo = createSelector(
  selectComputerInfoEntitiesState,
  fromComputerinfo.selectImageInfo
);
export const selectDatetimeRange = createSelector(
  selectComputerInfoEntitiesState,
  fromComputerinfo.selectDatetimeRange
);
export const selectAndQueryText = createSelector(
  selectComputerInfoEntitiesState,
  fromComputerinfo.selectAndQueryText
);
export const selectOrQueryText = createSelector(
  selectComputerInfoEntitiesState,
  fromComputerinfo.selectOrQueryText
);
export const selectNotQueryText = createSelector(
  selectComputerInfoEntitiesState,
  fromComputerinfo.selectNotQueryText
);
