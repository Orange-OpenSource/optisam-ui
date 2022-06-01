import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-contract-step',
  templateUrl: './contract-step.component.html',
  styleUrls: ['./contract-step.component.scss'],
})
export class ContractStepComponent implements OnInit {
  contractForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formInit();
  }

  private formInit(): void {
    this.contractForm = this.fb.group({
      csc: this.fb.control(''),
      orderingDate: this.fb.control(null),
      softwareProvider: this.fb.control(''),
    });
  }
}
