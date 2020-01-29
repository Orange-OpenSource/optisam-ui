// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AcquiredrightsComponent } from './acquiredrights.component';
import { ProductrightsComponent } from './productrights/productrights.component';
import { AcquiredRightsAggregationComponent } from './acquired-rights-aggregation/acquired-rights-aggregation.component';
import { AcquiredRightsTabComponent } from './acquired-rights-tab/acquired-rights-tab.component';

const routes: Routes = [
  {
    path: '', component: AcquiredrightsComponent,
    children: [
      { path: 'prights', component: AcquiredRightsTabComponent, children: [
        { path: '', component: ProductrightsComponent },
        { path: 'aggregaions', component: AcquiredRightsAggregationComponent },
      ] },
      // { path: 'prights', component: ProductrightsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcquiredrightsRoutingModule { }
