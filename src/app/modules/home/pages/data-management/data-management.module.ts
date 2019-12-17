import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMaterialModule } from 'src/app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { DataManagementRoutingModule } from './data-management-routing.module';
import { DataManagementComponent } from './data-management.component';
import { UploadDataComponent } from './upload-data/upload-data.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DataManagementComponent, UploadDataComponent],
  imports: [
    CommonModule,
    DataManagementRoutingModule,
    CustomMaterialModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DataManagementModule { }
