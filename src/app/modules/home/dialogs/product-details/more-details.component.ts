import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ProductService } from 'src/app/core/services/product.service';
import { DialogData } from './details';


@Component({
  selector: 'app-more-details',
  templateUrl: './more-details.component.html',
  styleUrls: ['./more-details.component.scss']
})

export class MoreDetailsComponent implements OnInit {
  value: any;
  pName: any;
  edition: any;
  acquireRight: any;

  productdetails: DialogData = new DialogData();
  constructor(private productsService: ProductService,
    public dialogRef: MatDialogRef<MoreDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }


  ngOnInit() {
    const val = this.data['datakey'];
    this.pName = this.data['dataName'];
    this.productsService.getAcquiredRigthDetail(val).subscribe(
      (res: any) => {
        this.acquireRight = res;
        console.log('acquireRight-------', this.acquireRight);
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });

    this.productsService.getMoreDetails(val).subscribe(
      (res: any) => {
        this.productdetails = res;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}

