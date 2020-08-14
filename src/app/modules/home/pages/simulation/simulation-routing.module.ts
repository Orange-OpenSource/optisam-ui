// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

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
