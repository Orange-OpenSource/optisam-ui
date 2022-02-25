import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAggregationComponent } from './create-aggregation.component';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomMaterialModule } from 'src/app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductService } from 'src/app/core/services/product.service';

describe('CreateAggregationComponent', () => {
  let component: CreateAggregationComponent;
  let fixture: ComponentFixture<CreateAggregationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAggregationComponent ],
      imports : [
                  FormsModule,
                  ReactiveFormsModule,
                  RouterTestingModule,
                  HttpClientTestingModule,
                  CustomMaterialModule,
                  BrowserAnimationsModule,
                  TranslateModule.forRoot()
                ],
      providers : [ProductService],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAggregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
