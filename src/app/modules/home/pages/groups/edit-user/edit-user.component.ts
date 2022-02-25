import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, NgModel } from '@angular/forms';
import { GroupService } from 'src/app/core/services/group.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  @ViewChild('checkAll', { static: false }) checkSelectAll;
  groupForm: FormGroup;
  groups: any;
  roles = [];
  showMsg: any;
  showErrorMsg: any;
  errorMsg: any;
  _loading: boolean;
  public actionSuccessful:boolean;

  constructor(private groupService: GroupService,
    private router: Router,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.roles.push('ADMIN');
    this.roles.push('USER');
    this.groupForm = new FormGroup({
      'first_name': new FormControl({ value: '', disabled: true }, []),
      'last_name': new FormControl({ value: '', disabled: true }, []),
      'user_id': new FormControl({ value: '', disabled: true }, []),
      'user_groups': new FormControl({ value: '', disabled: true }, []),
      'role': new FormControl('', [])
    });
    this.setFormData();
  }

  setFormData() {
    if (this.data['datakey']) {
      this.first_name.setValue(this.data['datakey'].first_name);
      this.last_name.setValue(this.data['datakey'].last_name);
      this.user_id.setValue(this.data['datakey'].user_id);
      this.user_groups.setValue((this.data['datakey'].groups) ? this.data['datakey'].groups.toString() : '-');
      this.role.setValue(this.data['datakey'].role);
    }
  }
  get first_name() {
    return this.groupForm.get('first_name');
  }
  get last_name() {
    return this.groupForm.get('last_name');
  }
  get user_id() {
    return this.groupForm.get('user_id');
  }
  get user_groups() {
    return this.groupForm.get('user_groups');
  }
  get role() {
    return this.groupForm.get('role');
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '30%',
      disableClose: true
    });
  }

  updateUser(successMsg, errorMsg) {
    this._loading = true;
    this.groupForm.markAsPristine();
    const data = this.groupForm.value;
    data.user_id = this.user_id.value;
    data.first_name = this.first_name.value;
    data.last_name = this.last_name.value;
    data.locale = this.data['datakey'].locale;
    this.groupService.updateUser(data).subscribe(res => {
      this.actionSuccessful = true;
      this.openModal(successMsg);
      this._loading = false;
    },
      (error) => {
        this.actionSuccessful = false;
        this.errorMsg = error.error.message || 'Some error occured! User could not be updated';
        this.openModal(errorMsg);
        this._loading = false;
      });
  }

  resetGroup() {
    this.setFormData();
    this.groupForm.markAsPristine();
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}

