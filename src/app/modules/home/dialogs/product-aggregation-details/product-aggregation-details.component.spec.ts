import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductAggregationDetailsComponent } from './product-aggregation-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { InformationComponent } from './information/information.component';
import { OptionsComponent } from './options/options.component';
import { AqRightsComponent } from './aq-rights/aq-rights.component';
import { ProductService } from 'src/app/core/services/product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomMaterialModule } from 'src/app/material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ProductAggregationDetailsComponent', () => {
  let component: ProductAggregationDetailsComponent;
  let fixture: ComponentFixture<ProductAggregationDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ 
                      ProductAggregationDetailsComponent,
                      InformationComponent,
                      OptionsComponent,
                      AqRightsComponent
                    ],
      imports : [
                  CustomMaterialModule,
                  HttpClientTestingModule,
                  SharedModule,
                  TranslateModule.forRoot() 
                ],
      providers : [ 
                    ProductService,
                    { provide: MAT_DIALOG_DATA, useValue: {} },
                    { provide: MatDialogRef, useValue: {} }
                  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAggregationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
