import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { MetricComponent } from './pages/metric-management/metric.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
// import { ChangePasswordComponent } from './pages/change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      // { path: 'chngPassword', component: ChangePasswordComponent },
      {
        path: 'apl',
        loadChildren: () =>
          import('./pages/applications/applications.module').then(
            (m) => m.ApplicationsModule
          ),
      },
      {
        path: 'ma',
        loadChildren: () =>
          import('./pages/metric-management/metrics.module').then(
            (m) => m.MetricsModule
          ),
      },
      {
        path: 'pr',
        loadChildren: () =>
          import('./pages/products/products.module').then(
            (m) => m.ProductsModule
          ),
      },
      {
        path: 'eq',
        loadChildren: () =>
          import('./pages/equipments/equipments.module').then(
            (m) => m.EquipmentsModule
          ),
      },
      {
        path: 'eqm',
        loadChildren: () =>
          import(
            './pages/equipmenttypemanagement/equipmenttypemanagement.module'
          ).then((m) => m.EquipmenttypemanagementModule),
      },
      {
        path: 'cfm',
        loadChildren: () =>
          import(
            './pages/core-factor-management/core-factor-management.module'
          ).then((m) => m.CoreFactorManagementModule),
      },
      {
        path: 'ar',
        loadChildren: () =>
          import('./pages/acquiredrights/acquiredrights.module').then(
            (m) => m.AcquiredrightsModule
          ),
      },
      {
        path: 'gr',
        loadChildren: () =>
          import('./pages/groups/groups.module').then((m) => m.GroupsModule),
      },
      {
        path: 'dm',
        loadChildren: () =>
          import('./pages/data-management/data-management.module').then(
            (m) => m.DataManagementModule
          ),
      },
      {
        path: 'cm',
        loadChildren: () =>
          import(
            './pages/configuration-management/configuration-management.module'
          ).then((m) => m.ConfigurationManagementModule),
      },
      {
        path: 'ag',
        loadChildren: () =>
          import('./pages/aggregation/aggregation.module').then(
            (m) => m.AggregationModule
          ),
      },
      {
        path: 'sm',
        loadChildren: () =>
          import('./pages/scope-management/scope-management.module').then(
            (m) => m.ScopeManagementModule
          ),
      },
      {
        path: 'om',
        loadChildren: () =>
          import(
            './pages/obsolescence-management/obsolescence-management.module'
          ).then((m) => m.ObsolescenceManagementModule),
      },
      { path: 'changePassword', component: ChangePasswordComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'metrics', component: MetricComponent },
      {
        path: 'simulation',
        loadChildren: () =>
          import('./pages/simulation/simulation.module').then(
            (m) => m.SimulationModule
          ),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./pages/reports/reports.module').then((m) => m.ReportsModule),
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class HomeRoutingModule {}
