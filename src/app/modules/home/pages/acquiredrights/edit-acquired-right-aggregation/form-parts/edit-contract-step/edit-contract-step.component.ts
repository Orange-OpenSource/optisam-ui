import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AcquiredRightAggregationBody } from '@core/modals';
import { ProductService } from '@core/services/product.service';

@Component({
  selector: 'app-edit-contract-step',
  templateUrl: './edit-contract-step.component.html',
  styleUrls: ['./edit-contract-step.component.scss'],
})
export class EditContractStepComponent implements OnInit {
  contractForm: FormGroup;
  data: AcquiredRightAggregationBody;
  charLength: number = 16;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.productService
      .getAggregationData()
      .subscribe((data: AcquiredRightAggregationBody) => {
        this.data = data;
        this.contractForm.setValue({
          csc: this.data?.corporate_sourcing_contract || '',
          orderingDate: this.data?.ordering_date || null,
          softwareProvider: this.data?.software_provider || '',
        });
      });
  }

  formInit(): void {
    this.contractForm = this.fb.group({
      csc: this.fb.control(''),
      orderingDate: this.fb.control(null),
      softwareProvider: this.fb.control(''),
    });
  }
}
