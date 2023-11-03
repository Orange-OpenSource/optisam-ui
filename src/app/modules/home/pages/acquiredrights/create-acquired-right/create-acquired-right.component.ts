import { ValidatorFn, ValidationErrors, AbstractControl, Form } from '@angular/forms';
import { SubSink } from 'subsink';
import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { map } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MetricService } from 'src/app/core/services/metric.service';
import { ProductService } from 'src/app/core/services/product.service';
import { ISOFormat, metricCompare, supportNumberMax } from '@core/util/common.functions';
import {
  DashboardEditorListParams,
  DashboardEditorListResponse,
  ErrorResponse,
  ListProductQueryParams,
  ProductListResponse,
  Metric,
} from '@core/modals';
import { MatSelect } from '@angular/material/select';
import { MatOptionSelectionChange } from '@angular/material/core';
import { METRIC_SELECTION_ALLOWED_LIMIT, METRIC_TYPE_LIST_FOR_COST_OPTIMIZATION, TYPES_DISABLED_LIST } from '@core/util/constants/constants';



@Component({
  selector: 'app-create-acquired-right',
  templateUrl: './create-acquired-right.component.html',
  styleUrls: ['./create-acquired-right.component.scss'],
})
export class CreateAcquiredRightComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  @ViewChild('metrics', { static: true }) metricEl: MatSelect;
  selectedFile: File;
  showActivityLogs$: Observable<boolean>;
  submitSub: Subscription;
  allowedInventoryFiles: string[] = [
    // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // 'application/vnd.ms-excel',
    'application/pdf',
  ];
  metricsList: Metric[] = [];
  skuForm: FormGroup;
  productForm: FormGroup;
  contractForm: FormGroup;
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
  selectedFiles: File[] = [];
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
  temporarydisabledMetricList: string[] = [];
  currentMetricType: string;
  currentSelectedFile: string;
  checkFile: boolean;
  isCostOptimizationVisible: boolean = false;
  subs: SubSink = new SubSink();

  constructor(
    private metricService: MetricService,
    private productService: ProductService,
    private translateService: TranslateService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.listMetrics();
    this.listEditors();
  }

  ngOnInit(): void {
    this.initForm();
    this.checkFile = true;
    // Filter autocomplete options for 'Editor'
    this.subs.add(
      this.product_editor.valueChanges
        .pipe(map((value) => this._filter('editor', value)))
        .subscribe((res) => {
          this.filteredEditorsList = res.sort();
          this.filteredProductsList = [];
        })
    );
    // Filter autocomplete options for 'Product'
    this.subs.add(
      this.product_name.valueChanges
        .pipe(map((value) => this._filter('product', value)))
        .subscribe((res) => {
          this.filteredProductsList = res;
          this.filteredVersionsList = [];
        })
    );
    // Filter autocomplete options for 'Version'
    this.subs.add(
      this.product_version.valueChanges
        .pipe(map((value) => this._filter('version', value)))
        .subscribe((res) => {
          this.filteredVersionsList = res;
        })
    );

    this.subs.add(
      this.maintenanceForm.valueChanges.subscribe((data) => {
        if (this.startMaintenanceDate.value) {
        }
      })
    );

    this.subs.add(
      this.productService
        .isCostOptimizationVisible()
        .subscribe((status: boolean) => {
          this.isCostOptimizationVisible = status;
        })
    );
  }

  ngAfterViewInit(): void {
    this.subs.add(
      this.metricEl.optionSelectionChanges.subscribe((option: MatOptionSelectionChange) => {
        this.productService.metricOptionsChange.call(this, option)
      })
    )
  }


  // Get editors list
  listEditors() {
    const param: DashboardEditorListParams = {
      scopes: this.currentScope,
    };
    this.productService.getDashboardEditorList(param).subscribe(
      (res: DashboardEditorListResponse) => {
        this.editorsList = res.editors || [];
        this.filteredEditorsList = this.editorsList.sort();
      },
      (err: ErrorResponse) => {
        console.log('Some error occured! Could not fetch editors list.');
      }
    );
  }

  // Get products list
  listProducts() {
    // const query =
    //   '?scopes=' + this.currentScope + '&editor=' + this.product_editor.value;

    const query: ListProductQueryParams = {
      scopes: this.currentScope,
      editor: this.product_editor.value,
    };
    this.productService.getProductList(query).subscribe(
      (res: ProductListResponse) => {
        this.productsList = res.products || [];
        this.displayProductsList = [
          ...new Set(this.productsList.map((prod) => prod.name)),
        ];
        this.filteredProductsList = this.displayProductsList;
      },
      (err: ErrorResponse) => {
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

    this.contractForm = new FormGroup({
      orderingDate: new FormControl(null),
      corporateSource: new FormControl(''),
      softwareProvider: new FormControl(''),
    });

    this.productForm = new FormGroup({
      // Product Name, Version, Editor: Allow all characters except _ & allow just one space between words only
      product_name: new FormControl('', [
        Validators.required,
        // Validators.pattern(/^\S+(?: \S+)*$/),
        // this.validatePattern,
      ]),
      product_version: new FormControl('', [
        Validators.pattern(/^\S+(?: \S+)*$/),
        // this.validatePattern,
      ]),
      product_editor: new FormControl('', [
        Validators.required,
        // Validators.pattern(/^\S+(?: \S+)*$/),
        // this.validatePattern,
      ]),
      metrics: new FormControl([], [Validators.required]),
      repartition: new FormControl(false),
    });
    this.licenseForm = new FormGroup({
      licenses_acquired: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]*$/),
      ]),
      unit_price: new FormControl(null, [
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
      lastPurchasedOrder: new FormControl(''),
      supportNumber: new FormControl('', [supportNumberMax(16)]),
      maintenanceProvider: new FormControl(''),
    });
    this.commentForm = new FormGroup({
      comment: new FormControl(''),
      file_name: new FormControl(''),
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
  get repartition() {
    return this.productForm.get('repartition');
  }
  get orderingDate() {
    return this.contractForm.get('orderingDate');
  }
  get corporateSource() {
    return this.contractForm.get('corporateSource');
  }
  get softwareProvider() {
    return this.contractForm.get('softwareProvider');
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
  get metrics(): FormControl {
    return this.productForm.get('metrics') as FormControl;
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
  get lastPurchasedOrder() {
    return this.maintenanceForm.get('lastPurchasedOrder');
  }
  get supportNumber() {
    return this.maintenanceForm.get('supportNumber');
  }
  get maintenanceProvider() {
    return this.maintenanceForm.get('maintenanceProvider');
  }
  get file_name() {
    return this.commentForm.get('file_name');
  }
  get comment() {
    return this.commentForm.get('comment');
  }

  get file_data() {
    return this.selectedFile;
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

  // private supportNumberValidation(number: number): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const supportNumbers: string = control.value;
  //     const supportNumberArray = supportNumbers.split(',');
  //     const isValid: boolean = supportNumberArray.every((num: string) => num.length <= number);
  //     if (!isValid) {
  //       return <ValidationErrors>{
  //         maxSupportLength: {
  //           requiredLength: number,
  //           index: supportNumberArray.findIndex((num: string) => (num.length > number)) + 1
  //         }
  //       }
  //     }
  //     return null;
  //   }
  // }


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
      this.contractForm.valid &&
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
      this.contractForm.pristine &&
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
      repartition: this.isCostOptimizationVisible
        ? this.repartition.value
        : false,
      product_name: this.product_name.value,
      version: this.product_version.value,
      product_editor: this.product_editor.value,
      metric_name: this.metrics.value.map((m: Metric) => m.name).join(','),
      num_licenses_acquired: Number(this.licenses_acquired.value),
      avg_unit_price: Number(this.unit_price.value),
      start_of_maintenance: ISOFormat(this.startMaintenanceDate.value),
      end_of_maintenance: ISOFormat(this.endMaintenanceDate.value),
      num_licences_maintainance: Number(this.licenses_maintenance.value),
      avg_maintenance_unit_price: Number(this.maintenance_price.value),
      scope: localStorage.getItem('scope'),
      comment: this.comment.value,
      ordering_date: ISOFormat(this.orderingDate.value),
      corporate_sourcing_contract: this.corporateSource.value,
      software_provider: this.softwareProvider.value,
      last_purchased_order: this.lastPurchasedOrder.value,
      support_number: this.supportNumber.value,
      maintenance_provider: this.maintenanceProvider.value,
      file_name: this.file_name.value,
      file_data: this.currentSelectedFile,
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

  handleUpload(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.currentSelectedFile = reader.result.toString().split(',')[1];
      console.log(this.currentSelectedFile);
    };
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  // Resets form
  resetForm(stepper: MatStepper) {
    stepper.reset();
    this.contractForm.reset();
    this.skuForm.reset();
    this.productForm.reset();
    this.licenseForm.reset();
    this.maintenanceForm.reset();
    this.commentForm.reset();
    this.selectedFile = null;
    this.checkFile = false;
    // resest list used for autocomplete
    this.filteredEditorsList = this.editorsList.sort();
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


  get metricCompare(): Function {
    return metricCompare;
  }



  enableCostOptimization(): void {
    const metricTypeList = (this.metrics.value || []).map((m: Metric) => m.type);
    // Check for enabling cost optimization for METRIC_TYPE_LIST_FOR_COST_OPTIMIZATION
    if (!metricTypeList.length) {
      // disable cost optimization
      this.productService.hideCostOptimization();
      return;
    }

    // enable cost optimization
    if (
      metricTypeList.every((type: string) =>
        METRIC_TYPE_LIST_FOR_COST_OPTIMIZATION.includes(type)
      )
    ) {
      this.productService.showCostOptimization();
      return;
    }

    this.productService.hideCostOptimization();
  }

  metricClickHandler(selected: boolean, metricType: string): void {
    // if (!selected) return;
    if (this.metrics.value.length <= METRIC_SELECTION_ALLOWED_LIMIT)
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
  resetHandler(): void {
    this.fileInput.nativeElement.value = '';
    this.selectedFile = null;
    this.errorMsg = '';
    if (this.submitSub) this.submitSub.unsubscribe();
  }

  onBrowseClickHandler(): void {
    this.resetHandler();
    this.fileInput.nativeElement.click();
  }

  deleteSelectedFile() {
    this.selectedFile = null;
    console.log('Inside deleteSelected');
  }

  onFileChangeHandler(): void {
    this.selectedFile = this.fileInput.nativeElement.files[0];
    this.commentForm.patchValue({ file_name: this.selectedFile.name });
    this.handleUpload(this.selectedFile);

    console.log(this.selectedFile);
    if (!this.allowedInventoryFiles.includes(this.selectedFile.type)) {
      this.resetHandler();
      this.translateService
        .stream('INVALID_FILE_TYPE')
        .subscribe((trans: string) => {
          this.errorMsg = trans;
        });
    }

    this.commentForm.markAsDirty();
  }

  ngOnDestroy() {
    this.dialog.closeAll();
    this.subs.unsubscribe();
  }
}
