import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DashboardRoutingModule } from 'src/app/dashboard/dashboard-routing.module';

import { TagCloudModule } from 'angular-tag-cloud-module';
import { MaterialModule } from 'src/app/core/material';
import {
  ImageCardComponent,
  KeywordTableComponent,
  TimeSelectComponent
} from './components';
import {
  DashboardComponent,
  ComputerInfoComponent,
  WordCloudComponent,
  AllImageSearchComponent,
  TableComponent,
} from './containers';

import * as fromDashboard from './reducers';
import { ComputersEffects } from './effects';
import { ReactiveFormsModule } from '@angular/forms';
import { TextCardComponent } from './components/text-card.component';
import { UserTableComponent } from './components/user-table.component';
import { SafeHtmlPipe } from '../core/safe-html.pipe';

export const COMPONENTS = [
  KeywordTableComponent,
  ImageCardComponent,
  TextCardComponent,
  UserTableComponent,
  TimeSelectComponent,
  SafeHtmlPipe,
];

export const CONTAINERS = [
  DashboardComponent,
  WordCloudComponent,
  ComputerInfoComponent,
  AllImageSearchComponent,
  TableComponent,
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    TagCloudModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    /**
     * StoreModule.forFeature is used for composing state
     * from feature modules. These modules can be loaded
     * eagerly or lazily and will be dynamically added to
     * the existing state.
     */
    StoreModule.forFeature(fromDashboard.dashboardFeatureKey, fromDashboard.reducers),

    /**
     * Effects.forFeature is used to register effects
     * from feature modules. Effects can be loaded
     * eagerly or lazily and will be started immediately.
     *
     * All Effects will only be instantiated once regardless of
     * whether they are registered once or multiple times.
     */
    EffectsModule.forFeature([ComputersEffects]),
  ],
  declarations: [COMPONENTS, CONTAINERS]
})
export class DashboardModule {}
