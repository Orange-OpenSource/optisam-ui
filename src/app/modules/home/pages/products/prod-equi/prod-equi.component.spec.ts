// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdEquiComponent } from './prod-equi.component';

describe('ProdEquiComponent', () => {
  let component: ProdEquiComponent;
  let fixture: ComponentFixture<ProdEquiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdEquiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdEquiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
