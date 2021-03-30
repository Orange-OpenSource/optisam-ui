// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ProdComponent } from './prod/prod.component';
import { ProdAplComponent } from './prod-apl/prod-apl.component';
import { AplInstanceComponent } from './apl-instance/apl-instance.component';
import { ProdEquiComponent } from './prod-equi/prod-equi.component';
import { ProductAggregationComponent } from './product-aggregation/product-aggregation.component';
import { ProductTabsComponent } from './product-tabs/product-tabs.component';
import { ProductAggregationApplicationsComponent } from './product-aggregation-applications/product-aggregation-applications.component';
import { ProductAggregationEquipmentsComponent } from './product-aggregation-equipments/product-aggregation-equipments.component';

const routes: Routes = [
  {
    path: '', component: ProductsComponent,
    children: [
      { path: 'products', component: ProductTabsComponent, children: [
        { path: '', component: ProdComponent },
        { path: 'aggregations', component: ProductAggregationComponent }
      ] },
      { path: 'products/:swidTag', component: ProdAplComponent },
      { path: 'products/equi/:swidTag', component: ProdEquiComponent },
      { path: 'products/aggregations/:agg_name/applications', component: ProductAggregationApplicationsComponent, pathMatch: 'full' },
      { path: 'products/aggregations/:agg_name/equipments', component: ProductAggregationEquipmentsComponent },
      { path: 'instances/:swidTag/:app_id', component: AplInstanceComponent },
      { path: 'apl/instances/:swidTag/:app_id/:inst_id', component:ProdEquiComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
