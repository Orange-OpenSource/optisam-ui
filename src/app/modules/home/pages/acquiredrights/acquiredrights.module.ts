import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductrightsComponent } from './productrights/productrights.component';
import { AcquiredrightsRoutingModule } from './acquiredrights-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AcquiredrightsComponent } from './acquiredrights.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AcquiredRightsTabComponent } from './acquired-rights-tab/acquired-rights-tab.component';
import { AcquiredRightsAggregationComponent } from './acquired-rights-aggregation/acquired-rights-aggregation.component';
import { CreateAcquiredRightComponent } from './create-acquired-right/create-acquired-right.component';
import { EditAcquiredRightComponent } from './edit-acquired-right/edit-acquired-right.component';
import { ListAcquiredRightsComponent } from './list-acquired-rights/list-acquired-rights.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AcquireRightsAggregationTabComponent } from './list-acquired-rights/tabs/acquire-rights-aggregation-tab/acquire-rights-aggregation-tab.component';
import { CreateAcquiredRightAggregationComponent } from './create-acquired-right-aggregation/create-acquired-right-aggregation.component';
import { UniqueProductPipe } from './unique-product.pipe';
import { EditAcquiredRightAggregationComponent } from './edit-acquired-right-aggregation/edit-acquired-right-aggregation.component';
import { ContractStepComponent } from './create-acquired-right-aggregation/form-parts/contract-step/contract-step.component';
import { TopSectionComponent } from './create-acquired-right-aggregation/form-parts/top-section/top-section.component';
import { ProductsStepComponent } from './create-acquired-right-aggregation/form-parts/products-step/products-step.component';
import { LicenseStepComponent } from './create-acquired-right-aggregation/form-parts/license-step/license-step.component';
import { MaintenanceStepComponent } from './create-acquired-right-aggregation/form-parts/maintenance-step/maintenance-step.component';
import { CommentStepComponent } from './create-acquired-right-aggregation/form-parts/comment-step/comment-step.component';
import { EditTopSectionComponent } from './edit-acquired-right-aggregation/form-parts/edit-top-section/edit-top-section.component';
import { EditContractStepComponent } from './edit-acquired-right-aggregation/form-parts/edit-contract-step/edit-contract-step.component';
import { EditProductsStepComponent } from './edit-acquired-right-aggregation/form-parts/edit-products-step/edit-products-step.component';
import { EditLicenseStepComponent } from './edit-acquired-right-aggregation/form-parts/edit-license-step/edit-license-step.component';
import { EditMaintenanceStepComponent } from './edit-acquired-right-aggregation/form-parts/edit-maintenance-step/edit-maintenance-step.component';
import { EditCommentStepComponent } from './edit-acquired-right-aggregation/form-parts/edit-comment-step/edit-comment-step.component';

@NgModule({
  declarations: [
    ProductrightsComponent,
    AcquiredrightsComponent,
    AcquiredRightsTabComponent,
    AcquiredRightsAggregationComponent,
    CreateAcquiredRightComponent,
    EditAcquiredRightComponent,
    EditAcquiredRightAggregationComponent,
    ListAcquiredRightsComponent,
    AcquireRightsAggregationTabComponent,
    CreateAcquiredRightAggregationComponent,
    UniqueProductPipe,
    ContractStepComponent,
    TopSectionComponent,
    ProductsStepComponent,
    LicenseStepComponent,
    MaintenanceStepComponent,
    CommentStepComponent,
    EditTopSectionComponent,
    EditContractStepComponent,
    EditProductsStepComponent,
    EditLicenseStepComponent,
    EditMaintenanceStepComponent,
    EditCommentStepComponent,
  ],
  imports: [
    CommonModule,
    AcquiredrightsRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    SharedModule,
    FlexLayoutModule,
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class AcquiredrightsModule {}
