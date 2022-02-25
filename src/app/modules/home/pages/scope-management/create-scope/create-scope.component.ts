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
  actionSuccessful: Boolean;
  errorMessage:string;

  constructor(
    private accountService: AccountService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.scopeForm = new FormGroup({
      'scope_id': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(3),
      Validators.pattern(/^[A-Z]*$/)]),
      'scope_name': new FormControl('', [Validators.required, Validators.minLength(1),
      Validators.pattern(/^[a-zA-Z0-9_]*$/)]),
      'scope_type': new FormControl('generic', [Validators.required])
    });
  }

  get scope_id() {
    return this.scopeForm.get('scope_id');
  }

  get scope_name() {
    return this.scopeForm.get('scope_name');
  }

  get scope_type() {
    return this.scopeForm.get('scope_type');
  }

  resetScope(){
    this.scopeForm.reset();
    this.scope_type.setValue('generic');
  }

  createScope(successMsg,errorMsg) {
    this.scopeForm.markAsPristine();
    this._loading = true;
    const body = {
      'scope_code': this.scope_id.value,
      'scope_name': this.scope_name.value,
      'scope_type': this.scope_type.value.toUpperCase()
    }
    this.accountService.createScope(body).subscribe(res=>{
      this.actionSuccessful = true;
      this._loading = false;
      this.openModal(successMsg);
    },err=>{
      this.actionSuccessful = false;
      this._loading = false;
      this.errorMessage = ('Error:' + err.error.message )|| 'CREATE_SCOPE_ERROR';
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
