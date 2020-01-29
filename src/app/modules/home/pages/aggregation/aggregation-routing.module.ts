// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateAggregationComponent } from './create-aggregation/create-aggregation.component';
import { ListAggregationComponent } from './list-aggregation/list-aggregation.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { Role } from 'src/app/utils/roles.config';

const routes: Routes = [
  {
    path: 'create-aggregation', component: CreateAggregationComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.SuperAdmin, Role.Admin] }
  },
  { path: 'list-aggregation', component: ListAggregationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AggregationRoutingModule { }
