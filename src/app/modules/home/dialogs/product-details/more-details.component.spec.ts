import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MoreDetailsComponent } from './more-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FooterComponent } from 'src/app/core/footer/footer.component';
import { ProductService } from 'src/app/core/services/product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomMaterialModule } from 'src/app/material.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('MoreDetailsComponent', () => {
  let component: MoreDetailsComponent;
  let fixture: ComponentFixture<MoreDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ 
                      MoreDetailsComponent,
                      FooterComponent
                    ],
      imports : [
                  CustomMaterialModule,
                  HttpClientTestingModule,
                  SharedModule,
                  RouterTestingModule,
                  TranslateModule.forRoot() 
                ],
      providers : [
                    ProductService,
                    { provide: MAT_DIALOG_DATA, useValue: {} },
                    { provide: MatDialogRef, useValue: {} }
                  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
