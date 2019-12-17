import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAggregationComponent } from './list-aggregation.component';

describe('ListAggregationComponent', () => {
  let component: ListAggregationComponent;
  let fixture: ComponentFixture<ListAggregationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAggregationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAggregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
