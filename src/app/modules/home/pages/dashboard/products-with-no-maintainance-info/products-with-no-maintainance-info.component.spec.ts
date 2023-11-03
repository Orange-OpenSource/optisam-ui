import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsWithNoMaintainanceInfoComponent } from './products-with-no-maintainance-info.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('ProductsWithNoMaintainanceInfoComponent', () => {
  let component: ProductsWithNoMaintainanceInfoComponent;
  let fixture: ComponentFixture<ProductsWithNoMaintainanceInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsWithNoMaintainanceInfoComponent],
      imports: [MatDialogModule, TranslateModule.forRoot()],
      providers: [{
        provide: MatDialogRef,
        useValue: {}
      }, { provide: MAT_DIALOG_DATA, useValue: {} }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsWithNoMaintainanceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
