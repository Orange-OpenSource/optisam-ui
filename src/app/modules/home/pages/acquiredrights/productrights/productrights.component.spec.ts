import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductrightsComponent } from './productrights.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomMaterialModule } from 'src/app/material.module';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from 'src/app/core/services/product.service';

describe('ProductrightsComponent', () => {
  let component: ProductrightsComponent;
  let fixture: ComponentFixture<ProductrightsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ 
                      ProductrightsComponent,
                    ],
      imports : [
                  CustomMaterialModule,
                  FormsModule,
                  RouterTestingModule,
                  HttpClientTestingModule,
                  BrowserAnimationsModule,
                  SharedModule,
                  TranslateModule.forRoot()
                ],
      providers : [ 
                    ProductService,
                    { provide: MatDialog, useValue: {} } 
                  ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductrightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
