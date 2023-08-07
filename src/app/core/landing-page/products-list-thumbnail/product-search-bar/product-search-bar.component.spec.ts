import { TranslateModule } from '@ngx-translate/core';
import { ControlContainer } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSearchBarComponent } from './product-search-bar.component';

describe('ProductSearchBarComponent', () => {
  let component: ProductSearchBarComponent;
  let fixture: ComponentFixture<ProductSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductSearchBarComponent],
      providers: [ControlContainer],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
