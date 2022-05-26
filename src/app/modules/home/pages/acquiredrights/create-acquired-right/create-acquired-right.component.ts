import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { map } from 'rxjs/operators';
import { MetricService } from 'src/app/core/services/metric.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-create-acquired-right',
  templateUrl: './create-acquired-right.component.html',
  styleUrls: ['./create-acquired-right.component.scss'],
})
export class CreateAcquiredRightComponent implements OnInit {
  metricsList: any[] = [];
  skuForm: FormGroup;
  productForm: FormGroup;
  licenseForm: FormGroup;
  maintenanceForm: FormGroup;
  commentForm: FormGroup;
  _createLoading: Boolean;
  errorMsg: any;
  actionSuccessful: Boolean;
  currentScope: string = localStorage.getItem('scope');
  editorsList: string[] = [];
  productsList: any[] = [];
  displayProductsList: any[] = [];
  versionsList: string[] = [];
  filteredEditorsList: string[];
  filteredProductsList: any[];
  filteredVersionsList: string[];
  mySelections: string[];
  private licensesMaintenanceValidation: any[] = [
    Validators.pattern(/^[0-9]*$/),
    // Validators.min(1),
  ];
  private maintenancePriceValidation: any[] = [
    Validators.pattern(/^[0-9]+(\.[0-9]{1,2})*$/),
  ];

  disabledMetricNameList: string[] = [];
  currentMetricType: string;

  constructor(
    private metricService: MetricService,
    private productService: ProductService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.listMetrics();
    this.listEditors();
  }

  ngOnInit(): void {
    this.initForm();
    // Filter autocomplete options for 'Editor'
    this.product_editor.valueChanges
      .pipe(map((value) => this._filter('editor', value)))
      .subscribe((res) => {
        this.filteredEditorsList = res;
        this.filteredProductsList = [];
      });
    // Filter autocomplete options for 'Product'
    this.product_name.valueChanges
      .pipe(map((value) => this._filter('product', value)))
      .subscribe((res) => {
        this.filteredProductsList = res;
        this.filteredVersionsList = [];
      });
    // Filter autocomplete options for 'Version'
    this.product_version.valueChanges
      .pipe(map((value) => this._filter('version', value)))
      .subscribe((res) => {
        this.filteredVersionsList = res;
      });

    this.maintenanceForm.valueChanges.subscribe((data) => {
      if (this.startMaintenanceDate.value) {
        console.log(this.startMaintenanceDate.value.toISOString());
        console.log(this.startMaintenanceDate.value);
        console.log(new Date(this.startMaintenanceDate.value.toISOString()));
        console.log('---new line---');
      }
    });
  }

  // Get editors list
  listEditors() {
    const query = '?scopes=' + this.currentScope;
    this.productService.getEditorList(query).subscribe(
      (res) => {
        this.editorsList = res.editors || [];
        this.filteredEditorsList = this.editorsList;
      },
      (err) => {
        console.log('Some error occured! Could not fetch editors list.');
      }
    );
  }

  // Get products list
  listProducts() {
    const query =
      '?scopes=' + this.currentScope + '&editor=' + this.product_editor.value;
    this.productService.getProductList(query).subscribe(
      (res) => {
        this.productsList = res.products || [];
        this.displayProductsList = [
          ...new Set(this.productsList.map((prod) => prod.name)),
        ];
        this.filteredProductsList = this.displayProductsList;
      },
      (err) => {
        console.log('Some error occured! Could not fetch products list.');
      }
    );
  }

  // Get versions for selected product
  listVersions() {
    this.versionsList = this.productsList
      .filter(
        (product) =>
          product.name.toLowerCase() === this.product_name.value.toLowerCase()
      )
      .map((val) => val.version);
    this.filteredVersionsList = this.versionsList;
  }

  // Get metrics list
  listMetrics() {
    this.metricService.getMetricList().subscribe(
      (res) => {
        this.metricsList = res.metrices.sort((a, b) => {
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          return 0;
        });
      },
      (err) => {
        console.log('Some error occured! Could not fetch metrics list.');
      }
    );
  }

  // Initialize form
  initForm() {
    this.skuForm = new FormGroup({
      sku: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9_.]*$/),
      ]),
    });
    this.productForm = new FormGroup({
      // Product Name, Version, Editor: Allow all characters except _ & allow just one space between words only
      product_name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\S+(?: \S+)*$/),
        this.validatePattern,
      ]),
      product_version: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\S+(?: \S+)*$/),
        this.validatePattern,
      ]),
      product_editor: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\S+(?: \S+)*$/),
        this.validatePattern,
      ]),
      metrics: new FormControl([], [Validators.required]),
    });
    this.licenseForm = new FormGroup({
      licenses_acquired: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]*$/),
      ]),
      unit_price: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]+(\.[0-9]{1,2})*$/),
      ]),
    });
    this.maintenanceForm = new FormGroup({
      startMaintenanceDate: new FormControl(null),
      endMaintenanceDate: new FormControl(null),
      licenses_maintenance: new FormControl(
        null,
        this.licensesMaintenanceValidation
      ),
      maintenance_price: new FormControl(null, this.maintenancePriceValidation),
    });
    this.commentForm = new FormGroup({
      comment: new FormControl(''),
    });
    if (this.data) {
      this.product_name.setValue(this.data.product_name);
      this.product_name.disable();
      this.product_version.setValue(this.data.version);
      this.product_version.disable();
      this.product_editor.setValue(this.data.editor);
      this.product_editor.disable();
      this.listProducts();
      this.listVersions();
    }
  }

  get sku() {
    return this.skuForm.get('sku');
  }
  get product_name() {
    return this.productForm.get('product_name');
  }
  get product_version() {
    return this.productForm.get('product_version');
  }
  get product_editor() {
    return this.productForm.get('product_editor');
  }
  get metrics() {
    return this.productForm.get('metrics');
  }
  get licenses_acquired() {
    return this.licenseForm.get('licenses_acquired');
  }
  get unit_price() {
    return this.licenseForm.get('unit_price');
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
  get comment() {
    return this.commentForm.get('comment');
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

  // Return filtered list for autocomplete options
  private _filter(type, value): string[] {
    let list;
    switch (type) {
      case 'editor':
        list = this.editorsList;
        break;
      case 'product':
        list = this.displayProductsList;
        break;
      case 'version':
        list = this.versionsList;
    }
    return list.filter((option) =>
      option.toLowerCase().includes(value ? value.toLowerCase() : '')
    );
  }

  // True if Mandatory fields for create are not filled
  get incompleteFormForCreate(): Boolean {
    if (
      this.skuForm.valid &&
      this.productForm.valid &&
      this.licenseForm.valid &&
      this.maintenanceForm.valid
    ) {
      // check if any modification done in maintenance form
      return false;
    }
    return true; // if skuForm, productForm or licenseForm is invalid
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

  // True if all forms are pristine
  get isPristine(): Boolean {
    if (
      this.skuForm.pristine &&
      this.productForm.pristine &&
      this.licenseForm.pristine &&
      this.maintenanceForm.pristine &&
      this.commentForm.pristine
    ) {
      return true;
    }
    return false;
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

  // Send create request for new acquired right
  createAcquiredRight(successMsg, errorMsg) {
    this._createLoading = true;
    const body = {
      sku: this.sku.value,
      product_name: this.product_name.value,
      version: this.product_version.value,
      product_editor: this.product_editor.value,
      metric_name: this.metrics.value.join(','),
      num_licenses_acquired: Number(this.licenses_acquired.value),
      avg_unit_price: Number(this.unit_price.value),
      start_of_maintenance: this.startMaintenanceDate.value,
      end_of_maintenance: this.endMaintenanceDate.value,
      num_licences_maintainance: Number(this.licenses_maintenance.value),
      avg_maintenance_unit_price: Number(this.maintenance_price.value),
      scope: localStorage.getItem('scope'),
      comment: this.comment.value,
    };
    this.productService.createAcquiredRight(body).subscribe(
      (res) => {
        this.actionSuccessful = true;
        this.openModal(successMsg);
        this._createLoading = false;
      },
      (err) => {
        this.actionSuccessful = false;
        this.errorMsg =
          err && err.error
            ? err.error.message
            : 'Some error occured! Acquired Right could not be created.';
        this.openModal(errorMsg);
        this._createLoading = false;
      }
    );
    console.log(this.metrics.value);
  }

  // Resets form
  resetForm(stepper: MatStepper) {
    stepper.reset();
    this.skuForm.reset();
    this.productForm.reset();
    this.licenseForm.reset();
    this.maintenanceForm.reset();
    this.commentForm.reset();
    // resest list used for autocomplete
    this.filteredEditorsList = this.editorsList;
    this.filteredProductsList = [];
    this.filteredVersionsList = [];
  }

  // Shows creation success/error
  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '30%',
      disableClose: true,
    });
  }

  changed(values: any) {
    setTimeout(() => {
      if (!values.length) this.disabledMetricNameList = [];

      const ORACLE_TYPES = ['oracle.nup.standard', 'oracle.processor.standard'];

      if (!this.metrics.value.length) this.disabledMetricNameList = [];
      // condition for if metric type is in the oracle block list-- ORACLE_TYPES
      if (
        this.metrics.value.length &&
        ORACLE_TYPES.includes(this.currentMetricType)
      ) {
        const selectedMetricName =
          this.metrics.value[this.metrics.value.length - 1];

        this.disabledMetricNameList = this.metricsList
          .filter(
            (m) =>
              m.type !== this.currentMetricType || m.name !== selectedMetricName
          )
          .map((m) => m.name);
      }

      if (
        this.metrics.value.length &&
        !ORACLE_TYPES.includes(this.currentMetricType)
      ) {
        this.disabledMetricNameList = this.metricsList
          .filter((m) => ORACLE_TYPES.includes(m.type))
          .map((m) => m?.name);
      }

      if (this.metrics.value.length <= 5) {
        this.mySelections = this.metrics.value;
      } else {
        this.metrics.setValue(this.mySelections);
      }
    }, 0);
  }

  metricClickHandler(selected: boolean, metricType: string): void {
    // if (!selected) return;
    this.currentMetricType = metricType;
  }

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

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}