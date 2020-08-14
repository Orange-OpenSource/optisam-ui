// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, Inject } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { GroupService } from 'src/app/core/services/group.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Router} from '@angular/router';

@Component({
  selector: 'app-edit-grp-name',
  templateUrl: './edit-grp-name.component.html',
  styleUrls: ['./edit-grp-name.component.scss']
})
export class EditGrpNameComponent implements OnInit {
fullyQualifyName: String;
editName: String;
nameRequired: Boolean;
showMsg: Boolean;
cannotUpdateFlag: Boolean = true;
  constructor(@Inject (MAT_DIALOG_DATA) public data, private dialog: MatDialog,private groupService: GroupService, private router: Router) { }

  ngOnInit() {
    this.setData();
  }
  setData() {
    this.editName = this.data.node.name;
    this.fullyQualifyName = this.data.node.fully_qualified_name;
    this.cannotUpdateFlag = true;
  }
  validateName(name) {
    if(name===this.data.node.name) {
      this.cannotUpdateFlag = true;
    }
    else {
      this.cannotUpdateFlag = false;
    }
  }
  saveEditName(data, successMsg, errorMsg) {
    if (this.editName === '' || this.editName === null) {
      console.log('1');
      this.nameRequired = true;
    } else {
      console.log('2');
     data = {'group_id': this.data.node.ID,
             'group': {
              'name': this.editName.trim()}};
      this.groupService.editName(this.data.node.ID, data).subscribe(res => {
        console.log('res----', res);
        this.showMsg = true;
        this.openModal(successMsg);
      },
        error => {
          console.log('Fetch direct Group response ERROR !!!' + error);
          this.showMsg = false;
          this.openModal(errorMsg);
        });
      this.nameRequired = false;
    }

  }
  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
        width: '50%',
        disableClose: true
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }

}
