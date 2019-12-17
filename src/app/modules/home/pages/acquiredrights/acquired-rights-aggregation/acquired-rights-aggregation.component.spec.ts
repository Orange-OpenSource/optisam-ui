import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquiredRightsAggregationComponent } from './acquired-rights-aggregation.component';

describe('AcquiredRightsAggregationComponent', () => {
  let component: AcquiredRightsAggregationComponent;
  let fixture: ComponentFixture<AcquiredRightsAggregationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcquiredRightsAggregationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcquiredRightsAggregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
