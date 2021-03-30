// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AcquiredRightsTabComponent } from './acquired-rights-tab.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';

describe('AcquiredRightsTabComponent', () => {
  let component: AcquiredRightsTabComponent;
  let fixture: ComponentFixture<AcquiredRightsTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AcquiredRightsTabComponent ],
      imports : [ 
                  RouterTestingModule,
                  CustomMaterialModule,
                  TranslateModule.forRoot() 
                ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcquiredRightsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
