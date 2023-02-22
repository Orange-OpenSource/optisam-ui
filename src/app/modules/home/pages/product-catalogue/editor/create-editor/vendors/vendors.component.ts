import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss'],
})
export class VendorsComponent implements OnInit {
  @Input() fg: FormGroup;
  @Input() view: boolean;
  toItemsdelete: any;
  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {}

  addVendors() {
    this.vendors.push(
      this.fb.group({
        name: this.fb.control('', [Validators.minLength(3), Validators.maxLength(200)]),
      })
    );
  }

  removeVendorConfirmation(templateRef: any, data) {
    this.toItemsdelete = data.value;
    const dialogRef = this.dialog.open(templateRef, {
      width: '800px',
      disableClose: true,
      autoFocus: false,
      maxHeight: '90vh',
    });
  }

  removeVendors(i: number) {
    this.vendors.removeAt(
      this.vendors.value.findIndex((value) => value === this.toItemsdelete)
    );
  }

  get vendors(): FormArray {
    return this.fg?.get('vendors') as FormArray;
  }

  get name(): FormControl {
    return this.vendors.controls[0].get('name') as FormControl;
  }
}
