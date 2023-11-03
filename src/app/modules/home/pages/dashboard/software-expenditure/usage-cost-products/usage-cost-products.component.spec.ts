import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageCostProductsComponent } from './usage-cost-products.component';
import { ProductService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';
import { AbsoluteValuePipe } from '@shared/common-pipes/absolute-value.pipe';
import { FrenchNumberPipe } from '@shared/common-pipes/french-number.pipe';

describe('UsageCostProductsComponent', () => {
  let component: UsageCostProductsComponent;
  let fixture: ComponentFixture<UsageCostProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsageCostProductsComponent, AbsoluteValuePipe, FrenchNumberPipe],
      providers: [ProductService, { provide: MAT_DIALOG_DATA, useValue: {} }],
      imports: [HttpClientTestingModule, MatDialogModule, TranslateModule.forRoot()]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageCostProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
