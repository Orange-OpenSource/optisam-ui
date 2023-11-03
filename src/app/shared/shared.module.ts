import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterItemDirective } from '../filter-item.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AdvanceSearchComponent } from './advance-search/advance-search.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../material.module';
import { AttributeDetailComponent } from '../modules/home/pages/equipments/attribute-detail/attribute-detail.component';
import { FormatCostPipe } from './format-cost.pipe';
import { FormatShortdatePipe } from './format-shortdate.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { FloorPipe } from '@home/pages/acquiredrights/pipes/floor.pipe';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { SimpleConfirmationComponent } from './dialog/simple-confirmation/simple-confirmation.component';
import { CommonPopupComponent } from './dialog/common-popup/common-popup.component';
import { ToSeparateLinePipe } from './pipes/to-separate-line.pipe';
import { AbsPipe } from './pipes/abs.pipe';
import { IsSaasPipe } from './pipes/is-saas.pipe';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { AuditLastYearOnlyPipe } from './common-pipes/audit-last-year-only.pipe';
import { TrimTextPipe } from './common-pipes/trim-text.pipe';
import { CountryNameFromCodePipe } from './common-pipes/country-name-from-code.pipe';
import { CompanyIconPipe } from './common-pipes/company-icon.pipe';
import { TakeFirstPipe } from './common-pipes/take-first.pipe';
import { RestScopeCountPipe } from './common-pipes/rest-scope-count.pipe';
import { HeaderWithoutLoginComponent } from './header-without-login/header-without-login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ToFixedPipe } from './common-pipes/to-fixed.pipe';
import { KpiBlockComponent } from './kpi-block/kpi-block.component';
import { KpiPieBlockComponent } from './kpi-pie-block/kpi-pie-block.component';
import { FrenchNumberPipe } from './common-pipes/french-number.pipe';
import { UserChangePasswordComponent } from './user-change-password/user-change-password.component';
import { InvalidLinkComponent } from './invalid-link/invalid-link.component';
import { RouterModule } from '@angular/router';
import { CheckForMillionPipe } from './common-pipes/check-for-million.pipe';
import { ArrayToStringPipe } from './common-pipes/array-to-string.pipe';
import { KpiLoaderComponent } from './kpi-loader/kpi-loader.component';
import { ChopValuePipe } from './common-pipes/chop-value.pipe';
import { EditMetricAllocatedComponent } from './edit-metricAllocated/edit-metric-allocated.component';
import { WarningAllocationChangeComponent } from './edit-metricAllocated/dialog/warning-allocation-change/warning-allocation-change.component';
import { DeleteAllocatedMetricConfirmationDialogComponent } from './edit-metricAllocated/delete-allocated-metric-confirmation-dialog/delete-allocated-metric-confirmation-dialog.component';
import { AllocatedMetricDeleteErrorComponent } from './edit-metricAllocated/allocated-metric-delete-error/allocated-metric-delete-error.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  declarations: [
    FilterItemDirective,
    LoadingSpinnerComponent,
    AdvanceSearchComponent,
    AttributeDetailComponent,
    FormatCostPipe,
    FormatShortdatePipe,
    FloorPipe,
    SimpleConfirmationComponent,
    CommonPopupComponent,
    ToSeparateLinePipe,
    AbsPipe,
    IsSaasPipe,
    SuccessDialogComponent,
    ErrorDialogComponent,
    AuditLastYearOnlyPipe,
    TrimTextPipe,
    CountryNameFromCodePipe,
    CompanyIconPipe,
    TakeFirstPipe,
    RestScopeCountPipe,
    HeaderWithoutLoginComponent,
    PageNotFoundComponent,
    ToFixedPipe,
    KpiBlockComponent,
    KpiPieBlockComponent,
    FrenchNumberPipe,
    UserChangePasswordComponent,
    InvalidLinkComponent,
    CheckForMillionPipe,
    ArrayToStringPipe,
    KpiLoaderComponent,
    FrenchNumberPipe,
    ChopValuePipe,
    EditMetricAllocatedComponent,
    WarningAllocationChangeComponent,
    DeleteAllocatedMetricConfirmationDialogComponent,
    AllocatedMetricDeleteErrorComponent
  ],
  exports: [
    TrimTextPipe,
    FilterItemDirective,
    LoadingSpinnerComponent,
    AdvanceSearchComponent,
    FormatCostPipe,
    FormatShortdatePipe,
    FloorPipe,
    FlexLayoutModule,
    PerfectScrollbarModule,
    SimpleConfirmationComponent,
    CommonPopupComponent,
    ToSeparateLinePipe,
    AbsPipe,
    IsSaasPipe,
    TranslateModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    SuccessDialogComponent,
    ErrorDialogComponent,
    AuditLastYearOnlyPipe,
    CountryNameFromCodePipe,
    CompanyIconPipe,
    TakeFirstPipe,
    RestScopeCountPipe,
    HeaderWithoutLoginComponent,
    KpiBlockComponent,
    KpiPieBlockComponent,
    FrenchNumberPipe,
    UserChangePasswordComponent,
    InvalidLinkComponent,
    CheckForMillionPipe,
    ArrayToStringPipe,
    KpiLoaderComponent,
    FrenchNumberPipe,
    ChopValuePipe
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    RouterModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
})
export class SharedModule { }
