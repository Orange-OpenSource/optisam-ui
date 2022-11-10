import { SuccessDialogComponent } from './../dialog/success-dialog/success-dialog.component';
import {
  Component,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { EquipmentTypeManagementService } from '@core/services/equipmenttypemanagement.service';
import { ErrorDialogComponent } from '../dialog/error-dialog/error-dialog.component';
import { COMMON_REGEX } from '@core/util/constants/constants';
import { MetricService } from '@core/services';
import { ErrorResponse, Metric } from '@core/modals';
import { WarningAllocationChangeComponent } from './dialog/warning-allocation-change/warning-allocation-change.component';

@Component({
  selector: 'app-edit-metric-allocated',
  templateUrl: './edit-metric-allocated.component.html',
  styleUrls: ['./edit-metric-allocated.component.scss'],
})
export class EditMetricAllocatedComponent implements OnInit {
  groupForm: FormGroup;
  _loading: boolean;
  actionSuccessful: Boolean;
  errorMsg: any;
  @ViewChild('errorDialog') errorDialog: TemplateRef<HTMLElement>;
  metricList: string[] = [];
  filterMetrics: string[] = [
    'oracle.processor.standard',
    'oracle.nup.standard',
  ];

  constructor(
    private equipmentTypeManagementService: EquipmentTypeManagementService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<EditMetricAllocatedComponent>,
    private metricService: MetricService
  ) {}

  ngOnInit(): void {
    this.groupForm = new FormGroup({
      allocatedUser: new FormControl('', [
        Validators.pattern(new RegExp(COMMON_REGEX.ONLY_DIGITS)),
      ]),
      allocatedMetric: new FormControl(''),
    });
    this.setFormData();
    this.getMetricList();
  }

  setFormData() {
    if (this.data['datakey']) {
      this.allocatedUser.setValue(this.data['datakey'].allocatedUser);
      this.allocatedMetric.setValue(this.data['datakey'].allocatedMetric);
    }
  }

  get allocatedUser() {
    return this.groupForm.get('allocatedUser');
  }

  get allocatedMetric() {
    return this.groupForm.get('allocatedMetric');
  }

  get hasOneValue(): boolean {
    return Object.entries(this.groupForm.value).some(([key, value]) =>
      key === 'allocatedUser'
        ? Number(
            value.constructor.name === 'String'
              ? (value as String).trim()
              : value
          ) > -1 && (value as String) !== ''
        : Boolean(
            value.constructor.name === 'String'
              ? (value as String).trim()
              : value
          )
    );
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '30%',
      disableClose: true,
    });
    return dialogRef;
  }

  warningAllocationChange(): void {
    if (!this.hasOneValue) return;
    let dialog = this.openModal(WarningAllocationChangeComponent);
    dialog.afterClosed().subscribe((response: boolean) => {
      if (!response) return;
      this.updateAllocatedMetric();
    });
  }

  updateAllocatedMetric() {
    this._loading = true;
    this.groupForm.markAsPristine();
    const data = this.groupForm.value;
    data.equipmentUser = this.allocatedUser.value;
    data.allocatedMetric = this.allocatedMetric.value;

    // data.locale = this.data['datakey'].locale;
    const r = this.data['type'].find(({ ID }) => ID === this.data['equimId']);

    const body = {
      scope: localStorage.getItem('scope'),
      swidtag: this.data['datakey'].swidTag,
      equipment_id: this.data['typeId'],
      eq_type: r.type,
      equipment_user: Number(data.equipmentUser),
      allocated_metrics: data.allocatedMetric,
    };

    this.equipmentTypeManagementService.updateMetricAllocated(body).subscribe(
      (res) => {
        this.actionSuccessful = true;
        let dialog = this.openModal(SuccessDialogComponent);
        this._loading = false;
        dialog.afterClosed().subscribe(() => {
          this.dialogRef.close();
        });
      },
      (error: ErrorResponse) => {
        this.actionSuccessful = false;
        this.errorMsg = error?.message || 'UPDATE_USER_ERROR';
        this.dialog.open(ErrorDialogComponent, {
          width: '30%',
          disableClose: true,
          data: {
            error: this.errorMsg,
          },
        });
        this._loading = false;
      }
    );
  }

  resetGroup() {
    this.setFormData();
    this.groupForm.markAsPristine();
  }

  restrictNonDigitAndNegative(event: KeyboardEvent): void {
    const digitOnly: RegExp = new RegExp(COMMON_REGEX.DIGITS_WITH_NAV);
    const isBlock: boolean = event.key.match(digitOnly) === null;
    if (isBlock) {
      event.preventDefault();
      return;
    }
  }

  restrictPaste(e: ClipboardEvent) {
    e.preventDefault();
  }

  getMetricList(): void {
    this.metricService.getMetricList().subscribe(
      (res: { metrices: Metric[] }) => {
        this.metricList = res.metrices
          .filter((metric: Metric) => this.filterMetrics.includes(metric.type))
          .map((metric: Metric) => metric.name);
      },
      (error: ErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  ngOnDestroy() {
    // this.dialog.closeAll();
    // comment
  }
}
