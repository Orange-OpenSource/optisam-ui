// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GroupService } from 'src/app/core/services/group.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-create-user-grp',
  templateUrl: './create-user-grp.component.html',
  styleUrls: ['./create-user-grp.component.scss']
})
export class CreateUserGrpComponent implements OnInit {
  groupForm: FormGroup;
  groupsList: any;
  roles = [];
  errorMsg: any;
  constructor(
              private groupService: GroupService, 
              private router: Router,
              private dialog:MatDialog
              ) { }
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
      'groups': new FormControl(''),
      'role': new FormControl('', [Validators.required])
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
  get groups() {
    return this.groupForm.get('groups');
  }
  get role() {
    return this.groupForm.get('role');
  }

  listGroups() {
    this.groupService.getGroups().subscribe(res => {
        this.groupsList = res.groups.filter(group => group.ID !== "1");
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }

  createGroup(successMsg, errorMsg, duplicateUserErrorMsg) {
    this.groupForm.markAsPristine();
    const data = this.groupForm.value;
    if(this.groups.value && this.groups.value.length >0)
    {data.groups = this.groups.value.map(group=>group.ID);}
    else {
      data.groups = [];
    }
    data.locale = 'en';
    this.groupService.createUser(data).subscribe(res => {
      // this.groupForm.reset();
      this.openModal(successMsg);
    },
      (error) => {
        const keyArr = Object.keys(error);
        if (keyArr.includes('error')) {
          this.errorMsg = error.message;
          if(this.errorMsg == 'username already exists') {
            this.openModal(duplicateUserErrorMsg);
          } else {
            this.openModal(errorMsg);
          }
        }
      });
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
        width: '30%',
        disableClose: true
    });
  } 
  backToList() {
    this.router.navigate(['/optisam/gr/viewUsers']);
  }

  resetGroup() {
    this.groupForm.reset();
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
