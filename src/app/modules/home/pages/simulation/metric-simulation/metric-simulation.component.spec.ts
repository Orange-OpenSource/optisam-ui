// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricSimulationComponent } from './metric-simulation.component';
import { TranslateModule } from '@ngx-translate/core';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { CustomMaterialModule } from 'src/app/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ProductService } from 'src/app/core/services/product.service';

describe('MetricSimulationComponent', () => {
  let component: MetricSimulationComponent;
  let fixture: ComponentFixture<MetricSimulationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricSimulationComponent ],
      imports : [ 
                  CustomMaterialModule,
                  HttpClientTestingModule,
                  BrowserAnimationsModule,
                  FormsModule,
                  TranslateModule.forRoot()
                ],
      providers:[
                  ProductService,
                  EquipmentTypeManagementService
                ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
