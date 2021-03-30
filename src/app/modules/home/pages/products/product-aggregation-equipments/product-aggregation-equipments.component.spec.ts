// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAggregationEquipmentsComponent } from './product-aggregation-equipments.component';
import { TranslateModule } from '@ngx-translate/core';
import { AdvanceSearchComponent } from 'src/app/shared/advance-search/advance-search.component';
import { CustomMaterialModule } from 'src/app/material.module';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductAggregationEquipmentsComponent', () => {
  let component: ProductAggregationEquipmentsComponent;
  let fixture: ComponentFixture<ProductAggregationEquipmentsComponent>;
  const fakeActivatedRoute = {
      snapshot: { data: {} }
  }
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ 
                      ProductAggregationEquipmentsComponent,
                      AdvanceSearchComponent,
                      LoadingSpinnerComponent
                    ],
      imports : [ 
                  CustomMaterialModule,
                  FormsModule,
                  HttpClientTestingModule,
                  BrowserAnimationsModule,
                  RouterTestingModule,
                  TranslateModule.forRoot()
                ],
      providers:[
                  EquipmentTypeManagementService,
                  { provide: ActivatedRoute, useValue: fakeActivatedRoute }
                ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAggregationEquipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
