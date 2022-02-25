import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAggregationComponent } from './product-aggregation.component';
import { TranslateModule } from '@ngx-translate/core';
import { AdvanceSearchComponent } from 'src/app/shared/advance-search/advance-search.component';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomMaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ProductService } from 'src/app/core/services/product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductAggregationComponent', () => {
  let component: ProductAggregationComponent;
  let fixture: ComponentFixture<ProductAggregationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ 
                      ProductAggregationComponent,
                      AdvanceSearchComponent,
                      LoadingSpinnerComponent
                    ],
      imports : [ 
                  CustomMaterialModule,
                  FormsModule,
                  RouterTestingModule,
                  HttpClientTestingModule,
                  BrowserAnimationsModule,
                  TranslateModule.forRoot()
                ],
      providers:[
                  ProductService
                ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAggregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
