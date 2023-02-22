import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { DeleteProductConfirmationProductCatalogComponent } from './delete-product-confirmation-product-catalog.component';

describe('DeleteProductConfirmationProductCatalogComponent', () => {
  let component: DeleteProductConfirmationProductCatalogComponent;
  let fixture: ComponentFixture<DeleteProductConfirmationProductCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteProductConfirmationProductCatalogComponent ],
      imports: [ MatDialogModule, HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [ { provide: MAT_DIALOG_DATA, useValue: {}},{
        provide: MatDialogRef,
        useValue: {}
      },]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteProductConfirmationProductCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
