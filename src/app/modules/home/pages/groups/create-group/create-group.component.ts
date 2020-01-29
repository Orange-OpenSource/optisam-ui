// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, FormGroupDirective, NgForm, NgModel } from '@angular/forms';
import { GroupService } from 'src/app/core/services/group.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { checkAndUpdateElementInline } from '@angular/core/src/view/element';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  @ViewChild('checkAll') checkSelectAll;
  // selectedYears: any[];
  years: any[];
  groupForm: FormGroup;
  groups: any;
  selectedScopes = [];
  selectedyears = [];
  group: any;
  selectedGroup: any;
  showMsg: any;
  scopeSelect: any;
  showErrorMsg: any;
  errorMsg: any;
  fully_qualified_name: String;
  constructor(private groupService: GroupService, private router: Router, @Inject (MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
   /*  this.listGroups(); */
   this.fully_qualified_name = this.data.fully_qualified_name;
   this.groups = [this.data];
    this.groupForm = new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.minLength(1),
      Validators.pattern(/^[a-zA-Z0-9_]*$/)]),
      'groupName': new FormControl({value: this.data.name, disabled: true}, Validators.required),
      'scopes': new FormControl('', [Validators.required]),
    });
  }
  get name() {
    return this.groupForm.get('name');
   }
   get scopes() {
      return this.groupForm.get('scopes');
     }
     get groupName() {
      return this.groupForm.get('groupName');
     }
  selectAll(checkAll, select: NgModel, values) {
    console.log(checkAll, select, values);
    if (!checkAll) {
      this.groupForm.controls['scopes'].setValue(values);
    } else {
      this.groupForm.controls['scopes'].setValue([]);

    }
  }
 /*  listGroups() {
    this.groupService.getGroups().subscribe(
      (res: any) => {
        this.groups = res.groups;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  } */

  onSelect(group) {
    this.selectedGroup = group;
    this.selectedScopes = this.groups.filter(x => x.ID === group.ID).map(x => x.scopes);
  }

  createGroup() {
    const data = this.groupForm.value;
    delete data.groupName;
    data.parent_id = this.data.ID;
    this.groupService.createGroup(data).subscribe(res => {
      this.groupForm.reset();
      this.showMsg = true;
      this.showErrorMsg = false;
     /*  this.listGroups(); */
    },
    (error) => {
      const keyArr = Object.keys(error);
      if (keyArr.includes('error')) {
        this.errorMsg = error.message;
        this.showErrorMsg = true;
        this.showMsg = false;
      }});
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
