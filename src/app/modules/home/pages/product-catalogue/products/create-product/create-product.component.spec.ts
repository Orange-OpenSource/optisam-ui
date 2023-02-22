import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { CreateProductComponent } from './create-product.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('CreateProductComponent', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateProductComponent],
      providers: [FormBuilder,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
        MatDialogModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
//TODO: fix the undefined foreach 
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
