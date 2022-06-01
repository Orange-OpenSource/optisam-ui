import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceStepComponent } from './maintenance-step.component';

describe('MaintenanceStepComponent', () => {
  let component: MaintenanceStepComponent;
  let fixture: ComponentFixture<MaintenanceStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintenanceStepComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
