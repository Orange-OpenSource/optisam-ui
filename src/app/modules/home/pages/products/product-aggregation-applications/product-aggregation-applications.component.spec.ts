import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAggregationApplicationsComponent } from './product-aggregation-applications.component';
import { TranslateModule } from '@ngx-translate/core';
import { AdvanceSearchComponent } from 'src/app/shared/advance-search/advance-search.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomMaterialModule } from 'src/app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductAggregationApplicationsComponent', () => {
  let component: ProductAggregationApplicationsComponent;
  let fixture: ComponentFixture<ProductAggregationApplicationsComponent>;
  const fakeActivatedRoute = {
    snapshot: { data: {} }
}
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ 
                      ProductAggregationApplicationsComponent,
                      AdvanceSearchComponent
                    ],
      imports : [ 
                  CustomMaterialModule,
                  FormsModule,
                  HttpClientTestingModule,
                  RouterTestingModule,
                  BrowserAnimationsModule,
                  TranslateModule.forRoot()
                ],
      providers:[
                  ProductService,
                  { provide: ActivatedRoute, useValue: fakeActivatedRoute }
                ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAggregationApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
