import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-editor-products-dialog',
  templateUrl: './editor-products-dialog.component.html',
  styleUrls: ['./editor-products-dialog.component.scss'],
})
export class EditorProductsDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
