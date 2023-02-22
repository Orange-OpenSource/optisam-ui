import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { ProductSupportVendorComponent } from './product-support-vendor.component';

describe('ProductSupportVendorComponent', () => {
  let component: ProductSupportVendorComponent;
  let fixture: ComponentFixture<ProductSupportVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductSupportVendorComponent],
      providers: [ControlContainer],
      imports: [MatDialogModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSupportVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
