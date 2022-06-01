import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMaintenanceStepComponent } from './edit-maintenance-step.component';

describe('EditMaintenanceStepComponent', () => {
  let component: EditMaintenanceStepComponent;
  let fixture: ComponentFixture<EditMaintenanceStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditMaintenanceStepComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMaintenanceStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
