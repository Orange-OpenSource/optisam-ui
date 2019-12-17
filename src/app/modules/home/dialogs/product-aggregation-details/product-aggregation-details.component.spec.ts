import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAggregationDetailsComponent } from './product-aggregation-details.component';

describe('ProductAggregationDetailsComponent', () => {
  let component: ProductAggregationDetailsComponent;
  let fixture: ComponentFixture<ProductAggregationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductAggregationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAggregationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
