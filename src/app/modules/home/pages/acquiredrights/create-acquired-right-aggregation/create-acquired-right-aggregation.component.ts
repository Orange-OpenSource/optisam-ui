import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Observable, Subscription } from 'rxjs';
import { ProductService } from '@core/services/product.service';
import {
  AggregationProductObject,
  AcquiredRightAggregationBody,
} from '../acquired-rights.modal';
import { SharedService } from '@shared/shared.service';
import { FilterByWordPipe } from '../pipes/filter-by-word.pipe';
import { TopSectionComponent } from './form-parts/top-section/top-section.component';
import { ProductsStepComponent } from './form-parts/products-step/products-step.component';
import { LicenseStepComponent } from './form-parts/license-step/license-step.component';
import { MaintenanceStepComponent } from './form-parts/maintenance-step/maintenance-step.component';
import { CommentStepComponent } from './form-parts/comment-step/comment-step.component';
import { ContractStepComponent } from './form-parts/contract-step/contract-step.component';
import { TranslateService } from '@ngx-translate/core';
import { ISOFormat } from '@core/util/common.functions';

@Component({
  selector: 'app-create-acquired-right-aggregation',
  templateUrl: './create-acquired-right-aggregation.component.html',
  styleUrls: ['./create-acquired-right-aggregation.component.scss'],
})
export class CreateAcquiredRightAggregationComponent
  implements OnInit, AfterContentChecked, AfterContentInit
{
  @ViewChild(ContractStepComponent) contractStep: ContractStepComponent;
  @ViewChild(TopSectionComponent) topSection: TopSectionComponent;
  @ViewChild(ProductsStepComponent) productsStep: ProductsStepComponent;
  @ViewChild(LicenseStepComponent) licenseStep: LicenseStepComponent;
  @ViewChild(CommentStepComponent) commentStep: CommentStepComponent;
  @ViewChild(MaintenanceStepComponent)
  maintenanceStep: MaintenanceStepComponent;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  selectedFile: File;
  showActivityLogs$: Observable<boolean>;
  submitSub: Subscription;
  allowedInventoryFiles: string[] = [
    // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // 'application/vnd.ms-excel',
    'application/pdf',
  ];

  aggregationForm: FormGroup;
  productForm: FormGroup;
  productsForm: FormGroup;
  licenseForm: FormGroup;
  maintenanceForm: FormGroup;
  commentForm: FormGroup;
  contractForm: FormGroup;
  _createLoading: Boolean;
  errorMsg: any;
  actionSuccessful: Boolean;
  currentScope: string = localStorage.getItem('scope');
  displayProductsList: any[] = [];
  versionsList: string[] = [];
  filteredProductsList: any[];
  filteredVersionsList: string[];
  productNameList: AggregationProductObject[] = [];
  HTTPActivity: Boolean;
  loadingSubscription: Subscription;
  currentSelectedFile: string;
  currentMetricType: string;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data,
    private sharedService: SharedService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadingSubscription = this.sharedService
      .httpLoading()
      .subscribe((data) => {
        this.HTTPActivity = data;
      });
  }

  ngAfterContentChecked(): void {
    this.setFormGroups();
    this.cd.detectChanges();
  }

  ngAfterContentInit(): void {
    this.setFormGroups();
  }

  setFormGroups(): void {
    this.aggregationForm = this.topSection?.aggregationForm;
    this.contractForm = this.contractStep?.contractForm;
    // this.productsForm = this.productsStep?.productsForm;
    this.licenseForm = this.licenseStep?.licenseForm;
    this.maintenanceForm = this.maintenanceStep?.maintenanceForm;
    this.commentForm = this.commentStep?.commentForm;
  }

  get sku() {
    return this.aggregationForm.get('sku');
  }

  get repartition() {
    return this.aggregationForm.get('repartition');
  }

  get aggregationName(): FormControl {
    return this.aggregationForm.get('aggregationName') as FormControl;
  }

  get metric_name() {
    return this.licenseForm.get('metric_name');
  }

  get productsMetrics(): FormControl {
    return this.licenseForm.get('productsMetrics') as FormControl;
  }

  // get productsMetrics(): FormControl {
  //   return this.productsForm.get('productsMetrics') as FormControl;
  // }

  // get productsName(): FormControl {
  //   return this.productsForm.get('productsName') as FormControl;
  // }

  // get productsEditor(): FormControl {
  //   return this.productsForm.get('productsEditor') as FormControl;
  // }

  // get productsSwidtag(): FormControl {
  //   return this.productsForm.get('productsSwidtag') as FormControl;
  // }
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

  get file_name() {
    return this.commentForm.get('file_name');
  }

  get file_data() {
    return this.commentForm.get('file_data');
  }

  // get productDisabled(): boolean {
  //   return !!(
  //     this.HTTPActivity ||
  //     // this.productNameList?.length === 0 ||
  //     // !this.productsEditor.value ||
  //     // !(this.productsMetrics.value || []).length
  //   );
  // }

  // True if Mandatory fields for create are not filled
  get incompleteFormForCreate(): boolean {
    if (
      this.aggregationForm?.valid &&
      this.licenseForm?.valid &&
      this.maintenanceForm?.valid
    ) {
      // check if any modification done in maintenance form
      return false;
    }
    return true; // if skuForm, productForm or licenseForm is invalid
  }

  get incompleteMaintenanceForm(): boolean {
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
      this.aggregationForm?.pristine &&
      // this.productsForm?.pristine &&
      this.licenseForm?.pristine &&
      this.maintenanceForm?.pristine &&
      this.commentForm?.pristine
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
  createAcquiredRight(successMsg, errorMsg): void {
    this._createLoading = true;
    console.log('Test');
    const body: AcquiredRightAggregationBody = {
      ID: 0,
      sku: this.sku.value,
      repartition: this.repartition.value,
      // aggregation_name: this.aggregationName.value,
      metric_name: this.productsMetrics.value.map((d) => d.name).join(','),
      aggregationID: this.aggregationName.value,
      // product_editor: this.productsEditor.value,
      // metric_name: this.productsMetrics.value.join(','),
      // product_names: this.productsName.value,
      // swidtags: this.productsSwidtag.value.map((d) => d.swidtag),
      num_licenses_acquired: Number(this.licenses_acquired.value),
      avg_unit_price: Number(this.unit_price.value),
      start_of_maintenance: ISOFormat(this.startMaintenanceDate.value),
      end_of_maintenance: ISOFormat(this.endMaintenanceDate.value),
      num_licences_maintenance: Number(this.licenses_maintenance.value),
      avg_maintenance_unit_price: Number(this.maintenance_price.value),
      scope: localStorage.getItem('scope'),
      ordering_date: ISOFormat(this.contractForm.get('orderingDate').value),
      corporate_sourcing_contract: this.contractForm.get('csc').value,
      software_provider: this.contractForm.get('softwareProvider').value,
      comment: this.comment.value,
      last_purchased_order:
        this.maintenanceForm.get('lastPurchasedOrder').value,
      support_number: this.maintenanceForm.get('supportNumber').value,
      maintenance_provider: this.maintenanceForm.get('maintenanceProvider')
        .value,
      file_name: this.file_name.value,
      file_data: this.file_data.value,
    };

    console.log(body);

    this.productService.createAcquiredRightAggregation(body).subscribe(
      (res) => {
        if (res.success) {
          this.actionSuccessful = true;
          this.openModal(successMsg);
          this._createLoading = false;
        }
      },
      (err) => {
        this.actionSuccessful = false;
        this.errorMsg =
          err && err.error
            ? err.error.message
            : 'Some error occured! Aggregation could not be created.';
        this.openModal(errorMsg);
        this._createLoading = false;
      }
    );
  }

  // handleUpload(file)
  //  {
  //     const reader = new FileReader(); reader.readAsDataURL(file); reader.onload =
  //      () => { this.currentSelectedFile = reader.result.toString().split(",")[1];
  //      console.log(this.currentSelectedFile);

  //     };

  //    }

  // getBase64(file) { return new Promise((resolve, reject) => { const reader = new FileReader();
  //   reader.readAsDataURL(file); reader.onload = () => resolve(reader.result); reader.onerror = error => reject(error); }); }

  // Resets form
  resetForm(stepper: MatStepper) {
    stepper.reset();
    this.commentStep.resetInput();
    this.aggregationForm.reset();
    // this.productsForm.reset();
    this.licenseForm.reset();
    this.maintenanceForm.reset();
    this.commentForm.reset();
    // resest list used for autocomplete
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

  // resetHandler(): void {
  //   this.fileInput.nativeElement.value = '';
  //   this.selectedFile = null;
  //   this.errorMsg = '';
  //   if (this.submitSub) this.submitSub.unsubscribe();
  // }

  // onBrowseClickHandler(): void {
  //   this.resetHandler();
  //   this.fileInput.nativeElement.click();
  // }

  // deleteSelectedFile()
  // {
  //   this.selectedFile = null;
  //   console.log("Inside deleteSelected");
  // }
  // onFileChangeHandler(): void {
  //   this.selectedFile = this.fileInput.nativeElement.files[0];
  //   this.handleUpload(this.selectedFile);

  //   console.log(this.selectedFile);
  //   if (!this.allowedInventoryFiles.includes(this.selectedFile.type)) {
  //     this.resetHandler();
  //     this.translateService
  //       .stream('INVALID_FILE_TYPE')
  //       .subscribe((trans: string) => {
  //         this.errorMsg = trans;
  //       });
  //   }

  //   this.commentForm.markAsDirty();
  // }

  // setProductsForm(formGroup: FormGroup): void {
  //   this.productsForm = formGroup;
  // }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
