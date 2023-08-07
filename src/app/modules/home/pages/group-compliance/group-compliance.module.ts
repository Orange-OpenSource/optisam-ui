import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupComplianceRoutingModule } from './group-compliance-routing.module';
import { SoftwareExpenditureComponent } from './software-expenditure/software-expenditure.component';
import { GroupComplianceComponent } from './group-compliance.component';
import { UnderusageComponent } from './compliance-chart/underusage/underusage.component';
import { ComplianceChartComponent } from './compliance-chart/compliance-chart.component';
import { CustomMaterialModule } from 'src/app/material.module';
import { SharedModule } from '@shared/shared.module';
import { HomeModule } from '@home/home.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    GroupComplianceComponent,
    SoftwareExpenditureComponent,
    UnderusageComponent,
    ComplianceChartComponent],
  imports: [
    CommonModule,
    GroupComplianceRoutingModule,
    CustomMaterialModule,
    SharedModule,
    HomeModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class GroupComplianceModule { }
