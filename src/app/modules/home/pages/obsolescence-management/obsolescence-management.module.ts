import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObsolescenceManagementRoutingModule } from './obsolescence-management-routing.module';
import { DefineObsolescenceScaleComponent } from './define-obsolescence-scale/define-obsolescence-scale.component';
import { CustomMaterialModule } from 'src/app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [DefineObsolescenceScaleComponent],
  imports: [
    CommonModule,
    CustomMaterialModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    ObsolescenceManagementRoutingModule
  ]
})
export class ObsolescenceManagementModule { }
