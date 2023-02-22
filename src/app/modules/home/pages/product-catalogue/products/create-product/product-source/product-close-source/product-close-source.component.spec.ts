import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ProductCloseSourceComponent } from './product-close-source.component';

describe('ProductCloseSourceComponent', () => {
  let component: ProductCloseSourceComponent;
  let fixture: ComponentFixture<ProductCloseSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductCloseSourceComponent],
      providers: [ControlContainer],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCloseSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
