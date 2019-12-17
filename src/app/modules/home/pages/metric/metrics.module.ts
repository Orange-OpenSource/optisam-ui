import { SharedModule } from './../../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'src/app/material.module';
import { MatricsRoutingModule } from './matrics-routing.module';
import { MetricViewComponent } from './metric-view/metric-view.component';
import { MetricCreationComponent } from './metric-creation/metric-creation.component';

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
  declarations:  [ MetricViewComponent, MetricCreationComponent],
})
export class MetricsModule { }
