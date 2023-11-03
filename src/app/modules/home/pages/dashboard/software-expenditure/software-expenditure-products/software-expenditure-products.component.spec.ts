import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareExpenditureProductsComponent } from './software-expenditure-products.component';
import { ProductService } from '@core/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AbsoluteValuePipe } from '@shared/common-pipes/absolute-value.pipe';
import { FrenchNumberPipe } from '@shared/common-pipes/french-number.pipe';

describe('SoftwareExpenditureProductsComponent', () => {
  let component: SoftwareExpenditureProductsComponent;
  let fixture: ComponentFixture<SoftwareExpenditureProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoftwareExpenditureProductsComponent, AbsoluteValuePipe, FrenchNumberPipe],
      providers: [ProductService, { provide: MAT_DIALOG_DATA, useValue: {} }],
      imports: [HttpClientTestingModule, MatDialogModule, TranslateModule.forRoot()]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareExpenditureProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
