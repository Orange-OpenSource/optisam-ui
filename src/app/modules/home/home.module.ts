// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule, ApplicationModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MetricComponent } from './pages/metric/metric.component';
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

@NgModule({
  declarations: [HeaderComponent, FooterComponent,
    HomeComponent, DashboardComponent, MetricComponent,
     SettingsComponent, LoaderComponent,
     ChangePasswordComponent,
     ProductAggregationDetailsComponent,
     InformationComponent,
     OptionsComponent,
     AqRightsComponent,
     ConfirmDialogComponent,
     ProfileSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    FormsModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    TranslateModule ,
    SharedModule ],
    entryComponents: [ProductAggregationDetailsComponent, ConfirmDialogComponent],
    providers:[{
          provide: MatPaginatorIntl, deps: [TranslateService],
          useFactory: (translateService: TranslateService) => new PaginatorI18n(translateService).getPaginatorIntl()
        }]
})
export class HomeModule { }
