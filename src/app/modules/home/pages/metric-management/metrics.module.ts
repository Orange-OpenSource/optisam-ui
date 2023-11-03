import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'src/app/material.module';
import { MatricsRoutingModule } from './metrics-routing.module';
import { MetricViewComponent } from './metric-view/metric-view.component';
import { MetricDetailsComponent } from './metric-details/metric-details.component';
import { CreateMetricComponent } from './create-metric/create-metric.component';
import { EditMetricsComponent } from './edit-metrics/edit-metrics.component';
import { ImportMetricsComponent } from './metric-view/import-metrics/import-metrics.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    MatricsRoutingModule,
    SharedModule,
  ],
  declarations: [
    MetricViewComponent,
    CreateMetricComponent,
    MetricDetailsComponent,
    EditMetricsComponent,
    ImportMetricsComponent,
  ],
})
export class MetricsModule {}
