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
