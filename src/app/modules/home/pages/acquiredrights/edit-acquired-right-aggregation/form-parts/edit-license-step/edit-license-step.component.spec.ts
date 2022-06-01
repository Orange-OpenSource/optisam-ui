import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLicenseStepComponent } from './edit-license-step.component';

describe('EditLicenseStepComponent', () => {
  let component: EditLicenseStepComponent;
  let fixture: ComponentFixture<EditLicenseStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditLicenseStepComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLicenseStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
