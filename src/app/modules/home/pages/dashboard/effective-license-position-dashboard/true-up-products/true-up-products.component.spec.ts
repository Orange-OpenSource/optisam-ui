import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrueUpProductsComponent } from './true-up-products.component';
import { TranslateModule } from '@ngx-translate/core';
import { AbsoluteValuePipe } from '@shared/common-pipes/absolute-value.pipe';
import { FrenchNumberPipe } from '@shared/common-pipes/french-number.pipe';

describe('TrueUpProductsComponent', () => {
  let component: TrueUpProductsComponent;
  let fixture: ComponentFixture<TrueUpProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrueUpProductsComponent, AbsoluteValuePipe, FrenchNumberPipe],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }]
    })


      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrueUpProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
