// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsComponent } from './products.component';
import { AplInstanceComponent } from './apl-instance/apl-instance.component';
import { ProdAplComponent } from './prod-apl/prod-apl.component';
import { ProdComponent } from './prod/prod.component';
import { CustomMaterialModule } from 'src/app/material.module';
import { HeaderComponent } from 'src/app/core/header/header.component';
import { FilterItemDirective } from 'src/app/filter-item.directive';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProdEquiComponent } from './prod-equi/prod-equi.component';
import { ProductAggregationComponent } from './product-aggregation/product-aggregation.component';
import { ProductTabsComponent } from './product-tabs/product-tabs.component';

@NgModule({
  imports: [
    CommonModule,
    ProductsRoutingModule,
    TranslateModule,
    FormsModule,
    CustomMaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [ProductsComponent, ProdAplComponent, AplInstanceComponent, ProdComponent, ProdEquiComponent, ProductAggregationComponent, ProductTabsComponent],
})
export class ProductsModule { }
