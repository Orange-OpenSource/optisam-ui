// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, NgModel } from '@angular/forms';
import { GroupService } from 'src/app/core/services/group.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  @ViewChild('checkAll') checkSelectAll;
  groupForm: FormGroup;
  groups: any;
  roles = [];
  showMsg: any;
  showErrorMsg: any;
  errorMsg: any;
  
  constructor(private groupService: GroupService, 
              private router: Router,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.roles.push('ADMIN');
    this.roles.push('USER');
    this.groupForm = new FormGroup({
      'first_name': new FormControl({value:'', disabled: true}, [Validators.required, Validators.minLength(1),
      Validators.pattern(/^[a-zA-Z0-9_]*$/)]),
      'last_name': new FormControl({value:'', disabled: true}, [Validators.required, Validators.minLength(1),
      Validators.pattern(/^[a-zA-Z0-9_]*$/)]),
      'user_id': new FormControl({value:'', disabled: true},[]),
      'user_groups': new FormControl({value:'', disabled: true},[] ),
      'role': new FormControl('', [])
    });
    console.log('data : ',this.data['datakey']);
    this.setFormData();
  }

  setFormData() {
    this.first_name.setValue(this.data['datakey'].first_name);
    this.last_name.setValue(this.data['datakey'].last_name);
    this.user_id.setValue(this.data['datakey'].user_id);
    this.user_groups.setValue((this.data['datakey'].groups)?this.data['datakey'].groups.toString():'-');
    this.role.setValue(this.data['datakey'].role);
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
        width: '50%',
        disableClose: true
    });
  } 

  updateUser(successMsg, errorMsg) {
    const data = this.groupForm.value;
    data.user_id = this.user_id.value;
    data.first_name = this.first_name.value;
    data.last_name = this.last_name.value;
    // data.groups = this.user_groups.value;
    data.locale = this.data['datakey'].locale;
    console.log('Updated data : ',data);
    this.groupService.updateUser(data).subscribe(res => {
      // this.showMsg = true;
      // this.showErrorMsg = false;
      // this.groupForm.reset();
      this.openModal(successMsg);
    },
      (error) => {
        const keyArr = Object.keys(error);
        if (keyArr.includes('error')) {
          // this.errorMsg = error.message;
          // this.showMsg = false;
          // this.showErrorMsg = true;
          // console.log('error!!!!!!')
          this.openModal(errorMsg);
        }
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
