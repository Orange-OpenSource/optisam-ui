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
