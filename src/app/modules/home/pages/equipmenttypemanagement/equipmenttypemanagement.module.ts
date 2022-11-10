import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'src/app/material.module';
import { EquipmentTypeManagementService } from '../../../../core/services/equipmenttypemanagement.service';
import { EquipmenttypemanagementComponent } from './equipmenttypemanagement.component';
import { EquipmentTypeManagementRoutingModule } from './equipmenttypemanagement-routing.module';
import { AddComponent } from './dialogs/add/add.component';
import { DeleteComponent } from './dialogs/delete/delete.component';
import { EditComponent } from './dialogs/edit/edit.component';
import { ListComponent } from './dialogs/list/list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeleteAttributeConfirmationComponent } from './dialogs/edit/dialogs/delete-attribute-confirmation/delete-attribute-confirmation.component';
import { ErrorMessageComponent } from './dialogs/edit/dialogs/error-message/error-message.component';
import { SuccessMessageComponent } from './dialogs/edit/dialogs/success-message/success-message.component';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    EquipmentTypeManagementRoutingModule,
    SharedModule
  ],
  entryComponents: [
    AddComponent,
    EditComponent,
    DeleteComponent,
    ListComponent
  ],
  providers: [
    EquipmentTypeManagementService
  ],
  declarations: [EquipmenttypemanagementComponent, AddComponent, DeleteComponent, EditComponent, ListComponent, DeleteAttributeConfirmationComponent, ErrorMessageComponent, SuccessMessageComponent],
})
export class EquipmenttypemanagementModule { }
