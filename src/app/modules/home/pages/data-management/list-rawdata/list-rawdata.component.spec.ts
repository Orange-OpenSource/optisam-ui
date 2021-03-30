// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRawdataComponent } from './list-rawdata.component';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { MatDialog } from '@angular/material/dialog';

describe('ListRawdataComponent', () => {
  let component: ListRawdataComponent;
  let fixture: ComponentFixture<ListRawdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRawdataComponent ],
      imports:[
                CustomMaterialModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                TranslateModule.forRoot()
              ],
      providers:[
                  { provide: MatDialog, useValue: {} }
                ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRawdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
