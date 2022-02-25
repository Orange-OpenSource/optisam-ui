import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AplInstanceComponent } from './apl-instance.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { ProductService } from 'src/app/core/services/product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from 'src/app/material.module';
import { MatDialog } from '@angular/material/dialog';

describe('AplInstanceComponent', () => {
  let component: AplInstanceComponent;
  let fixture: ComponentFixture<AplInstanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ 
                      AplInstanceComponent,
                      LoadingSpinnerComponent
                    ],
      imports : [ 
                  CustomMaterialModule,
                  HttpClientTestingModule,
                  RouterTestingModule,
                  BrowserAnimationsModule,
                  TranslateModule.forRoot()
                ],
      providers:[
                  ProductService,
                  { provide: MatDialog, useValue: {} },
                ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AplInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
