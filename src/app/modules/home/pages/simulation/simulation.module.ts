// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

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
import { PapaParseModule } from 'ngx-papaparse';

@NgModule({
  declarations: [
    SimulationComponent,
    HardwareSimulationComponent,
    MetricSimulationComponent
  ],
  imports: [
    CommonModule,
    SimulationRoutingModule,
    TranslateModule,
    FormsModule,
    CustomMaterialModule,
    ReactiveFormsModule,
    SharedModule,
    PapaParseModule
  ]
})
export class SimulationModule { }
