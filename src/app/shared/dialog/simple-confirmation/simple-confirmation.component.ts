import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-simple-confirmation',
  templateUrl: './simple-confirmation.component.html',
  styleUrls: ['./simple-confirmation.component.scss'],
})
export class SimpleConfirmationComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<SimpleConfirmationComponent>) {}

  ngOnInit(): void {}

  confirmStatus(status: boolean): void {
    this.dialogRef.close(status);
  }
}
