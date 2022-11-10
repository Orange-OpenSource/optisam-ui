import { SharedModule } from './../../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'src/app/material.module';
import { EquipmentsComponent } from './equipments.component';
import { EquipmentsRoutingModule } from './equipments-routing.module';
import { EquipmentsListComponent } from './equipments-list/equipments-list.component';
import { AttributeDetailComponent } from './attribute-detail/attribute-detail.component';
import { EditMetricAllocatedComponent } from './edit-metricAllocated/edit-metric-allocated/edit-metric-allocated.component';
import { DeleteAllocatedMetricConfirmationDialogComponent } from './attribute-detail/delete-allocated-metric-confirmation-dialog/delete-allocated-metric-confirmation-dialog.component';
import { ErrorDialogComponent } from './edit-metricAllocated/dialog/error-dialog/error-dialog.component';
import { SuccessDialogComponent } from './edit-metricAllocated/dialog/success-dialog/success-dialog.component';
import { AllocatedMetricDeleteErrorComponent } from './attribute-detail/allocated-metric-delete-error/allocated-metric-delete-error.component';
import { WarningAllocationChangeComponent } from './edit-metricAllocated/edit-metric-allocated/dialog/warning-allocation-change/warning-allocation-change.component';
import { GetEquipmentAttributeNamePipe } from './attribute-detail/pipes/get-equipment-attribute-name.pipe';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    EquipmentsRoutingModule,
    SharedModule,
  ],
  entryComponents: [AttributeDetailComponent],
  declarations: [
    EquipmentsComponent,
    EquipmentsListComponent,
    EditMetricAllocatedComponent,
    DeleteAllocatedMetricConfirmationDialogComponent,
    ErrorDialogComponent,
    SuccessDialogComponent,
    AllocatedMetricDeleteErrorComponent,
    WarningAllocationChangeComponent,
    GetEquipmentAttributeNamePipe,
  ],
})
export class EquipmentsModule {}
