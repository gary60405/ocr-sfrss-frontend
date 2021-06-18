import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  DashboardComponent,
  ComputerInfoComponent,
  WordCloudComponent,
  AllImageSearchComponent,
  AllTextSearchComponent,
  BubbleComponent,
  TableComponent,
} from './containers';


export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'computerInfo', pathMatch: 'full' },
      {
        path: 'computerInfo',
        component: ComputerInfoComponent,
        children: [
          { path: '', redirectTo: 'wordCloud', pathMatch: 'full' },
          {
            path: 'wordCloud',
            component: WordCloudComponent,
          },
          {
            path: 'table',
            component: TableComponent,
          },
          {
            path: 'bubble',
            component: BubbleComponent,
          },
          {
            path: 'allTextSearch',
            component: AllTextSearchComponent,
          },
          {
            path: 'allImageSearch',
            component: AllImageSearchComponent,
          },
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
