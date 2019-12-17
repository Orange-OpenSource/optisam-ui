import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetricViewComponent } from './metric-view/metric-view.component';
import { MetricCreationComponent } from './metric-creation/metric-creation.component';

const routes: Routes = [
  { path: '', component: MetricViewComponent },
  { path: 'newmetric', component: MetricCreationComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatricsRoutingModule { }
