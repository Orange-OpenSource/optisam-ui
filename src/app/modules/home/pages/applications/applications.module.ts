import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsRoutingModule } from './applications-routing.module';
import { AplDetailsComponent } from './apl-details/apl-details.component';
import { CustomMaterialModule } from 'src/app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ApplicationsComponent } from './applications.component';
import { AplComponent } from './apl/apl.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductsModule } from '../products/products.module';
import { AplProductDetailsComponent } from './apl-product-details/apl-product-details.component';

@NgModule({
  declarations: [AplComponent, AplDetailsComponent, ApplicationsComponent, AplProductDetailsComponent ],
  imports: [
    ApplicationsRoutingModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    CustomMaterialModule,
    SharedModule,
    ProductsModule
  ]
})
export class ApplicationsModule { }
