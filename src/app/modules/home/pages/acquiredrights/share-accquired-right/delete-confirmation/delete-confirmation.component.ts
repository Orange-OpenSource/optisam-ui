import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DeleteConfirmationComponent>) {}

  ngOnInit(): void {}

  remove(res: boolean): void {
    this.dialogRef.close(res);
  }


}
