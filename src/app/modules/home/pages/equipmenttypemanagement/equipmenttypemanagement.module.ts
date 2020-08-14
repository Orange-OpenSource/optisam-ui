// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'src/app/material.module';
import { EquipmentTypeManagementService } from '../../../../core/services/equipmenttypemanagement.service';
import { EquipmenttypemanagementComponent } from './equipmenttypemanagement.component';
import { EquipmentTypeManagementRoutingModule } from './equipmenttypemanagement-routing.module';
import { AddComponent } from './dialogs/add/add.component';
import { DeleteComponent } from './dialogs/delete/delete.component';
import { EditComponent } from './dialogs/edit/edit.component';
import { ListComponent } from './dialogs/list/list.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    EquipmentTypeManagementRoutingModule,
    SharedModule
  ],
  entryComponents: [
    AddComponent,
    EditComponent,
    DeleteComponent,
    ListComponent
  ],
  providers: [
    EquipmentTypeManagementService
  ],
  declarations: [EquipmenttypemanagementComponent, AddComponent, DeleteComponent, EditComponent, ListComponent],
})
export class EquipmenttypemanagementModule { }
