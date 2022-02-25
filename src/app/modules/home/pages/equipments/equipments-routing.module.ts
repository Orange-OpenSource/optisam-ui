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
