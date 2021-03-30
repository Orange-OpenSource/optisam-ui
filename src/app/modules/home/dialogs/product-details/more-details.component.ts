// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from 'src/app/core/services/product.service';
import { DialogData } from './details';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';


@Component({
  selector: 'app-more-details',
  templateUrl: './more-details.component.html',
  styleUrls: ['./more-details.component.scss']
})

export class MoreDetailsComponent implements OnInit {
  value: any;
  pName: any;
  appID: any;
  edition: any;
  acquireRight: any;
  loadingSubscription: Subscription;
  _loading: Boolean;
  swidTag: any;
  productInfo: DialogData = new DialogData();
  productOptions: DialogData = new DialogData();

  constructor(private productsService: ProductService,
    private sharedService: SharedService,
    public dialogRef: MatDialogRef<MoreDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { 
      this.loadingSubscription = this.sharedService .httpLoading().subscribe(load => {
        this._loading = load;
      });}


  ngOnInit() {
    this.swidTag = this.data['datakey'];
    this.pName = this.data['dataName'];
    if(this.data['appID'])
    {this.appID = this.data['appID'];} else {
      this.appID = null;
    }
    this.getProductDetails();
  }

  getProductDetails() {
    this._loading = true;
    this.productsService.getMoreDetails(this.swidTag).subscribe(
      (res: any) => {
        this.productInfo = res;
        this._loading = false;
      },
      error => {
        this._loading = false;
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }

  getProductOptions() {
    this._loading = true;
    this.productsService.getOptionsDetails(this.swidTag).subscribe(
      (res: any) => {
        this.productOptions = res;
        this._loading = false;
      },
      error => {
        this._loading = false;
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }

  getAcquiredRights() {
    this._loading = true;
    this.productsService.getAcquiredRightDetails(this.swidTag,'',this.appID).subscribe(
      (res: any) => {
        this.acquireRight = res;
        this._loading = false;
      },
      error => {
        this._loading = false;
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
