import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMetricAllocatedComponent } from './edit-metric-allocated.component';

describe('EditMetricAllocatedComponent', () => {
  let component: EditMetricAllocatedComponent;
  let fixture: ComponentFixture<EditMetricAllocatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditMetricAllocatedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMetricAllocatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
