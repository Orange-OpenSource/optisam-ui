import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ProductSourceComponent } from './product-source.component';

describe('ProductSourceComponent', () => {
  let component: ProductSourceComponent;
  let fixture: ComponentFixture<ProductSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductSourceComponent],
      providers: [ControlContainer],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
