import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductsStepComponent } from './edit-products-step.component';

describe('EditProductsStepComponent', () => {
  let component: EditProductsStepComponent;
  let fixture: ComponentFixture<EditProductsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditProductsStepComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
