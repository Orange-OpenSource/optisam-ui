import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAggregationComponent } from './product-aggregation.component';

describe('ProductAggregationComponent', () => {
  let component: ProductAggregationComponent;
  let fixture: ComponentFixture<ProductAggregationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductAggregationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAggregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
