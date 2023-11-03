import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-warning-allocation-change',
  templateUrl: './warning-allocation-change.component.html',
  styleUrls: ['./warning-allocation-change.component.scss'],
})
export class WarningAllocationChangeComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<WarningAllocationChangeComponent>
  ) { }

  ngOnInit(): void { }

  closeDialog(response: boolean): void {
    this.dialogRef.close(response);
  }
}
