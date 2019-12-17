import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { MetricComponent } from './pages/metric/metric.component';
import { SimulationComponent } from './pages/simulation/simulation.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      // { path: 'chngPassword', component: ChangePasswordComponent },
      { path: 'apl', loadChildren: './pages/applications/applications.module#ApplicationsModule'},
      { path: 'ma', loadChildren: './pages/metric/metrics.module#MetricsModule'},
      { path: 'pr', loadChildren: './pages/products/products.module#ProductsModule'},
      { path: 'eq',  loadChildren: './pages/equipments/equipments.module#EquipmentsModule'},
      { path: 'eqm',  loadChildren: './pages/equipmenttypemanagement/equipmenttypemanagement.module#EquipmenttypemanagementModule'},
      { path: 'ar', loadChildren: './pages/acquiredrights/acquiredrights.module#AcquiredrightsModule'},
      { path: 'gr', loadChildren: './pages/groups/groups.module#GroupsModule'},
      { path: 'dm', loadChildren: './pages/data-management/data-management.module#DataManagementModule'},
      { path: 'ag', loadChildren: './pages/aggregation/aggregation.module#AggregationModule'},
      { path: 'settings', component: SettingsComponent },
      { path: 'metrics', component: MetricComponent },
      { path: 'metrics', component: MetricComponent },
      { path: 'simulation', component: SimulationComponent },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
  ]
})
export class HomeRoutingModule { }
