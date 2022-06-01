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
import { FormatShortdatePipe } from './format-shortdate.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { FloorPipe } from '@home/pages/acquiredrights/pipes/floor.pipe';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  declarations: [
    FilterItemDirective,
    LoadingSpinnerComponent,
    AdvanceSearchComponent,
    AttributeDetailComponent,
    FormatCostPipe,
    FormatShortdatePipe,
    FloorPipe,
  ],
  exports: [
    FilterItemDirective,
    LoadingSpinnerComponent,
    AdvanceSearchComponent,
    FormatCostPipe,
    FormatShortdatePipe,
    FloorPipe,
    FlexLayoutModule,
    PerfectScrollbarModule,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
})
export class SharedModule {}
