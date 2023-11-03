import { NgModule, ApplicationModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './pages/dashboard/new-dashboard/dashboard/dashboard.component';
import { MetricComponent } from './pages/metric-management/metric.component';
import { HeaderComponent } from 'src/app/core/header/header.component';
import { CustomMaterialModule } from 'src/app/material.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SettingsComponent } from './pages/settings/settings.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { FooterComponent } from '../../core/footer/footer.component';
import { LoaderComponent } from './../../core/loader/loader.component';
import { ProductAggregationDetailsComponent } from './dialogs/product-aggregation-details/product-aggregation-details.component';
import { InformationComponent } from './dialogs/product-aggregation-details/information/information.component';
import { OptionsComponent } from './dialogs/product-aggregation-details/options/options.component';
import { AqRightsComponent } from './dialogs/product-aggregation-details/aq-rights/aq-rights.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { PaginatorI18n } from 'src/app/shared/custom-mat-paginator-int';
import { ProfileSettingsComponent } from './pages/settings/profile-settings/profile-settings.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AboutComponent } from './pages/about/about/about.component';
import { CheckAggregationMetricLengthPipe } from './dialogs/product-aggregation-details/check-aggregation-metric-length.pipe';
import { KpiTileComponent } from './pages/dashboard/kpi-tile/kpi-tile.component';
import { OptimizeDashboardComponent } from './pages/dashboard/optimize-dashboard/optimize-dashboard.component';
import { ExploreDashboardComponent } from './pages/dashboard/explore-dashboard/explore-dashboard.component';
import { SoftwareExpenditureDashboardComponent } from './pages/dashboard/software-expenditure-dashboard/software-expenditure-dashboard.component';
import { SoftwareUsageExpenditureDashboardComponent } from './pages/dashboard/software-usage-expenditure-dashboard/software-usage-expenditure-dashboard.component';
import { MaintenanceDashboardComponent } from './pages/dashboard/maintenance-dashboard/maintenance-dashboard.component';
import { ParkDashboardComponent } from './pages/dashboard/park-dashboard/park-dashboard.component';
import { EffectiveLicensePositionDashboardComponent } from './pages/dashboard/effective-license-position-dashboard/effective-license-position-dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SoftwareExpenditureComponent } from './pages/dashboard/software-expenditure/software-expenditure.component';
import { ProductsWithNoMaintainanceInfoComponent } from './pages/dashboard/products-with-no-maintainance-info/products-with-no-maintainance-info.component';
import { SoftwareMaintenanceComponent } from './pages/dashboard/software-maintenance/software-maintenance.component';
import { ParkComponent } from './pages/dashboard/park/park.component';
import { SoftwareProductSpendDashboardComponent } from './pages/dashboard/software-expenditure-dashboard/software-product-spend-dashboard/software-product-spend-dashboard.component';
import { SharedReceivedLicensesDashboardComponent } from './pages/dashboard/software-expenditure-dashboard/shared-received-licenses-dashboard/shared-received-licenses-dashboard.component';
import { DashboardKpiWrapperComponent } from './pages/dashboard/new-dashboard/dashboard/dashboard-kpi-wrapper/dashboard-kpi-wrapper.component';
import { TrueUpProductsComponent } from './pages/dashboard/effective-license-position-dashboard/true-up-products/true-up-products.component';
import { WasteProductsComponent } from './pages/dashboard/effective-license-position-dashboard/waste-products/waste-products.component';
import { SoftwareExpenditureProductsComponent } from './pages/dashboard/software-expenditure/software-expenditure-products/software-expenditure-products.component';
import { UsageCostProductsComponent } from './pages/dashboard/software-expenditure/usage-cost-products/usage-cost-products.component';
@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    DashboardComponent,
    MetricComponent,
    SettingsComponent,
    LoaderComponent,
    ChangePasswordComponent,
    ProductAggregationDetailsComponent,
    InformationComponent,
    OptionsComponent,
    AqRightsComponent,
    ConfirmDialogComponent,
    ProfileSettingsComponent,
    AboutComponent,
    CheckAggregationMetricLengthPipe,
    KpiTileComponent,
    DashboardComponent,
    OptimizeDashboardComponent,
    ExploreDashboardComponent,
    SoftwareExpenditureDashboardComponent,
    SoftwareUsageExpenditureDashboardComponent,
    MaintenanceDashboardComponent,
    ParkDashboardComponent,
    EffectiveLicensePositionDashboardComponent,
    SoftwareExpenditureComponent,
    ProductsWithNoMaintainanceInfoComponent,
    SoftwareMaintenanceComponent,
    ParkComponent,
    SoftwareProductSpendDashboardComponent,
    SharedReceivedLicensesDashboardComponent,
    DashboardKpiWrapperComponent,
    TrueUpProductsComponent,
    WasteProductsComponent,
    SoftwareExpenditureProductsComponent,
    UsageCostProductsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FormsModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    TranslateModule,
    NgApexchartsModule,
    SharedModule,
  ],
  entryComponents: [ProductAggregationDetailsComponent, ConfirmDialogComponent],
  providers: [
    {
      provide: MatPaginatorIntl,
      deps: [TranslateService],
      useFactory: (translateService: TranslateService) =>
        new PaginatorI18n(translateService).getPaginatorIntl(),
    },
  ],
})
export class HomeModule { }
