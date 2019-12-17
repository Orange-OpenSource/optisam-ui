import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EquipmenttypemanagementComponent } from './equipmenttypemanagement.component';

const routes: Routes = [
  { path: '', component: EquipmenttypemanagementComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipmentTypeManagementRoutingModule { }
