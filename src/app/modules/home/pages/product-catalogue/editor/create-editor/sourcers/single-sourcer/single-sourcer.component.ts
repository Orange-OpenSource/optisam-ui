import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Sourcers } from '@core/modals';
import { DeleteSourcerConfirmationComponent } from './delete-sourcer-confirmation/delete-sourcer-confirmation.component';

@Component({
  selector: 'app-single-sourcer',
  templateUrl: './single-sourcer.component.html',
  styleUrls: ['./single-sourcer.component.scss'],
})
export class SingleSourcerComponent implements OnInit {
  @Input('index') index: number;
  sourcersArray: FormArray;
  form: FormGroup;
  constructor(private container: ControlContainer, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.sourcersArray = this.container.control as FormArray;
    this.form = this.sourcersArray?.controls[this.index] as FormGroup;
  }

  static addSourcer(data: Sourcers = null) {
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
      .open(DeleteSourcerConfirmationComponent, {
        width: '300px',
        disableClose: true,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((status: boolean) => {
        if (status) {
          this.sourcersArray.removeAt(this.index);
        }
      });
  }
}
