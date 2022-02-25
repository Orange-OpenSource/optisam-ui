import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ListReportsComponent } from './list-reports/list-reports.component';
import { CreateReportComponent } from './create-report/create-report.component';
import { CustomMaterialModule } from 'src/app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ListReportsComponent, CreateReportComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    CustomMaterialModule,
    TranslateModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ReportsModule { }
