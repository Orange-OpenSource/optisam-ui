import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricCreationComponent } from './metric-creation.component';

describe('MetricCreationComponent', () => {
  let component: MetricCreationComponent;
  let fixture: ComponentFixture<MetricCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
