import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductCatalogService } from '@core/services';
import { ErrorDialogComponent } from '@shared/error-dialog/error-dialog.component';
import { SuccessDialogComponent } from '@shared/success-dialog/success-dialog.component';
import { ProductListComponent } from '../product-list.component';

@Component({
  selector: 'app-delete-product-confirmation-product-catalog',
  templateUrl: './delete-product-confirmation-product-catalog.component.html',
  styleUrls: ['./delete-product-confirmation-product-catalog.component.scss']
})
export class DeleteProductConfirmationProductCatalogComponent implements OnInit {

  constructor(
    private dialog:MatDialog,
    private productService:ProductCatalogService,
    private router:Router,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private dialogRef: MatDialogRef<ProductListComponent>
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }
  _loading:any=true

  deleteProduct(){
    this.productService.deleteProduct(this.data[0]?.id).subscribe((res)=>{
      console.log(res)
      this._loading = false;
      this.dialog.open(SuccessDialogComponent,{
        width:"30%",
        data: {
          message: 'Product Successfully Deleted',
        },
        disableClose: true,
      })
      .afterClosed()
    .subscribe(() => {
      this.router.navigate(['/optisam/pc/products']);
    })
      ,
      (err)=>{
        this._loading = false;
        this.dialog.open(
          ErrorDialogComponent, {
          width:"30%",
        data: {
          message: err,
        },
        disableClose: true,
        })
        .afterClosed()
    .subscribe(() => {
      this.dialogRef.close(true);
    });
      }
      })
  }

}
