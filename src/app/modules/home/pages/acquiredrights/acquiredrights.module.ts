// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductrightsComponent } from './productrights/productrights.component';
import { AcquiredrightsRoutingModule } from './acquiredrights-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { AcquiredrightsComponent } from './acquiredrights.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AcquiredRightsTabComponent } from './acquired-rights-tab/acquired-rights-tab.component';
import { AcquiredRightsAggregationComponent } from './acquired-rights-aggregation/acquired-rights-aggregation.component';

@NgModule({
  declarations: [ProductrightsComponent, AcquiredrightsComponent, AcquiredRightsTabComponent, AcquiredRightsAggregationComponent],
  imports: [
    CommonModule,
    AcquiredrightsRoutingModule,
    TranslateModule,
    FormsModule,
    CustomMaterialModule,
    SharedModule
  ]
})
export class AcquiredrightsModule { }
