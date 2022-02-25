import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetricViewComponent } from './metric-view/metric-view.component';
import { MetricDetailsComponent } from './metric-details/metric-details.component';
import { CreateMetricComponent } from './create-metric/create-metric.component';

const routes: Routes = [
  { path: '', component: MetricViewComponent },
  { path: 'newmetric', component: CreateMetricComponent },
  { path: 'viewMetric', component: MetricDetailsComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatricsRoutingModule { }
