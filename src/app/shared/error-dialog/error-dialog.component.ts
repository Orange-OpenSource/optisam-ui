import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface ErrorDialogData {
  message?: string;
  error?: string;
}

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss'],
})
export class ErrorDialogComponent implements OnInit {
  message: string;
  error: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: ErrorDialogData) {}

  ngOnInit(): void {
    this.message = this.data?.message || '';
    this.error = this.data?.error || '';
  }
}