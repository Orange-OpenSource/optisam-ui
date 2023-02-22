import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ProductOpenSourceComponent } from './product-open-source.component';

describe('ProductOpenSourceComponent', () => {
  let component: ProductOpenSourceComponent;
  let fixture: ComponentFixture<ProductOpenSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductOpenSourceComponent],
      providers: [ControlContainer],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductOpenSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
