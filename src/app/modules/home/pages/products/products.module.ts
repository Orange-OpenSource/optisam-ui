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