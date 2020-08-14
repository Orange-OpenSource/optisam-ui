// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { SharedModule } from './../../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'src/app/material.module';
import { MatricsRoutingModule } from './matrics-routing.module';
import { MetricViewComponent } from './metric-view/metric-view.component';
import { MetricCreationComponent } from './metric-creation/metric-creation.component';
import { MetricDetailsComponent } from './metric-details/metric-details.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    MatricsRoutingModule,
    SharedModule
  ],
 /*  entryComponents: [
    AttributeDetailComponent
  ], */
  declarations:  [ MetricViewComponent, MetricCreationComponent, MetricDetailsComponent],
})
export class MetricsModule { }
