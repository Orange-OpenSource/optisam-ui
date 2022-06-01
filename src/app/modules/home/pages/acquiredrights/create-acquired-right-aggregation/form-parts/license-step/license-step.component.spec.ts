import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseStepComponent } from './license-step.component';

describe('LicenseStepComponent', () => {
  let component: LicenseStepComponent;
  let fixture: ComponentFixture<LicenseStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LicenseStepComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
