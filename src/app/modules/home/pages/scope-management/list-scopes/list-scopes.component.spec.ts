// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListScopesComponent } from './list-scopes.component';

describe('ListScopesComponent', () => {
  let component: ListScopesComponent;
  let fixture: ComponentFixture<ListScopesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListScopesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListScopesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
