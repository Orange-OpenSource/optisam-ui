// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListScopesComponent } from './list-scopes/list-scopes.component';
import { CreateScopeComponent } from './create-scope/create-scope.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { Role } from 'src/app/utils/roles.config';

const routes: Routes = [
  {
    path: '', 
    component: ListScopesComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.SuperAdmin.valueOf()] }
  },
  { 
    path: 'create', 
    component: CreateScopeComponent, 
    canActivate: [AuthGuard],
    data: { roles: [Role.SuperAdmin.valueOf()] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScopeManagementRoutingModule { }
