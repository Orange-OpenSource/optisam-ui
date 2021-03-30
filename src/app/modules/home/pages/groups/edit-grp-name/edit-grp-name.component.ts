// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, Inject } from '@angular/core';
import { GroupService } from 'src/app/core/services/group.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-grp-name',
  templateUrl: './edit-grp-name.component.html',
  styleUrls: ['./edit-grp-name.component.scss']
})
export class EditGrpNameComponent implements OnInit {
  groupForm: FormGroup;
  _loading: Boolean;
  errorMessage: string;
  group: any;
  cannotUpdateFlag:Boolean;
  actionSuccessful:Boolean;

  constructor(
    @Inject (MAT_DIALOG_DATA) public data, 
    private fb: FormBuilder,
    private dialog: MatDialog,
    private groupService: GroupService
    ) { 
      this.group = this.data;
    }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.groupForm = this.fb.group({
      'name':[null, [Validators.required, Validators.minLength(1), Validators.pattern(/^[a-zA-Z0-9_]*$/)]]
    });
    this.name.setValue(this.group.name);
  }

  get name() {
    return this.groupForm.get('name');
  }

  resetGroup(){
    this.groupForm.reset();
    this.name.setValue(this.group.name);
  }

  updateGroup(successMsg,errorMsg) {
    this.groupForm.markAsPristine();
    this._loading = true;
    const body = {
      'groupId': this.group.ID,
      'group': {
          'name': this.name.value
        }
    }
    this.groupService.updateGroup(this.group.ID, body).subscribe(res=>{
      this._loading = false;
      this.actionSuccessful = true;
      this.openModal(successMsg);
    },err=>{
      this._loading = false;
      this.actionSuccessful = false;
      this.errorMessage = err.error.message;
      this.openModal(errorMsg);
    });
  }
  
  unchangedName(): Boolean {
    if(this.name.value === this.group.name) {
      return true;
    }
    return false;
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
