import { Component, OnInit, Inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormControlName,
} from '@angular/forms';
import { GroupService } from 'src/app/core/services/group.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { GroupComplianceAddParams } from '@core/modals';
import { CommonService } from '@core/services';
import { LOCAL_KEYS } from '@core/util/constants/constants';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent implements OnInit {
  groupForm: FormGroup;
  _loading: Boolean;
  errorMsg: any;
  actionSuccessful: Boolean;
  role: string;
  isSuperAdmin: boolean = false;

  constructor(
    private groupService: GroupService,
    private dialog: MatDialog,
    private cs: CommonService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.role = this.cs.getLocalData(LOCAL_KEYS.ROLE);
    if (this.role === 'SUPER_ADMIN') {
      this.isSuperAdmin = true;
    }
    this.groupForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9_]*$/),
      ]),
      groupName: new FormControl(
        { value: this.data.name, disabled: true },
        Validators.required
      ),
      groupCompliance: new FormControl(false),
      scopes: new FormControl('', [Validators.required]),
    });
  }
  get name(): FormControl {
    return this.groupForm.get('name') as FormControl;
  }
  get groupName(): FormControl {
    return this.groupForm.get('groupName') as FormControl;
  }
  get scopes(): FormControl {
    return this.groupForm.get('scopes') as FormControl;
  }

  get groupCompliance(): FormControl {
    return this.groupForm.get('groupCompliance') as FormControl;
  }

  createGroup(successMsg, errorMsg) {
    this.groupForm.markAsPristine();
    this._loading = true;
    const body: GroupComplianceAddParams = {
      name: this.name.value,
      fully_qualified_name: this.data.fully_qualified_name,
      parent_id: this.data.ID,
      scopes: this.scopes.value,
    };
    if (this.isSuperAdmin) {
      body.group_compliance = this.groupCompliance.value;
    }
    this.groupService.createGroup(body).subscribe(
      (res) => {
        this._loading = false;
        this.actionSuccessful = true;
        this.openModal(successMsg);
      },
      (err) => {
        this._loading = false;
        this.actionSuccessful = false;
        this.errorMsg = err.error.message;
        this.openModal(errorMsg);
      }
    );
  }

  resetForm() {
    this.groupForm.reset();
    this.groupForm.controls['groupName'].setValue(this.data.name);
  }

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
