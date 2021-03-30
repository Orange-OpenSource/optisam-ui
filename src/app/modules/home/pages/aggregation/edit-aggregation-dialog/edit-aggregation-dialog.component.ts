// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from 'src/app/core/services/product.service';

function validateAggregationName(c: FormControl) {
  const AGG_EXP = /[^a-zA-Z\d_]/g;

  return !AGG_EXP.test(c.value) ? null : {
    validAggName: true
  };
}

@Component({
  selector: 'app-edit-aggregation-dialog',
  templateUrl: './edit-aggregation-dialog.component.html',
  styleUrls: ['./edit-aggregation-dialog.component.scss']
})
export class EditAggregationDialogComponent implements OnInit {
  readonly aggName = this.data.name;
  readonly aggID = this.data.ID;
  _loading: boolean;
  error: boolean;
  updateForm: FormGroup;
  productList: any[] = [];
  swidList: any[] = [];
  selectedSwidList: any[] = [];
  errorMessage: string;
  prodLoading: boolean;
  removeItem = []; // Removed orignal swidtags list
  msgtxt: string;
  noChangesMadeFlag: Boolean = true;
  acqrights_products: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditAggregationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService,
    private dialog: MatDialog
  ) {
    this._loading = false;
    this.error = false;
    this.prodLoading = false;
  }

  ngOnInit() {
    this.setFormData();
  }

  setFormData() {
    this.updateForm = this.fb.group({
      name: [this.data.name, [Validators.required, validateAggregationName]],
      scope: [{ value: this.data.scope, disabled: true }, [Validators.required]],
      editor: [{ value: this.data.editor, disabled: true }, [Validators.required]],
      metric: [{ value: this.data.metric, disabled: true }, [Validators.required]],
      product_names: [this.data.product_names, [Validators.required]]
    });
    if (this.data.products) { this.selectedSwidList = this.data.products.slice(); }
    // Fetch all products
    this.getInitialProductsList();

    this.updateForm.markAsPristine();
    this.noChangesMadeFlag = true;
  }

  getProductsList(initReq?: boolean) {
    const arr = this.acqrights_products || [];
    this.swidList = arr.filter(v => ((this.data.product_names.indexOf(v.product_name) !== -1) && (this.selectedSwidList.findIndex(i => i === v.swidtag) === -1)));
    // If the request is initial i.e when dialog opens
    if (!initReq) {
      this.selectedSwidList = [];
      for(let j=0; j< this.data.product_names.length; j++) {
        if(this.updateForm.value.product_names.includes(this.data.product_names[j])) {
          this.selectedSwidList.push(this.data.products[j]);
        }
      }
      for (let i = 0; i < this.updateForm.value.product_names.length; i++) {
        this.acqrights_products.filter(res => {
          if (res.product_name == this.updateForm.value.product_names[i] && this.swidList.indexOf(res) == -1) { this.swidList.push(res); }
        });
      }
    }
  }
  // Get All Products/Swidtags based on Editor and Metrics
  getInitialProductsList() {
    this.errorMessage = '';
    this.prodLoading = true;
    this.swidList = [];
    let query = '?scope=' + this.data.scope + '&editor=' + this.data.editor + '&metric=' + this.data.metric;

    this.productService.getProductListAggr(query).subscribe((response: any) => {
      this.acqrights_products = response.acqrights_products || [];
      this.productList = this.acqrights_products.filter((v, i, s) => {
        return s.findIndex(pr => pr.product_name === v.product_name) === i;
      });
      this.data.product_names.forEach(ele => {
        if (this.productList.findIndex(p => p.product_name === ele) === -1) {
          this.productList.push({ product_name: ele });
        }
      });
      // Fetch all swidtags with products
      this.getProductsList(true);
      this.prodLoading = false;
    }, (error) => {
      this.errorMessage = error && error.error ? error.error.message : 'Error fetching metric';
      this.prodLoading = false;
      this.error = true;
      console.log("Error fetching metric");
    });
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '30%',
      disableClose: true
    });
  }

  confirm(successMsg, errorMsg) {
    this.updateForm.markAsPristine();
    if (this.updateForm.valid && this.selectedSwidList.length > 0) {
      this._loading = true;
      const body = {
        ID: this.aggID,
        name: this.updateForm.value.name,
        scope: this.data.scope,
        editor: this.data.editor,
        metric: this.data.metric,
        products: this.selectedSwidList
      };

      this.productService.updateAggregation(this.aggID, body).subscribe(resp => {
        this._loading = false;
        this.openModal(successMsg);
      }, err => {
        this._loading = false;
        this.error = true;
        this.openModal(errorMsg);
        this.errorMessage = 'Some error occured while updating!! Please try again!';
        if (err && err.error && err.error.message) {
          this.errorMessage = err.error.message;
        }
      });
    }
  }

  // Get products not in second array
  compareProductList(primary: string[], compare: string[]): string[] {
    const retArr = [];
    primary.forEach(ele => {
      if (compare.indexOf(ele) === -1) {
        retArr.push(ele);
      }
    });
    return retArr;
  }

  addSwidTag(swid: any, index: number) {
    this.noChangesMadeFlag = false;
    this.swidList.splice(index, 1);
    this.selectedSwidList.push(swid.swidtag);
    this.removeItem.splice(this.removeItem.findIndex(v => v.swidtag === swid.swidtag), 1);
  }

  removeSwidTag(swid: any, index: number) {
    this.noChangesMadeFlag = false;
    this.selectedSwidList.splice(index, 1);
    this.swidList.push({ swidtag: swid });
    if (this.data.products.findIndex(v => v === swid) !== -1) {
      this.removeItem.push(swid);
    }
  }
  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
