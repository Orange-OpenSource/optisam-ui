// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMetadataComponent } from './list-metadata.component';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { MatDialog } from '@angular/material/dialog';

describe('ListMetadataComponent', () => {
  let component: ListMetadataComponent;
  let fixture: ComponentFixture<ListMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
                      ListMetadataComponent,
                      LoadingSpinnerComponent
                    ],
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
