// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentsComponent } from './equipments.component';
import { Routes, RouterModule } from '@angular/router';
import { EquipmentsListComponent } from './equipments-list/equipments-list.component';

const routes: Routes = [
  {
    path: '', component: EquipmentsComponent
  },
  { path: 'equipmentsList', component: EquipmentsListComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipmentsRoutingModule { }
