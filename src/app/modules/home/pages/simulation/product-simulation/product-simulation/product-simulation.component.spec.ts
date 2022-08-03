import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSimulationComponent } from './product-simulation.component';

describe('ProductSimulationComponent', () => {
  let component: ProductSimulationComponent;
  let fixture: ComponentFixture<ProductSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductSimulationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
