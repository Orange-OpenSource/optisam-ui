// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationService } from 'src/app/core/services/application.service';
import { CustomMaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { DefineObsolescenceScaleComponent } from './define-obsolescence-scale.component';

describe('DefineObsolescenceScaleComponent', () => {
  let component: DefineObsolescenceScaleComponent;
  let fixture: ComponentFixture<DefineObsolescenceScaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefineObsolescenceScaleComponent ],
      imports: [
        RouterTestingModule, 
        HttpClientTestingModule,
        CustomMaterialModule,
        SharedModule,
        TranslateModule.forRoot()
      ],
      providers: [ApplicationService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineObsolescenceScaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
