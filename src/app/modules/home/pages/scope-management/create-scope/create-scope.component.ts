// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from 'src/app/core/services/account.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-scope',
  templateUrl: './create-scope.component.html',
  styleUrls: ['./create-scope.component.scss']
})
export class CreateScopeComponent implements OnInit {
  scopeForm: FormGroup;
  _loading: Boolean;
  constructor(
    private accountService: AccountService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.scopeForm = new FormGroup({
      'scope_id': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(3),
      Validators.pattern(/^[A-Z]*$/)]),
      'scope_name': new FormControl('', [Validators.required, Validators.minLength(1),
      Validators.pattern(/^[a-zA-Z0-9_]*$/)])
    });
  }

  get scope_id() {
    return this.scopeForm.get('scope_id');
  }

  get scope_name() {
    return this.scopeForm.get('scope_name');
  }

  resetScope(){
    this.scopeForm.reset();
  }

  createScope(successMsg,errorMsg) {
    this.scopeForm.markAsPristine();
    this._loading = true;
    const body = {
      'scope_code': this.scope_id.value,
      'scope_name': this.scope_name.value
    }
    this.accountService.createScope(body).subscribe(res=>{
      this._loading = false;
      this.openModal(successMsg);
    },err=>{
      this._loading = false;
      this.openModal(errorMsg);
    });
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
