import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GroupService } from 'src/app/core/services/group.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  groupForm: FormGroup;
  _loading: Boolean;
  errorMsg: any;
  actionSuccessful: Boolean;

  constructor(
    private groupService: GroupService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.groupForm = new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.minLength(1), Validators.pattern(/^[a-zA-Z0-9_]*$/)]),
      'groupName': new FormControl({ value: this.data.name, disabled: true }, Validators.required),
      'scopes': new FormControl('', [Validators.required])
    });
  }
  get name() {
    return this.groupForm.get('name');
  }
  get groupName() {
    return this.groupForm.get('groupName');
  }
  get scopes() {
    return this.groupForm.get('scopes');
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
      this._loading = false;
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
