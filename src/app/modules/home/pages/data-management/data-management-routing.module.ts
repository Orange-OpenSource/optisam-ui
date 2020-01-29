// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataManagementComponent } from './data-management.component';
import { UploadDataComponent } from './upload-data/upload-data.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { Role } from 'src/app/utils/roles.config';

const routes: Routes = [
  {
    path: '', component: DataManagementComponent,
    children: [
                { path: 'upload-data', component: UploadDataComponent, canActivate: [AuthGuard],
                data: { roles: [Role.SuperAdmin, Role.Admin] } }
              ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataManagementRoutingModule { }
