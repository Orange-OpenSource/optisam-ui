import {
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MetricService } from 'src/app/core/services/metric.service';
import { ProductService } from 'src/app/core/services/product.service';
import { Metric } from '@core/modals';
import { TranslateService } from '@ngx-translate/core';
import { ISOFormat } from '@core/util/common.functions';

@Component({
  selector: 'app-edit-acquired-right',
  templateUrl: './edit-acquired-right.component.html',
  styleUrls: ['./edit-acquired-right.component.scss'],
})
export class EditAcquiredRightComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  selectedFile: File;
  submitSub: Subscription;
  allowedInventoryFiles: string[] = [
    // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // 'application/vnd.ms-excel',
    'application/pdf',
  ];
  metricsList: Metric[];
  skuForm: FormGroup;
  productForm: FormGroup;
  updateSelectedFile: any;
  abc: any;
  contractForm: FormGroup;
  licenseForm: FormGroup;
  maintenanceForm: FormGroup;
  commentForm: FormGroup;
  _updateLoading: Boolean;
  selectedOldFile: File;
  errorMsg: any;
  actionSuccessful: Boolean;
  currentSelectedFile: string;
  fileName: any;
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
  ];
  private maintenancePriceValidation: any[] = [
    Validators.pattern(/^[0-9]+(\.[0-9]{1,2})*$/),
  ];
  currentMetricType: string;
  disabledMetricNameList: string[] = [];
  checkFile: Boolean;
  updateFile: Boolean;

  constructor(
    private metricService: MetricService,
    private productService: ProductService,
    private translateService: TranslateService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.listMetrics();
    this.listEditors();
    if (data.file_name) {
      this.checkFile = true;
    }
  }

  ngOnInit(): void {
    this.skuForm = new FormGroup({
      sku: new FormControl({ value: '', disabled: true }),
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
      lastPurchasedOrder: new FormControl(''),
      supportNumber: new FormControl(''),
      maintenanceProvider: new FormControl(''),
    });
    this.commentForm = new FormGroup({
      comment: new FormControl(''),
      file_name: new FormControl(''),
    });
    this.setFormData();
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
  }

  ngAfterViewInit(): void {
    console.log('after view Initi');
    // this.metricClickHandler(true, )
  }

  downloadFile() {
    // const filePath = file.error_file_api.slice(8);
    this.productService.getDownloadFile(this.data.SKU).subscribe(
      (res) => {
        console.log(res.file_data);

        const url = `data:application/pdf;base64,${res.file_data}`;

        const downloadEl = document.createElement('a');

        downloadEl.href = url;
        downloadEl.download = this.data.file_name;
        downloadEl.click();
      }
      // (error) => {
      //   this.errorMsg =
      //     error.error.message ||
      //     'Some error occured! Could not download records for selected global file';
      //   this.openModal(errorMsg);
      //   console.log('Some error occured! Could not download file.', error);
      // }
    );
  }

  // Get editors list
  listEditors() {
    const query = '?scopes=' + this.currentScope;
    this.productService.getDashboardEditorList(query).subscribe(
      (res) => {
        this.editorsList = res.editors || [];
        this.filteredEditorsList = this._filter(
          'editor',
          this.product_editor.value
        );
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
        this.filteredProductsList = this._filter(
          'product',
          this.product_name.value
        );
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
    this.filteredVersionsList = this._filter(
      'version',
      this.product_version.value
    );
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
        this.currentMetricType = this.metricsList.find(
          (m) => m.name === this.data.metric
        ).type;
        this.changed([]);
      },
      (err) => {
        console.log('Some error occured! Could not fetch metrics list.');
      }
    );
  }

  setFormData() {
    if (this.data) {
      this.sku.setValue(this.data.SKU);
      this.product_name.setValue(this.data.product_name);
      this.product_version.setValue(this.data.version);
      this.product_editor.setValue(this.data.editor);
      this.orderingDate.setValue(this.data.ordering_date);
      this.corporateSource.setValue(this.data.corporate_sourcing_contract);
      this.softwareProvider.setValue(this.data.software_provider);
      this.listProducts();
      this.listVersions();
      this.metrics.setValue((this.data.metric || '').split(','));
      this.licenses_acquired.setValue(this.data.acquired_licenses_number);
      this.unit_price.setValue(this.data.avg_licenes_unit_price);
      this.maintenance_price.setValue(this.data.avg_maintenance_unit_price);
      this.licenses_maintenance.setValue(
        this.data.licenses_under_maintenance_number
      );
      this.lastPurchasedOrder.setValue(this.data.last_purchased_order);
      this.supportNumber.setValue(this.data.support_number);
      this.maintenanceProvider.setValue(this.data.maintenance_provider);

      if (this.data.start_of_maintenance && this.data.end_of_maintenance) {
        this.startMaintenanceDate.setValue(this.data.start_of_maintenance);
        this.endMaintenanceDate.setValue(this.data.end_of_maintenance);
      }
      this.comment.setValue(this.data.comment);
      this.file_name.setValue(this.data.file_name);
      console.log(this.file_name);

      // this.selectedFile = this.fileInput.nativeElement.files[0];
      // console.log("New"+this.selectedFile);

      this.fileName = this.file_name.value || ' ';
      console.log(this.file_name.value);

      // this.abc.setValue(this.data.file_data.value);
      // console.log("filedata"+ this.data.file_data.value);
      console.log('filedata' + this.data.file_data);

      this.filteredEditorsList = this._filter(
        'editor',
        this.product_editor.value
      );
      this.filteredProductsList = this._filter(
        'product',
        this.product_name.value
      );
      this.filteredVersionsList = this._filter(
        'version',
        this.product_version.value
      );
    }
  }

  get sku() {
    return this.skuForm.get('sku');
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

  // True if Mandatory fields for update are not filled
  get incompleteFormForUpdate(): Boolean {
    if (
      // this.skuForm.valid &&
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
    const newStartDate = new Date(this.startMaintenanceDate.value);
    const startMaintenanceDate = new Date(
      newStartDate.getFullYear(),
      newStartDate.getMonth(),
      newStartDate.getDate()
    );
    const newEndDate = new Date(this.endMaintenanceDate.value);
    const endMaintenanceDate = new Date(
      newEndDate.getFullYear(),
      newEndDate.getMonth(),
      newEndDate.getDate()
    );
    if (startMaintenanceDate > endMaintenanceDate) {
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
  updateAcqRights(successMsg, errorMsg) {
    this._updateLoading = true;
    const body = {
      sku: this.sku.value,
      product_name: this.product_name.value,
      version: this.product_version.value,
      product_editor: this.product_editor.value,
      metric_name: this.metrics.value.join(','),
      num_licenses_acquired: Number(this.licenses_acquired.value),
      avg_unit_price: Number(this.unit_price.value),
      start_of_maintenance: ISOFormat(this.startMaintenanceDate.value),
      end_of_maintenance: ISOFormat(this.endMaintenanceDate.value),
      num_licences_maintainance: Number(this.licenses_maintenance.value),
      avg_maintenance_unit_price: Number(this.maintenance_price.value),
      scope: localStorage.getItem('scope'),
      comment: this.comment.value,
      file_name: this.file_name.value,
      ordering_date: ISOFormat(this.orderingDate.value),
      corporate_sourcing_contract: this.corporateSource.value,
      software_provider: this.softwareProvider.value,
      last_purchased_order: this.lastPurchasedOrder.value,
      support_number: this.supportNumber.value,
      maintenance_provider: this.maintenanceProvider.value,
      file_data: this.currentSelectedFile,
    };
    this.productService.updateAcqRights(body).subscribe(
      (res) => {
        this.actionSuccessful = true;
        this.openModal(successMsg);
        this._updateLoading = false;
      },
      (err) => {
        this.actionSuccessful = false;
        this.errorMsg =
          err && err.error
            ? err.error.message
            : 'Some error occured! Acquired Right could not be created.';
        this.openModal(errorMsg);
        this._updateLoading = false;
      }
    );
  }

  // Resets form
  resetForm(stepper: MatStepper) {
    stepper.reset();
    this.setFormData();
    this.updateFile = false;
    this.checkFile = true;
  }

  changed(values: string[]) {
    setTimeout(() => {
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
          .map((m) => m.name.toString());
      }

      if (
        this.metrics.value.length &&
        !ORACLE_TYPES.includes(this.currentMetricType)
      ) {
        this.disabledMetricNameList = this.metricsList
          .filter((m) => ORACLE_TYPES.includes(m.type))
          .map((m) => m.name.toString());
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

  handleUpload(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.currentSelectedFile = reader.result.toString().split(',')[1];
      console.log(this.currentSelectedFile);
    };
  }

  deleteSelectedFile() {
    this.updateSelectedFile = null;
    this.checkFile = false;
    this.selectedFile = null;
    this.file_name.setValue('');

    this.currentSelectedFile = '';
    this.commentForm.markAsDirty();
    console.log('Inside deleteSelected');
  }

  deleteUpdatedFile() {
    this.selectedFile = null;
    this.file_name.setValue('');
    this.currentSelectedFile = '';
    this.updateFile = false;
    this.commentForm.markAsDirty();
    console.log('Inside updatedSelected');
  }
  onFileChangeHandler(): void {
    this.selectedFile = this.fileInput.nativeElement.files[0];

    if (!this.allowedInventoryFiles.includes(this.selectedFile.type)) {
      console.log('Hello');
      this.commentForm.markAsPristine();
      return;
    }
    this.handleUpload(this.selectedFile);
    this.fileName = this.selectedFile.name;
    this.file_name.setValue(this.fileName);
    console.log(this.selectedFile.name);
    if (!this.allowedInventoryFiles.includes(this.selectedFile.type)) {
      this.resetHandler();
      this.translateService
        .stream('INVALID_FILE_TYPE')
        .subscribe((trans: string) => {
          this.errorMsg = trans;
        });
    }

    this.commentForm.markAsDirty();

    this.checkFile = false;
    this.updateFile = true;
  }

  // Shows creation success/error
  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '30%',
      disableClose: true,
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
