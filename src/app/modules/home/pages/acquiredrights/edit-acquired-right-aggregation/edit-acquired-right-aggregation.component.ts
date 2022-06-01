import {
  Component,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Subscription, Observable } from 'rxjs';
import { ProductService } from '@core/services/product.service';
import {
  AggregationProductObject,
  AcquiredRightAggregationBody,
} from '../acquired-rights.modal';
import { SharedService } from '@shared/shared.service';
import { FilterByWordPipe } from '../pipes/filter-by-word.pipe';
import { CommonService } from '@core/services/common.service';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { EditTopSectionComponent } from './form-parts/edit-top-section/edit-top-section.component';
import { EditContractStepComponent } from './form-parts/edit-contract-step/edit-contract-step.component';
import { Aggregation } from '@core/modals';
import { EditLicenseStepComponent } from './form-parts/edit-license-step/edit-license-step.component';
import { EditMaintenanceStepComponent } from './form-parts/edit-maintenance-step/edit-maintenance-step.component';
import { EditCommentStepComponent } from './form-parts/edit-comment-step/edit-comment-step.component';
import { ISOFormat } from '@core/util/common.functions';

@Component({
  selector: 'app-edit-acquired-right-aggregation',
  templateUrl: './edit-acquired-right-aggregation.component.html',
  styleUrls: ['./edit-acquired-right-aggregation.component.scss'],
})
export class EditAcquiredRightAggregationComponent
  implements OnInit, AfterContentChecked
{
  @ViewChild('errorDialog') errorDialog: TemplateRef<HTMLElement>;
  @ViewChild(EditTopSectionComponent) editTopSection: EditTopSectionComponent;
  @ViewChild(EditContractStepComponent)
  editContractStep: EditContractStepComponent;
  @ViewChild(EditLicenseStepComponent)
  editLicenseStep: EditLicenseStepComponent;
  @ViewChild(EditMaintenanceStepComponent)
  editMaintenanceStep: EditMaintenanceStepComponent;
  @ViewChild(EditCommentStepComponent)
  editCommentStep: EditCommentStepComponent;
  metricsList: any[] = [];
  aggregationForm: FormGroup;
  licenseForm: FormGroup;
  maintenanceForm: FormGroup;
  commentForm: FormGroup;
  contractForm: FormGroup;
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
  loading: boolean = false;
  private setLoad: any = {};

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Aggregation,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private cs: CommonService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.productService.setAggregationData(this.data);
  }

  ngAfterContentChecked(): void {
    this.setFormGroup();
    this.cd.detectChanges();
  }

  private setFormGroup(): void {
    this.aggregationForm = this.editTopSection?.aggregationForm;
    this.contractForm = this.editContractStep?.contractForm;
    this.licenseForm = this.editLicenseStep?.licenseForm;
    this.maintenanceForm = this.editMaintenanceStep?.maintenanceForm;
    this.commentForm = this.editCommentStep?.commentForm;
  }

  // Initialize form
  initForm() {
    this.loadingSubscription = this.sharedService
      .httpLoading()
      .subscribe((data) => {
        this.HTTPActivity = data;
      });
  }

  get sku() {
    return this.aggregationForm?.get('sku');
  }

  get aggregationName(): FormControl {
    return this.aggregationForm?.get('aggregationName') as FormControl;
  }

  get licenses_acquired() {
    return this.licenseForm?.get('licenses_acquired');
  }

  get unit_price() {
    return this.licenseForm?.get('unit_price');
  }

  get startMaintenanceDate() {
    return this.maintenanceForm?.get('startMaintenanceDate');
  }

  get endMaintenanceDate() {
    return this.maintenanceForm?.get('endMaintenanceDate');
  }

  get licenses_maintenance() {
    return this.maintenanceForm?.get('licenses_maintenance');
  }

  get maintenance_price() {
    return this.maintenanceForm?.get('maintenance_price');
  }

  get comment() {
    return this.commentForm?.get('comment');
  }

  get file_name() {
    return this.commentForm?.get('file_name');
  }

  get file_data() {
    return this.commentForm?.get('file_data');
  }

  get productsMetrics(): FormControl {
    return this.licenseForm?.get('productsMetrics') as FormControl;
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

  get isDateExist(): boolean {
    return !!this.data.start_of_maintenance && !!this.data.end_of_maintenance;
  }

  get isAllLoaded(): boolean {
    return !Object.values(this.setLoad).every((b) => b === false);
  }

  // True if Mandatory fields for create are not filled
  get incompleteFormForCreate(): boolean {
    if (this.licenseForm?.valid && this.maintenanceForm?.valid) {
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
      !!this.contractForm?.pristine &&
      !!this.licenseForm?.pristine &&
      !!this.maintenanceForm?.pristine &&
      !!this.commentForm?.pristine &&
      !!this.aggregationForm?.pristine
    );
  }

  //check for disabled update button
  get isUpdateDisabled(): boolean {
    return (
      this.isPristine || this.incompleteFormForCreate || this._updateLoading
    );
  }

  // Send create request for new acquired right
  updateAcquiredRightAggregation(successMsg, errorMsg): void {
    this._updateLoading = true;
    const body: AcquiredRightAggregationBody = {
      sku: this.data.sku,
      aggregationID: this.aggregationName.value,
      metric_name: this.productsMetrics.value.map((p) => p.name).join(','),
      num_licenses_acquired: Number(this.licenses_acquired.value),
      avg_unit_price: Number(this.unit_price.value),
      start_of_maintenance: ISOFormat(this.startMaintenanceDate.value),
      end_of_maintenance: ISOFormat(this.endMaintenanceDate.value),
      num_licences_maintenance: Number(this.licenses_maintenance.value),
      avg_maintenance_unit_price: Number(this.maintenance_price.value),
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
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

    this.productService
      .updateAcquiredRightAggregation(this.data.sku, body)
      .subscribe(
        (res) => {
          console.log('Update filedata', this.file_data);
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
    console.log(this.commentForm.value);
    stepper.reset();
    this.editCommentStep.resetInput();
    // this.aggregationForm.reset();
    // this.licenseForm.reset();
    // this.maintenanceForm.reset();
    // this.commentForm.reset();
    // this.productService.setAggregationData(this.data);
    console.log(this.commentForm.value);
    this.commentForm.reset();
    console.log(this.commentForm.value);
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

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
