// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsRoutingModule } from './applications-routing.module';
import { AplDetailsComponent } from './apl-details/apl-details.component';
import { CustomMaterialModule } from 'src/app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ApplicationsComponent } from './applications.component';
import { AplComponent } from './apl/apl.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AplComponent, AplDetailsComponent, ApplicationsComponent ],
  imports: [
    ApplicationsRoutingModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    CustomMaterialModule,
    SharedModule
  ]
})
export class ApplicationsModule { }
