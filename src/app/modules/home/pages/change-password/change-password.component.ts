// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { GroupService } from './../../../../core/services/group.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, FormGroupDirective, NgForm, NgModel } from '@angular/forms';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  hide1 = true;
  hide2 = true;
  groupForm: FormGroup;
  matchPassword: Boolean = false;
  showMsg: Boolean = false;
  showErrorMsg: Boolean = false;
  errorMsg: String;


  constructor(private groupService: GroupService, public router: Router) { }

  ngOnInit() {
    this.groupForm = new FormGroup({
      'old': new FormControl('', [Validators.required]),
      'new': new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]),
      'confirm': new FormControl('', [Validators.required]),
    });
  }

  get old() {
    return this.groupForm.get('old');
  }

  get new() {
    return this.groupForm.get('new');
  }
  get confirm() {
    return this.groupForm.get('confirm');
  }
  createGroup() {
    const data = this.groupForm.value;
    if (data.new === data.confirm) {
      this.matchPassword = false;
      delete data.confirm;
      this.groupService.changePassword(data).subscribe(res => {
        this.groupForm.reset();
        this.showMsg = true;
        this.showErrorMsg = false;
        setInterval(() => {
          localStorage.clear();
          localStorage.setItem('access_token', '');
          localStorage.setItem('role', '');
          localStorage.getItem('access_token');
          this.router.navigate(['/']);

        }, 1000 );
       /*  this.listGroups(); */
      },
      (error) => {
        const keyArr = Object.keys(error);
        if (keyArr.includes('error')) {
          this.errorMsg = error.message;
          this.showErrorMsg = true;
          this.showMsg = false;
        }});

      } else {
        console.log('i am here');
        this.matchPassword = true;

    }
  }
}
