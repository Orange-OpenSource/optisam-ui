import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-allocated-metric-confirmation-dialog',
  templateUrl: './delete-allocated-metric-confirmation-dialog.component.html',
  styleUrls: ['./delete-allocated-metric-confirmation-dialog.component.scss'],
})
export class DeleteAllocatedMetricConfirmationDialogComponent
  implements OnInit
{
  constructor(
    public dialogRef: MatDialogRef<DeleteAllocatedMetricConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  confirmed(): void {
    this.dialogRef.close(true);
  }
}
