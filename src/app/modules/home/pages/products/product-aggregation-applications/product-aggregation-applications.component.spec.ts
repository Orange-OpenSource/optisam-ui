// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAggregationApplicationsComponent } from './product-aggregation-applications.component';

describe('ProductAggregationApplicationsComponent', () => {
  let component: ProductAggregationApplicationsComponent;
  let fixture: ComponentFixture<ProductAggregationApplicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductAggregationApplicationsComponent ]
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
