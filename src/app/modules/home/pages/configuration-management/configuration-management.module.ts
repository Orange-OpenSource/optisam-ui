// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMaterialModule } from 'src/app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigurationManagementRoutingModule } from './configuration-management-routing.module';
import { ConfigurationManagementComponent } from './configuration-management.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PapaParseModule } from 'ngx-papaparse';
import { ConfigurationSimulationComponent } from './configuration-simulation/configuration-simulation.component';
import { ConfigurationsListComponent } from './configurations-list/configurations-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditConfigurationComponent } from './edit-configuration/edit-configuration.component';

@NgModule({
  declarations: [ConfigurationManagementComponent, ConfigurationSimulationComponent, ConfigurationsListComponent, EditConfigurationComponent],
  imports: [
    CommonModule,
    ConfigurationManagementRoutingModule,
    CustomMaterialModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    PapaParseModule,
    SharedModule
  ]
})
export class ConfigurationManagementModule { }
