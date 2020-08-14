// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AggregationRoutingModule } from './aggregation-routing.module';
import { CreateAggregationComponent } from './create-aggregation/create-aggregation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'src/app/material.module';
import { ListAggregationComponent } from './list-aggregation/list-aggregation.component';
import { EditAggregationDialogComponent } from './edit-aggregation-dialog/edit-aggregation-dialog.component';

@NgModule({
  declarations: [
    CreateAggregationComponent,
    ListAggregationComponent,
    EditAggregationDialogComponent
  ],
  imports: [
    CommonModule,
    AggregationRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    SharedModule
  ],
  entryComponents: [EditAggregationDialogComponent]
})
export class AggregationModule { }
