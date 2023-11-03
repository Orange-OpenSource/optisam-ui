import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Aggregation } from '@core/modals';
import { ProductService } from '@core/services/product.service';
import { supportNumberMax } from '@core/util/common.functions';

@Component({
  selector: 'app-edit-maintenance-step',
  templateUrl: './edit-maintenance-step.component.html',
  styleUrls: ['./edit-maintenance-step.component.scss'],
})
export class EditMaintenanceStepComponent implements OnInit {
  maintenanceForm: FormGroup;
  charLength: number = 16;
  private data: Aggregation;
  private licensesMaintenanceValidation: any[] = [
    Validators.pattern(/^[0-9]*$/),
    // Validators.min(1),
  ];
  private maintenancePriceValidation: any[] = [
    Validators.pattern(/^[0-9]+(\.[0-9]{1,2})*$/),
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.productService.getAggregationData().subscribe((data: Aggregation) => {
      this.data = data;
      this.maintenanceForm.setValue({
        licenses_maintenance: this.data.num_licences_maintenance || null,
        maintenance_price: this.data.avg_maintenance_unit_price || null,
        lastPurchasedOrder: this.data.last_purchased_order || '',
        supportNumber: this.data.support_number || '',
        maintenanceProvider: this.data.maintenance_provider || '',
        ...(this.isDateExist
          ? {
            startMaintenanceDate: new Date(
              this.data.start_of_maintenance
            ).toISOString(),
            endMaintenanceDate: new Date(
              this.data.end_of_maintenance
            ).toISOString(),
          }
          : {
            startMaintenanceDate: null,
            endMaintenanceDate: null,
          }),
      });
    });
  }

  formInit(): void {
    this.maintenanceForm = this.fb.group({
      startMaintenanceDate: this.fb.control(null),
      endMaintenanceDate: this.fb.control(null),
      lastPurchasedOrder: this.fb.control(''),
      supportNumber: this.fb.control('', [supportNumberMax(16)]),
      maintenanceProvider: this.fb.control(''),
      licenses_maintenance: this.fb.control(
        null,
        this.licensesMaintenanceValidation
      ),
      maintenance_price: this.fb.control(null, this.maintenancePriceValidation),
    });
  }

  get isDateExist(): boolean {
    return !!this.data.start_of_maintenance && !!this.data.end_of_maintenance;
  }

  get startMaintenanceDate() {
    return this.maintenanceForm.get('startMaintenanceDate');
  }

  get endMaintenanceDate() {
    return this.maintenanceForm.get('endMaintenanceDate');
  }

  get licenses_maintenance() {
    return this.maintenanceForm.get('licenses_maintenance');
  }

  get maintenance_price() {
    return this.maintenanceForm.get('maintenance_price');
  }

  get supportNumber(): FormControl {
    return this.maintenanceForm.get('supportNumber') as FormControl;
  }

  // True if end date is less than start date
  get invalidEndDate(): Boolean {
    const newDate = new Date(this.startMaintenanceDate.value);
    const startMaintenanceDate = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate()
    );
    return this.endMaintenanceDate.value < this.startMaintenanceDate.value
      ? true
      : false;
  }

  get allowDate(): boolean {
    return (
      this.licenses_maintenance.invalid ||
      !this.licenses_maintenance.value ||
      this.licenses_maintenance.value == 0
    );
  }

  get allowEndDate(): boolean {
    return this.allowDate && !!this.startMaintenanceDate.value;
  }

  validatePattern(input) {
    return input?.value?.includes('_')
      ? {
        hasUnderscore: true,
      }
      : null;
  }

  orgStartValueChange() {
    if (
      this.startMaintenanceDate.value > this.endMaintenanceDate.value ||
      this.startMaintenanceDate.value == null
    ) {
      this.endMaintenanceDate.setValue(null);
    }
  }

  // Handles: 'End date can not be before start date'
  expiryDateFilter(selectedDate: Date): boolean {
    const newDate = new Date(this.startMaintenanceDate.value);
    const startMaintenanceDate = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate()
    );
    return selectedDate > startMaintenanceDate;
  }
  boundDateStart = this.expiryDateFilter.bind(this);

  valueChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    const s = this.maintenanceForm.get('startMaintenanceDate');
    const e = this.maintenanceForm.get('endMaintenanceDate');
    const m = this.maintenanceForm.get('maintenance_price');
    const l = this.maintenanceForm.get('licenses_maintenance');
    if (Number(val)) {
      //adding validation
      l.setValidators(
        this.licensesMaintenanceValidation.concat([Validators.required])
      );
      s.setValidators(Validators.required);
      e.setValidators(Validators.required);
      this.validateAllFormFields(this.maintenanceForm);
    } else {
      //settting default validation
      s.clearValidators();
      e.clearValidators();
      l.setValidators(this.licensesMaintenanceValidation);
      this.validateAllFormFields(this.maintenanceForm);
      s.reset();
      e.reset();
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched();
        control.markAsDirty();
        control.updateValueAndValidity();
        if (!control.value && !(control?.errors && control?.errors.length))
          control.markAsUntouched();
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  get incompleteMaintenanceForm(): Boolean {
    // check if any modification done in maintenance form
    if (
      this.startMaintenanceDate.value !== null ||
      this.endMaintenanceDate.value !== null ||
      (this.licenses_maintenance.value !== null &&
        this.licenses_maintenance.value !== '' &&
        this.licenses_maintenance.value > 0)
    ) {
      if (
        this.startMaintenanceDate.value !== null &&
        this.endMaintenanceDate.value !== null &&
        this.licenses_maintenance.value !== null &&
        this.licenses_maintenance.value !== '' &&
        this.licenses_maintenance.value > 0
      ) {
        return false; // complete maintenance form
      } else {
        return true; // incomplete maintenace form
      }
    }
    return false; // if no modification done in maintenance form
  }

}
