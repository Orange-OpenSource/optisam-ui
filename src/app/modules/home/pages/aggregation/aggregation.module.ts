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
