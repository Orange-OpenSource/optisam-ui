import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { EquipmentTypeManagementService } from '@core/services/equipmenttypemanagement.service';
import { ProductService } from '@core/services/product.service';

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

  constructor(
    private equipmentTypeManagementService: EquipmentTypeManagementService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.groupForm = new FormGroup({
      equipmentUser: new FormControl({ value: '' }, []),
      allocatedMetric: new FormControl({ value: '' }, []),
    });
    this.setFormData();
  }

  setFormData() {
    console.log(this.data);
    // const test = this.data['type'].filter((e) =>
    //   e.includes(e.this.data['equimId'])
    // );
    // console.log(test);
    // const value = this.data['equimId'];
    // const result = this.data['type'].filter((x) => x.ID == value);

    // const r = this.data['type'].find(({ ID }) => ID === value);
    // console.log(result.type);
    // console.log(r.type);
    // console.log(this.data['datakey'].swidTag);
    // console.log(this.data['equimId']);
    // console.log(this.data['type']);

    if (this.data['datakey']) {
      this.equipmentUser.setValue(this.data['datakey'].equipmentUser);
      this.allocatedMetric.setValue(this.data['datakey'].allocatedMetric);
    }
  }

  get equipmentUser() {
    return this.groupForm.get('equipmentUser');
  }

  get allocatedMetric() {
    return this.groupForm.get('allocatedMetric');
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '30%',
      disableClose: true,
    });
  }

  updateAllocatedMetric(successMsg, errorMsg) {
    this._loading = true;
    this.groupForm.markAsPristine();
    const data = this.groupForm.value;
    data.equipmentUser = this.equipmentUser.value;
    data.allocatedMetric = this.allocatedMetric.value;

    // data.locale = this.data['datakey'].locale;
    const r = this.data['type'].find(({ ID }) => ID === this.data['equimId']);

    const body = {
      scope: localStorage.getItem('scope'),
      swidtag: this.data['datakey'].swidTag,
      equipment_id: this.data['typeId'],
      eq_type: r.type,
      equipment_user: data.equipmentUser,
      allocated_metrics: data.allocatedMetric,
    };
    this.equipmentTypeManagementService.updateMetricAllocated(body).subscribe(
      (res) => {
        this.actionSuccessful = true;
        this.openModal(successMsg);
        this._loading = false;
      },
      (error) => {
        this.actionSuccessful = false;
        this.errorMsg =
          error.error.message ||
          'Some error occured! User could not be updated';
        this.openModal(errorMsg);
        this._loading = false;
      }
    );
  }

  resetGroup() {
    this.setFormData();
    this.groupForm.markAsPristine();
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
