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
import { ProductAggregationEquipmentsComponent } from './product-aggregation-equipments/product-aggregation-equipments.component';
import { ProductAggregationApplicationsComponent } from './product-aggregation-applications/product-aggregation-applications.component';
import { AttributeDetailComponent } from '../equipments/attribute-detail/attribute-detail.component';
import { ViewProductsComponent } from './prod/view-products/view-products.component';
import { AuditLastYearPipe } from './prod/view-products/audit-last-year.pipe';

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
  entryComponents: [
    AttributeDetailComponent
  ],
  declarations: [
    ProductsComponent, 
    ProdAplComponent, 
    AplInstanceComponent, 
    ProdComponent, 
    ProdEquiComponent, 
    ProductAggregationComponent, 
    ProductTabsComponent, 
    ProductAggregationEquipmentsComponent, 
    ProductAggregationApplicationsComponent, ViewProductsComponent, AuditLastYearPipe
  ],
})
export class ProductsModule { }
