import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractStepComponent } from './contract-step.component';

describe('ContractStepComponent', () => {
  let component: ContractStepComponent;
  let fixture: ComponentFixture<ContractStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractStepComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
