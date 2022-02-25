import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateScopeComponent } from './create-scope.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'src/app/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateScopeComponent', () => {
  let component: CreateScopeComponent;
  let fixture: ComponentFixture<CreateScopeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateScopeComponent ],
      imports : [ 
                  CustomMaterialModule,
                  HttpClientTestingModule,
                  BrowserAnimationsModule,
                  ReactiveFormsModule,
                  TranslateModule.forRoot()
                ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateScopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
