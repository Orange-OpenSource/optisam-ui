// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObsolescenceManagementRoutingModule } from './obsolescence-management-routing.module';
import { DefineObsolescenceScaleComponent } from './define-obsolescence-scale/define-obsolescence-scale.component';
import { CustomMaterialModule } from 'src/app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [DefineObsolescenceScaleComponent],
  imports: [
    CommonModule,
    CustomMaterialModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    ObsolescenceManagementRoutingModule
  ]
})
export class ObsolescenceManagementModule { }
