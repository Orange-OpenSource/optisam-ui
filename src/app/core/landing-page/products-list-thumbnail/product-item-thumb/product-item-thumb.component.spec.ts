import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItemThumbComponent } from './product-item-thumb.component';
import { CompanyIconPipe } from '@shared/common-pipes/company-icon.pipe';
import { TrimTextPipe } from '@shared/common-pipes/trim-text.pipe';
import { ProductLicensePipe } from '@core/landing-page/pipes/product-license.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { TakeFirstPipe } from '@shared/common-pipes/take-first.pipe';
import { RestScopeCountPipe } from '@shared/common-pipes/rest-scope-count.pipe';
import { TrimTextRangePipe } from '@core/landing-page/editors-list-thumbnail/editor-item-thumb/pipes/trim-text-range.pipe';

describe('ProductItemThumbComponent', () => {
  let component: ProductItemThumbComponent;
  let fixture: ComponentFixture<ProductItemThumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ProductItemThumbComponent,
        CompanyIconPipe,
        TrimTextPipe,
        ProductLicensePipe,
        TakeFirstPipe,
        RestScopeCountPipe,
        TrimTextRangePipe
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductItemThumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
