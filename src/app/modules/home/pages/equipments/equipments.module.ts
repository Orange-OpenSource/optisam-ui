import { SharedModule } from './../../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'src/app/material.module';
import { EquipmentsComponent } from './equipments.component';
import { EquipmentsRoutingModule } from './equipments-routing.module';
import { EquipmentsListComponent } from './equipments-list/equipments-list.component';
import { AttributeDetailComponent } from './attribute-detail/attribute-detail.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    EquipmentsRoutingModule,
    SharedModule
  ],
  entryComponents: [
    AttributeDetailComponent
  ],
  declarations:  [ EquipmentsComponent, EquipmentsListComponent, AttributeDetailComponent],
})
export class EquipmentsModule { }
