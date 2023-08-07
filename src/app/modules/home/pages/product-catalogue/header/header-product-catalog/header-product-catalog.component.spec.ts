import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HeaderProductCatalogComponent } from './header-product-catalog.component';

describe('HeaderProductCatalogComponent', () => {
  let component: HeaderProductCatalogComponent;
  let fixture: ComponentFixture<HeaderProductCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderProductCatalogComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        TranslateModule.forRoot(),
        MatSnackBarModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderProductCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
