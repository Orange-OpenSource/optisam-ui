import { Component, OnInit, Inject } from '@angular/core';
import { GroupService } from 'src/app/core/services/group.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-edit-grp-name',
  templateUrl: './edit-grp-name.component.html',
  styleUrls: ['./edit-grp-name.component.scss'],
})
export class EditGrpNameComponent implements OnInit {
  groupForm: FormGroup;
  _loading: Boolean;
  errorMessage: string;
  group: any;
  cannotUpdateFlag: Boolean;
  actionSuccessful: Boolean;
  scopeList: string[] = [];
  isAdmin: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.group = this.data?.item;
    this.scopeList = this.data?.scopes;
    const role = localStorage.getItem('role');
    if (role === 'SUPER_ADMIN') {
      this.isAdmin = true;
    }
    this.initForm();
  }

  initForm() {
    this.groupForm = this.fb.group({
      name: this.fb.control(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern(/^[a-zA-Z0-9_]*$/),
      ]),
      ...(!this.isRoot && {
        scopes: this.fb.control([], [Validators.required]),
        groupCompliance: this.fb.control(false, []),
      }),
    });
    this.groupForm.patchValue({
      name: this.group?.name,
      scopes: this.group?.scopes,
      groupCompliance: this.group?.group_compliance || false,
    });
  }

  get isRoot(): boolean {
    return this.data?.item?.parent_id == 0;
  }

  get name(): FormControl {
    return this.groupForm?.get('name') as FormControl;
  }

  get scopes(): FormControl {
    return this.groupForm?.get('scopes') as FormControl;
  }

  get groupCompliance(): FormControl {
    return this.groupForm?.get('groupCompliance') as FormControl;
  }

  resetGroup() {
    this.groupForm.reset();
    this.name.setValue(this.group.name);
  }

  updateGroup(successMsg, errorMsg) {
    this.groupForm.markAsPristine();
    this._loading = true;
    const body = {
      groupId: this.group.ID,
      group: {
        name: this.name.value,
        scopes: this.scopes.value,
        group_compliance: this.groupCompliance.value,
      },
    };
    this.groupService.updateGroup(this.group.ID, body).subscribe(
      (res) => {
        this._loading = false;
        this.actionSuccessful = true;
        this.openModal(successMsg);
      },
      (err) => {
        this._loading = false;
        this.actionSuccessful = false;
        this.errorMessage = err.error.message;
        this.openModal(errorMsg);
      }
    );
  }

  unchangedName(): Boolean {
    if (this.name?.value === this.group?.name) {
      return true;
    }
    return false;
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '30%',
      disableClose: true,
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
