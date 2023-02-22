import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimulationRoutingModule } from './simulation-routing.module';
import { SimulationComponent } from './simulation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'src/app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { HardwareSimulationComponent } from './hardware-simulation/hardware-simulation.component';
import { MetricSimulationComponent } from './metric-simulation/metric-simulation.component';
import { ProductSimulationComponent } from './product-simulation/product-simulation/product-simulation.component';

@NgModule({
  declarations: [
    SimulationComponent,
    HardwareSimulationComponent,
    MetricSimulationComponent,
    ProductSimulationComponent
  ],
  imports: [
    CommonModule,
    SimulationRoutingModule,
    TranslateModule,
    FormsModule,
    CustomMaterialModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class SimulationModule { }
