import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquireRightsAggregationTabComponent } from './acquire-rights-aggregation-tab.component';

describe('AcquireRightsAggregationTabComponent', () => {
  let component: AcquireRightsAggregationTabComponent;
  let fixture: ComponentFixture<AcquireRightsAggregationTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcquireRightsAggregationTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcquireRightsAggregationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
