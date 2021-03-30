// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, FormGroupDirective, NgForm, NgModel } from '@angular/forms';
import { GroupService } from 'src/app/core/services/group.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  @ViewChild('checkAll', {static: false}) checkSelectAll;
  // selectedYears: any[];
  years: any[];
  groupForm: FormGroup;
  groups: any;
  _loading: Boolean;
  selectedScopes = [];
  selectedyears = [];
  group: any;
  selectedGroup: any;
  showMsg: any;
  scopeSelect: any;
  showErrorMsg: any;
  errorMsg: any;
  fully_qualified_name: String;
  actionSuccessful:Boolean;
  constructor(private groupService: GroupService, private router: Router, private dialog: MatDialog, @Inject (MAT_DIALOG_DATA) public data) { }

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

  createGroup(successMsg, errorMsg) {
    this.groupForm.markAsPristine();
    this._loading = true;
    const body = {
      "name": this.name.value,
      "fully_qualified_name": this.data.fully_qualified_name,
      "parent_id": this.data.ID,
      "scopes": this.scopes.value
    }
    this.groupService.createGroup(body).subscribe(res => {
      this._loading= false;
      this.actionSuccessful = true;
      this.openModal(successMsg);
    },
    (err) => {
        this._loading = false;
        this.actionSuccessful = false;
        this.errorMsg = err.error.message;
        this.openModal(errorMsg);
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

  resetForm() {
    this.groupForm.reset();
    this.groupForm.controls['groupName'].setValue(this.data.name);
  }
  
  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
        width: '30%',
        disableClose: true
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
