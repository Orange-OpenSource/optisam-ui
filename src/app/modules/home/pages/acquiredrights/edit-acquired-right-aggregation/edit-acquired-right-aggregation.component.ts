import {
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { MatSelectChange } from '@angular/material/select';
import { map, debounceTime, tap } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { MetricService } from '@core/services/metric.service';
import { ProductService } from '@core/services/product.service';
import {
  AggregationEditorParams,
  AggregationProductsParams,
  AggregationProductListResponse,
  AggregationProductObject,
  AcquiredRightAggregationBody,
  AcquiredRightAggregationUpdateParams,
} from '../acquired-rights.modal';
import { SharedService } from '@shared/shared.service';
import { UniqueProductPipe } from '../unique-product.pipe';
import { FilterByWordPipe } from '../pipes/filter-by-word.pipe';
import { CommonService } from '@core/services/common.service';
import { LOCAL_KEYS } from '@core/util/constants';

@Component({
  selector: 'app-edit-acquired-right-aggregation',
  templateUrl: './edit-acquired-right-aggregation.component.html',
  styleUrls: ['./edit-acquired-right-aggregation.component.scss'],
})
export class EditAcquiredRightAggregationComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  metricsList: any[] = [];
  aggregationForm: FormGroup;
  productForm: FormGroup;
  productsForm: FormGroup;
  licenseForm: FormGroup;
  maintenanceForm: FormGroup;
  commentForm: FormGroup;
  _updateLoading: boolean = false;
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
  userSelectedMetrics: string[];
  productNameList: AggregationProductObject[] = [];
  HTTPActivity: Boolean;
  loadingSubscription: Subscription;
  selectedSwidList: any[] = [];
  swidList: any[] = [];
  disabledMetricNameList: string[] = [];
  currentMetricType: string;
  private oracleTypes: string[] = [
    'oracle.nup.standard',
    'oracle.processor.standard',
  ];
  private defaultEditor: string;

  constructor(
    private metricService: MetricService,
    private productService: ProductService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private cs: CommonService
  ) {}

  ngOnInit(): void {
    this.listMetrics();
    this.listEditors();
    this.productsEditorList();
    this.initForm();
    this.setDefaultEditor();
    this.checkForProductName();
    this.fetchLatestProducts(true);

    this.maintenanceForm.valueChanges.subscribe((data) => {
      if (this.startMaintenanceDate.value) {
        // console.log(this.startMaintenanceDate.value.toISOString());
        // console.log(this.startMaintenanceDate.value);
        // console.log(new Date(this.startMaintenanceDate.value.toISOString()));
        // console.log('---new line---');
      }
    });
  }

  ngAfterViewInit(): void {
    // console.log(this.productNameList);
  }

  ngAfterViewChecked(): void {}

  private licensesMaintenanceValidation: any[] = [
    Validators.pattern(/^[0-9]*$/),
    // Validators.min(1),
  ];
  private maintenancePriceValidation: any[] = [
    Validators.pattern(/^[0-9]+(\.[0-9]{1,2})*$/),
  ];

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
      '?scopes=' + this.currentScope + '&editor=' + this.productsEditor.value;
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

  listMetrics() {
    this.metricService.getMetricList().subscribe(
      (res) => {
        this.metricsList = res.metrices.sort((a, b) => {
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          return 0;
        });
        if (this.data?.metric_name) {
          // taking the the last metric name and fetching it's type and setting it to the currentMetricType
          this.currentMetricType = this.metricsList.find(
            (metric) =>
              metric.name === (this.data.metric_name || '').split(',').pop()
          )?.type;
          if (this.currentMetricType) this.changed();
        }
      },
      (err) => {
        console.log('Some error occured! Could not fetch metrics list.');
      }
    );
  }

  // Initialize form
  initForm() {
    this.loadingSubscription = this.sharedService
      .httpLoading()
      .subscribe((data) => {
        this.HTTPActivity = data;
      });

    this.aggregationForm = this.fb.group({
      sku: this.fb.control({ value: this.data.sku, disabled: true }, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9_.]*$/),
      ]),
      aggregationName: this.fb.control(
        { value: this.data.aggregation_name, disabled: true },
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9_.]*$/)]
      ),
    });

    this.productsForm = new FormGroup({
      productsEditor: new FormControl('', [Validators.required]),
      productsName: new FormControl('', [Validators.required]),
      productsMetrics: new FormControl('', [Validators.required]),
      productsSwidtag: new FormControl([], [Validators.required]),
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

    this.setFormData();

    // if (this.data) {
    //   this.productsName.setValue(this.data.product_name);
    //   this.productsName.disable();
    //   this.productsEditor.setValue(this.data.editor);
    //   this.productsEditor.disable();
    //   this.listProducts();
    // }
  }

  setFormData() {
    if (this.data) {
      this.aggregationForm.setValue({
        aggregationName: this.data.aggregation_name,
        sku: this.data.sku,
      });

      this.productsForm.setValue({
        productsEditor: this.data.product_editor,
        productsName: this.data.product_names,
        productsMetrics: (this.data.metric_name || '').split(','),
        productsSwidtag: this.data.swidtags,
      });

      console.log('data', this.data);

      this.licenseForm.setValue({
        licenses_acquired: this.data.num_licenses_acquired,
        unit_price: this.data.avg_unit_price,
      });

      this.maintenanceForm.setValue({
        licenses_maintenance: this.data.num_licences_maintainance,
        maintenance_price: this.data.avg_maintenance_unit_price,
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

      console.log('isDateExist', this.isDateExist);

      this.commentForm.setValue({ comment: this.data.comment });
    }
  }

  get sku() {
    return this.aggregationForm.get('sku');
  }

  get aggregationName(): FormControl {
    return this.aggregationForm.get('aggregationName') as FormControl;
  }

  get productsMetrics(): FormControl {
    return this.productsForm.get('productsMetrics') as FormControl;
  }

  get productsName(): FormControl {
    return this.productsForm.get('productsName') as FormControl;
  }

  get productsEditor(): FormControl {
    return this.productsForm.get('productsEditor') as FormControl;
  }

  get productsSwidtag(): FormControl {
    return this.productsForm.get('productsSwidtag') as FormControl;
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

  get productDisabled(): boolean {
    return !!(
      this.HTTPActivity ||
      this.productNameList?.length === 0 ||
      !this.productsEditor.value ||
      !(this.productsMetrics.value || []).length
    );
  }

  get fetchProductsStatus(): boolean {
    return (
      (this.productsMetrics.value || []).length && this.productsEditor.value
    );
  }

  get isDateExist(): boolean {
    return this.data.start_of_maintenance && this.data.end_of_maintenance;
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
  get incompleteFormForCreate(): boolean {
    if (
      this.aggregationForm.valid &&
      this.productsForm.valid &&
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
  get isPristine(): boolean {
    return (
      this.aggregationForm.pristine &&
      this.productsForm.pristine &&
      this.licenseForm.pristine &&
      this.maintenanceForm.pristine &&
      this.commentForm.pristine
    );
  }

  //check for disabled update button
  get isUpdateDisabled(): boolean {
    return (
      (this.isPristine && this.incompleteFormForCreate) || this._updateLoading
    );
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
  updateAcquiredRightAggregation(successMsg, errorMsg): void {
    this._updateLoading = true;
    const body: AcquiredRightAggregationBody = {
      ID: this.data.ID,
      sku: this.sku.value,
      aggregation_name: this.aggregationName.value,
      product_editor: this.productsEditor.value,
      metric_name: this.productsMetrics.value.join(','),
      product_names: this.productsName.value,
      swidtags: this.productsSwidtag.value.map((d) => d.swidtag),
      num_licenses_acquired: Number(this.licenses_acquired.value),
      avg_unit_price: Number(this.unit_price.value),
      start_of_maintenance: this.startMaintenanceDate.value,
      end_of_maintenance: this.endMaintenanceDate.value,
      num_licences_maintainance: Number(this.licenses_maintenance.value),
      avg_maintenance_unit_price: Number(this.maintenance_price.value),
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      comment: this.comment.value,
    };

    this.productService
      .updateAcquiredRightAggregation(this.data.ID, body)
      .subscribe(
        (res) => {
          if (res.success) {
            this.actionSuccessful = true;
            this.openModal(successMsg);
            this._updateLoading = false;
          }
        },
        (err) => {
          this.actionSuccessful = false;
          this.errorMsg =
            err && err.error
              ? err.error.message
              : 'Some error occured! Aggregation could not be updated.';
          this.openModal(errorMsg);
          this._updateLoading = false;
        }
      );
  }

  // Resets form
  resetForm(stepper: MatStepper) {
    stepper.reset();
    this.aggregationForm.reset();
    this.productsForm.reset();
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

  changed(values: string[] = []) {
    setTimeout(() => {
      if (!this.productsMetrics.value.length) this.disabledMetricNameList = [];
      // condition for if metric type is in the oracle block list-- this.oracleTypes
      if (
        this.productsMetrics.value.length &&
        this.oracleTypes.includes(this.currentMetricType)
      ) {
        const selectedMetricName =
          this.productsMetrics.value[this.productsMetrics.value.length - 1];
        this.disabledMetricNameList = this.metricsList
          .filter(
            (m) =>
              m.type !== this.currentMetricType || m.name !== selectedMetricName
          )
          .map((m) => m.name);
      }

      if (
        this.productsMetrics.value.length &&
        !this.oracleTypes.includes(this.currentMetricType)
      ) {
        this.disabledMetricNameList = this.metricsList
          .filter((m) => this.oracleTypes.includes(m.type))
          .map((m) => m?.name);
      }

      if (this.productsMetrics.value.length <= 5) {
        this.userSelectedMetrics = this.productsMetrics.value;
      } else {
        this.productsMetrics.setValue(this.userSelectedMetrics);
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

  productsEditorList(): void {
    const params: AggregationEditorParams = {
      scope: this.currentScope,
    };
    this.productService.getProductsEditorList(params).subscribe(
      (res) => (this.editorsList = res.editor),
      (err) => console.log('Some error occured! Could not fetch products list.')
    );
  }

  checkForProductName(): void {
    this.productsEditor.valueChanges
      .pipe(tap(() => this.resetProductsName()))
      .subscribe(() => this.fetchLatestProducts());

    this.productsMetrics.valueChanges.subscribe(() =>
      this.fetchLatestProducts()
    );
  }

  private resetProductsName(): void {
    this.productsName.patchValue('');
    this.productsName.markAsDirty();
  }

  fetchLatestProducts(customCall: boolean = false): void {
    if (!this.fetchProductsStatus) {
      this.productsName.setValue('');
      return;
    }

    const params: AggregationProductsParams = {
      metric: this.productsMetrics.value.join(','),
      editor: this.productsEditor.value,
      scope: this.currentScope,
      ID: this.data.ID,
    };

    this.productService
      .getProductListAggr(params)
      .subscribe((res: AggregationProductListResponse) => {
        this.productsName.setValue('');
        this.productNameList = res.aggrights_products || [];
        console.log('this.defaultEditor', this.defaultEditor);
        console.log('this.productsEditor.value', this.productsEditor.value);
        const selectedProducts =
          this.defaultEditor === this.productsEditor.value
            ? res.selected_products
            : [];
        this.productNameList = [
          ...this.productNameList,
          ...selectedProducts,
        ].sort((a, b) =>
          a.product_name > b.product_name
            ? 1
            : b.product_name > a.product_name
            ? -1
            : 0
        );

        if (customCall) {
          this.productsName.setValue(this.data.product_names);
          this.productSelectionChanged(true);
        }
      }, console.log);
  }

  productSelectionChanged(filter: boolean = false): void {
    this.selectedSwidList = [];
    this.swidList = [];

    if (filter) {
      this.swidList = this.productNameList.filter(
        (res: AggregationProductObject) =>
          (this.productsName.value || []).includes(res.product_name) &&
          !this.data.swidtags.includes(res.swidtag)
      );
      this.selectedSwidList = this.productNameList.filter(
        (res: AggregationProductObject) =>
          this.data.swidtags.includes(res.swidtag)
      );
      this.productsSwidtag.setValue(this.selectedSwidList);
      return;
    }

    this.productsSwidtag.setValue(this.selectedSwidList);
    this.swidList = this.productNameList.filter(
      (res: AggregationProductObject) =>
        (this.productsName.value || []).includes(res.product_name)
    );
    console.log('data', this.data);
  }

  selectAllSwid(checked: boolean): void {
    if (checked) {
      this.selectedSwidList = [
        ...new Set([...this.selectedSwidList, ...this.swidList]),
      ];
      this.productsSwidtag.setValue(this.selectedSwidList);
      this.swidList = [];
    }
  }

  addSwidTag(swid: any, index: number) {
    this.swidList.splice(index, 1);
    this.selectedSwidList.push(swid);
    this.productsSwidtag.setValue(this.selectedSwidList);
    this.productsForm.markAsDirty();
  }

  removeSwidTag(swid: any, index: number) {
    this.selectedSwidList.splice(index, 1);
    this.swidList.push(swid);
    this.productsSwidtag.setValue(this.selectedSwidList);
    this.productsForm.markAsDirty();
  }

  setDefaultEditor(): void {
    this.defaultEditor = this.data.product_editor;
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
