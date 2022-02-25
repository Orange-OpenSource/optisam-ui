import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimulationComponent } from './simulation.component';
import { HardwareSimulationComponent } from './hardware-simulation/hardware-simulation.component';
import { MetricSimulationComponent } from './metric-simulation/metric-simulation.component';

const routes: Routes = [
  {
    path: '', component: SimulationComponent,
    children: [
      { path: 'metrics', component: MetricSimulationComponent },
      { path: 'hardware', component: HardwareSimulationComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimulationRoutingModule { }
