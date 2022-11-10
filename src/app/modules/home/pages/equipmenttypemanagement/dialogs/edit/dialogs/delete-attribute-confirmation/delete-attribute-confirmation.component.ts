import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-attribute-confirmation',
  templateUrl: './delete-attribute-confirmation.component.html',
  styleUrls: ['./delete-attribute-confirmation.component.scss'],
})
export class DeleteAttributeConfirmationComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteAttributeConfirmationComponent>
  ) {}

  ngOnInit(): void {}

  confirmationResponse(res: boolean): void {
    this.dialogRef.close(res);
  }
}
