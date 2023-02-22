import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { ViewProductCatalogProductDialogComponent } from './view-product-catalog-product-dialog.component';

describe('ViewProductCatalogProductDialogComponent', () => {
  let component: ViewProductCatalogProductDialogComponent;
  let fixture: ComponentFixture<ViewProductCatalogProductDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewProductCatalogProductDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProductCatalogProductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
