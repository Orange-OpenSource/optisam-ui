import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterItemDirective } from '../filter-item.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
// import { MatProgressSpinnerModule } from '@angular/material';
import { AdvanceSearchComponent } from './advance-search/advance-search.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../material.module';

@NgModule({
  declarations: [FilterItemDirective, LoadingSpinnerComponent, AdvanceSearchComponent],
  exports : [FilterItemDirective, LoadingSpinnerComponent, AdvanceSearchComponent],
  imports: [
    CommonModule,
    // MatProgressSpinnerModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule
  ]
})
export class SharedModule { }
