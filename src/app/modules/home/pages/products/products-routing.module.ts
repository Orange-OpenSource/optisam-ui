import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ProdComponent } from './prod/prod.component';
import { ProdAplComponent } from './prod-apl/prod-apl.component';
import { AplInstanceComponent } from './apl-instance/apl-instance.component';
import { ProdEquiComponent } from './prod-equi/prod-equi.component';
import { ProductAggregationComponent } from './product-aggregation/product-aggregation.component';
import { ProductTabsComponent } from './product-tabs/product-tabs.component';
const routes: Routes = [
  {
    path: '', component: ProductsComponent,
    children: [
      { path: 'products', component: ProductTabsComponent, children: [
        { path: '', component: ProdComponent },
        { path: 'aggregaions', component: ProductAggregationComponent },
      ] },
      { path: 'products/:swidTag', component: ProdAplComponent },
      { path: 'products/equi/:swidTag', component: ProdEquiComponent },
      { path: 'instances/:swidTag/:app_id', component: AplInstanceComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
