import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyIconPipe } from '@shared/common-pipes/company-icon.pipe';
import { TrimTextPipe } from '@shared/common-pipes/trim-text.pipe';

import { ProductContentComponent } from './product-content.component';

describe('ProductContentComponent', () => {
  let component: ProductContentComponent;
  let fixture: ComponentFixture<ProductContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductContentComponent, CompanyIconPipe, TrimTextPipe],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
