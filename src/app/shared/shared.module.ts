// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterItemDirective } from '../filter-item.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AdvanceSearchComponent } from './advance-search/advance-search.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../material.module';
import { AttributeDetailComponent } from '../modules/home/pages/equipments/attribute-detail/attribute-detail.component';
import { FormatCostPipe } from './format-cost.pipe';

@NgModule({
  declarations: [FilterItemDirective, LoadingSpinnerComponent, AdvanceSearchComponent, AttributeDetailComponent, FormatCostPipe],
  exports : [FilterItemDirective, LoadingSpinnerComponent, AdvanceSearchComponent, FormatCostPipe],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule
  ]
})
export class SharedModule { }
