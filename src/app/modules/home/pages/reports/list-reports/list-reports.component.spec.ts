import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReportsComponent } from './list-reports.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from 'src/app/material.module';

describe('ListReportsComponent', () => {
  let component: ListReportsComponent;
  let fixture: ComponentFixture<ListReportsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ 
                      ListReportsComponent,
                      LoadingSpinnerComponent
                    ],
      imports : [ 
                  HttpClientTestingModule,
                  BrowserAnimationsModule,
                  CustomMaterialModule,
                  TranslateModule.forRoot()
                ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
