import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCatalogDashboardComponent } from './product-catalog-dashboard.component';
import { ProductService } from '@core/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('ProductCatalogDashboardComponent', () => {
  let component: ProductCatalogDashboardComponent;
  let fixture: ComponentFixture<ProductCatalogDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductCatalogDashboardComponent],
      providers: [ProductService, TranslateService],
      imports: [HttpClientTestingModule, MatDialogModule, TranslateModule.forRoot()]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCatalogDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
