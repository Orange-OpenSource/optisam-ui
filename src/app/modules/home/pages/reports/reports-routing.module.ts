// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListReportsComponent } from './list-reports/list-reports.component';
import { CreateReportComponent } from './create-report/create-report.component';

// const routes: Routes = [];
const routes: Routes = [
  {
    path: '', component: ListReportsComponent
  },
  {
    path: 'create', component : CreateReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
