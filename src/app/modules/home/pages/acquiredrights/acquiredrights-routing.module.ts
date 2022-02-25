import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AcquiredrightsComponent } from './acquiredrights.component';
import { ProductrightsComponent } from './productrights/productrights.component';
import { AcquiredRightsAggregationComponent } from './acquired-rights-aggregation/acquired-rights-aggregation.component';
import { AcquiredRightsTabComponent } from './acquired-rights-tab/acquired-rights-tab.component';
import { ListAcquiredRightsComponent } from './list-acquired-rights/list-acquired-rights.component';

const routes: Routes = [
  {
    path: '', component: AcquiredrightsComponent,
    children: [
      { path: 'prights', component: AcquiredRightsTabComponent, 
        children: [
                    { path: '', component: ProductrightsComponent },
                    { path: 'aggregations', component: AcquiredRightsAggregationComponent }
                  ] 
      },
      {
        path: 'list-acquired-rights', component: ListAcquiredRightsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcquiredrightsRoutingModule { }
