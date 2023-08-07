import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonPopupSetting } from '@core/modals';

@Component({
  selector: 'app-common-popup',
  templateUrl: './common-popup.component.html',
  styleUrls: ['./common-popup.component.scss'],
})
export class CommonPopupComponent implements OnInit {
  title: string = 'SHARED.TITLE.CONFIRMATION';
  message: string = 'SHARED.MESSAGE.CONFIRMATION_REMOVE';
  messageVariable: object = {};
  buttonText: string = 'SHARED.BUTTON.YES';
  singleButton: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CommonPopupSetting,
    private dialogRef: MatDialogRef<CommonPopupComponent>
  ) {}

  ngOnInit(): void {
    this.title = this.data.title;
    this.message = this.data.message;
    this.buttonText = this.data.buttonText;
    this.singleButton = this.data?.singleButton || this.singleButton;
    this.messageVariable = this.data?.messageVariable || this.messageVariable;
  }

  confirmStatus(status: boolean): void {
    this.dialogRef.close(status);
  }
}
