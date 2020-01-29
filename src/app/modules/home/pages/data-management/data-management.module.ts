// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMaterialModule } from 'src/app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { DataManagementRoutingModule } from './data-management-routing.module';
import { DataManagementComponent } from './data-management.component';
import { UploadDataComponent } from './upload-data/upload-data.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DataManagementComponent, UploadDataComponent],
  imports: [
    CommonModule,
    DataManagementRoutingModule,
    CustomMaterialModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DataManagementModule { }
