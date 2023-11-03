import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { MetricComponent } from './pages/metric-management/metric.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { GroupComplianceComponent } from './pages/group-compliance/group-compliance.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/new-dashboard/dashboard/dashboard.component';
import { OptimizeDashboardComponent } from './pages/dashboard/optimize-dashboard/optimize-dashboard.component';
import { ExploreDashboardComponent } from './pages/dashboard/explore-dashboard/explore-dashboard.component';
import { PageNotFoundComponent } from '@shared/page-not-found/page-not-found.component';
import { SoftwareExpenditureDashboardComponent } from './pages/dashboard/software-expenditure-dashboard/software-expenditure-dashboard.component';
import { SoftwareUsageExpenditureDashboardComponent } from './pages/dashboard/software-usage-expenditure-dashboard/software-usage-expenditure-dashboard.component';
import { MaintenanceDashboardComponent } from './pages/dashboard/maintenance-dashboard/maintenance-dashboard.component';
import { ParkDashboardComponent } from './pages/dashboard/park-dashboard/park-dashboard.component';
import { EffectiveLicensePositionDashboardComponent } from './pages/dashboard/effective-license-position-dashboard/effective-license-position-dashboard.component';
import { SoftwareExpenditureComponent } from './pages/dashboard/software-expenditure/software-expenditure.component';
import { SoftwareMaintenanceComponent } from './pages/dashboard/software-maintenance/software-maintenance.component';
import { ParkComponent } from './pages/dashboard/park/park.component';
// import { ChangePasswordComponent } from './pages/change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'dashboard', component: DashboardComponent,
        // children: [
        //   {
        //     path: '',
        //     component: ScrollDashboardComponent,
        //   },
        //   {
        //     path: 'optimize',
        //     component: OptimizeDashboardComponent,
        //     children: [
        //       {
        //         path: '',
        //         redirectTo: 'software-expenditure',
        //       },
        //       {
        //         path: 'software-expenditure',
        //         component: SoftwareExpenditureDashboardComponent,
        //       },
        //       {
        //         path: 'effective-license-position',
        //         component: EffectiveLicensePositionDashboardComponent,
        //       },
        //     ],
        //   },
        //   {
        //     path: 'explore',
        //     component: ExploreDashboardComponent,
        //     children: [
        //       {
        //         path: '',
        //         redirectTo: 'software-usage-expenditure',
        //       },
        //       {
        //         path: 'software-usage-expenditure',
        //         component: SoftwareExpenditureComponent,
        //       },
        //       {
        //         path: 'maintenance',
        //         component: SoftwareMaintenanceComponent,
        //       },
        //       {
        //         path: 'park',
        //         component: ParkComponent,
        //       },
        //     ],
        //   },
        // ],
      },
      {
        path: 'gc',
        loadChildren: () =>
          import('./pages/group-compliance/group-compliance.module').then(
            (m) => m.GroupComplianceModule
          ),
      },
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
        path: 'productCatalog',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../../core/landing-page/landing-page.module').then(
            (m) => m.LandingPageModule
          ),
      },
      {
        path: 'pc',
        loadChildren: () =>
          import('./pages/product-catalogue/product-catalogue.module').then(
            (m) => m.ProductCatalogueModule
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
export class HomeRoutingModule { }
