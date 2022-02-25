import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigurationManagementComponent } from './configuration-management.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { Role } from 'src/app/utils/roles.config';
import { ConfigurationSimulationComponent } from './configuration-simulation/configuration-simulation.component';
import { ConfigurationsListComponent } from './configurations-list/configurations-list.component';
import { EditConfigurationComponent } from './edit-configuration/edit-configuration.component';

const routes: Routes = [
  {
    path: '', component: ConfigurationManagementComponent,
    children: [
                { path: 'simulation-configuration', component: ConfigurationsListComponent, canActivate: [AuthGuard],
                data: { roles: [Role.SuperAdmin.valueOf(), Role.Admin.valueOf()] } },
                { path: 'simulation-configuration/create', component: ConfigurationSimulationComponent, canActivate: [AuthGuard],
                data: { roles: [Role.SuperAdmin.valueOf(), Role.Admin.valueOf()] } },
                { path: 'simulation-configuration/edit', component: EditConfigurationComponent, canActivate: [AuthGuard],
                data: { roles: [Role.SuperAdmin.valueOf(), Role.Admin.valueOf()] } }
              ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationManagementRoutingModule { }
