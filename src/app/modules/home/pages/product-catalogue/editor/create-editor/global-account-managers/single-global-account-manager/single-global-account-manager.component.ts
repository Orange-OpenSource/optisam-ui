import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteGlobalAccountManagerComponent } from './delete-global-account-manager/delete-global-account-manager.component';

@Component({
  selector: 'app-single-global-account-manager',
  templateUrl: './single-global-account-manager.component.html',
  styleUrls: ['./single-global-account-manager.component.scss'],
})
export class SingleGlobalAccountManagerComponent implements OnInit {
  @Input('index') index: number;
  globalAccountManager: FormArray;
  form: FormGroup;
  constructor(private container: ControlContainer, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.globalAccountManager = this.container.control as FormArray;
    this.form = this.globalAccountManager?.controls[this.index] as FormGroup;
  }

  static addGlobalAccountManager(data = null) {
    return new FormGroup({
      name: new FormControl(data?.name || '', Validators.maxLength(200)),
      email: new FormControl(data?.email || '', Validators.email),
    });
  }

  get name(): FormControl {
    return this.form?.get('name') as FormControl;
  }

  get email(): FormControl {
    return this.form?.get('email') as FormControl;
  }

  deleteConfirmation() {
    this.dialog
      .open(DeleteGlobalAccountManagerComponent, {
        width: '300px',
        disableClose: true,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((status: boolean) => {
        if (status) {
          this.globalAccountManager.removeAt(this.index);
        }
      });
  }
}
