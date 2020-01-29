// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, FormGroupDirective, NgForm, NgModel } from '@angular/forms';
import { GroupService } from 'src/app/core/services/group.service';
import { Router } from '@angular/router';
import { checkAndUpdateElementInline } from '@angular/core/src/view/element';


@Component({
  selector: 'app-create-user-grp',
  templateUrl: './create-user-grp.component.html',
  styleUrls: ['./create-user-grp.component.scss']
})
export class CreateUserGrpComponent implements OnInit {
  @ViewChild('checkAll') checkSelectAll;
  // selectedYears: any[];
  // toppings = new FormControl();
  topping;
  years: any[];
  groupForm: FormGroup;
  groups: any;
  selectedScopes = [];
  selectedyears = [];
  roles = [];
  groupIdArr = [];
  selectedRole: String;
  group: any;
  selectedGroup: any;
  selectedGroupId = [];
  showMsg: any;
  scopeSelect: any;
  showErrorMsg: any;
  errorMsg: any;
  constructor(private groupService: GroupService, private router: Router) { }
  toppings = new FormControl();
  ngOnInit() {
    this.roles.push('ADMIN');
    this.roles.push('USER');
    this.listGroups();
    this.groupForm = new FormGroup({
      'first_name': new FormControl('', [Validators.required, Validators.minLength(1),
      Validators.pattern(/^[a-zA-Z0-9_]*$/)]),
      'last_name': new FormControl('', [Validators.required, Validators.minLength(1),
      Validators.pattern(/^[a-zA-Z0-9_]*$/)]),
      'user_id': new FormControl('', [Validators.required, Validators.email]),
    });
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


  selectAll(checkAll, select: NgModel, values) {
    console.log(checkAll, select, values);
    if (!checkAll) {
      this.groupForm.controls['scopes'].setValue(values);
    } else {
      this.groupForm.controls['scopes'].setValue([]);

    }
  }
  listGroups() {
    this.groupService.getGroups().subscribe
      (res => {
        console.log('this.groups------', res);
        this.groups = res.groups;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }

  selectGroup(data) {
    this.groupIdArr = data;
    console.log('selectGroup---------', this.groupIdArr);
  }
  selectRole(data) {
    this.selectedRole = data;
    console.log('deleteGroup---------', data);
  }
  onSelect(group) {
    this.selectedGroup = group;
    this.selectedScopes = this.groups.filter(x => x.ID === group.ID).map(x => x.scopes);
  }

  createGroup() {
    const arr = [];
    for (let j = 0; j < this.groupIdArr.length; j++) {
      for (let i = 0; i < this.groups.length; i++) {
        console.log('this.groups------', this.groups[i]);
        console.log('this.groupIdArr------', this.groupIdArr[j]);
        if (this.groupIdArr.includes(this.groups[i].name)) {
          arr.push(parseInt(this.groups[i].ID, 10));
        }
      }
    }
    console.log('test GRPID', arr);
    const data = this.groupForm.value;
    data.role = this.selectedRole;
    data.groups = arr;
    data.locale = 'en';
    console.log(data);
    this.groupService.createUser(data).subscribe(res => {
      this.showMsg = true;
      this.showErrorMsg = false;
      this.groupForm.reset();
      this.listGroups();
    },
      (error) => {
        const keyArr = Object.keys(error);
        if (keyArr.includes('error')) {
          this.errorMsg = error.message;
          this.showMsg = false;
          this.showErrorMsg = true;
        }
      });
  }

  changeParent() {
    this.checkSelectAll.checked = false;
    this.groupForm.controls['scopes'].setValue([]);
  }

  scopeOptionSelect() {
    const val = this.groupForm.controls['scopes'].value;
    if (val && val.length === this.selectedScopes[0].length) {
      this.checkSelectAll.checked = true;
    } else {
      this.checkSelectAll.checked = false;
    }
  }
}
