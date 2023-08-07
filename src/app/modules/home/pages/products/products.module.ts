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
import { UserDetailsComponent } from './prod/user-details/user-details.component';
import { UserContentComponent } from './prod/user-content/user-content.component';
import { UserContentNominativeComponent } from './prod/user-content/user-content-nominative/user-content-nominative.component';
import { UserContentConcurrentComponent } from './prod/user-content/user-content-concurrent/user-content-concurrent.component';
import { IndividualNominativeUserComponent } from './prod/user-content/user-content-nominative/individual-nominative-user/individual-nominative-user.component';
import { AggregationNominativeUserComponent } from './prod/user-content/user-content-nominative/aggregation-nominative-user/aggregation-nominative-user.component';
import { ProductIndividualConcurrentUserComponent } from './prod/user-content/user-content-concurrent/product-individual-concurrent-user/product-individual-concurrent-user.component';
import { ProductAggregationConcurrentUserComponent } from './prod/user-content/user-content-concurrent/product-aggregation-concurrent-user/product-aggregation-concurrent-user.component';
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
    SharedModule,
  ],
  entryComponents: [AttributeDetailComponent],
  declarations: [
    ProductsComponent,
    ProdAplComponent,
    AplInstanceComponent,
    ProdComponent,
    ProdEquiComponent,
    ProductAggregationComponent,
    ProductTabsComponent,
    ProductAggregationEquipmentsComponent,
    ProductAggregationApplicationsComponent,
    UserDetailsComponent,
    UserContentComponent,
    UserContentNominativeComponent,
    UserContentConcurrentComponent,
    IndividualNominativeUserComponent,
    AggregationNominativeUserComponent,
    ProductIndividualConcurrentUserComponent,
    ProductAggregationConcurrentUserComponent,
    ProductsComponent,
    ProdAplComponent,
    AplInstanceComponent,
    ProdComponent,
    ProdEquiComponent,
    ProductAggregationComponent,
    ProductTabsComponent,
    ProductAggregationEquipmentsComponent,
    ProductAggregationApplicationsComponent,
    ViewProductsComponent,
    AuditLastYearPipe,
  ],
})
export class ProductsModule {}
