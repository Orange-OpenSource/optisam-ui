// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  _loading: boolean;
  error: boolean;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService
  ) {
    this._loading = false;
    this.error = false;
   }

  ngOnInit() {
  }

  confirm() {
    this._loading = true;
    if (this.data.type === 'deleteProductAggregate') {
      this.deleteProductAggregation();
    }
  }

  deleteProductAggregation() {
    this.productService.deleteAggregation(this.data.id).subscribe(resp => {
      this._loading = false;
      this.dialogRef.close(true);
    }, err => {
      this._loading = false;
      this.error = true;
    });
  }

}
