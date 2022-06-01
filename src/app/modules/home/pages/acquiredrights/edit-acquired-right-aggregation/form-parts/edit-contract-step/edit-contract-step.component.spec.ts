import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContractStepComponent } from './edit-contract-step.component';

describe('EditContractStepComponent', () => {
  let component: EditContractStepComponent;
  let fixture: ComponentFixture<EditContractStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditContractStepComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContractStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
