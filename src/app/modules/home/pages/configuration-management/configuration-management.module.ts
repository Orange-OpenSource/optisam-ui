import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMaterialModule } from 'src/app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigurationManagementRoutingModule } from './configuration-management-routing.module';
import { ConfigurationManagementComponent } from './configuration-management.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
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
    SharedModule
  ]
})
export class ConfigurationManagementModule { }
