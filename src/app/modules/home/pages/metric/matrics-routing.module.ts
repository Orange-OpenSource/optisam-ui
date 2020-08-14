// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetricViewComponent } from './metric-view/metric-view.component';
import { MetricCreationComponent } from './metric-creation/metric-creation.component';
import { MetricDetailsComponent } from './metric-details/metric-details.component';

const routes: Routes = [
  { path: '', component: MetricViewComponent },
  { path: 'newmetric', component: MetricCreationComponent },
  { path: 'viewMetric', component: MetricDetailsComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatricsRoutingModule { }
