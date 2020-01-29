// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AggregationService } from 'src/app/core/services/aggregation.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { Subscription } from 'rxjs';

function validateAggregationName(c: FormControl) {
  const EMAIL_REGEXP = /[^a-zA-Z\d_]/g ;

  return !EMAIL_REGEXP.test(c.value) ? null : {
    validAggName: true
  };
}
@Component({
  selector: 'app-create-aggregation',
  templateUrl: './create-aggregation.component.html',
  styleUrls: ['./create-aggregation.component.scss']
})
export class CreateAggregationComponent implements OnInit, OnDestroy {
  createForm: FormGroup;
  productList: any[] = [];
  editorList: Editor[] = [];
  metricesList: Metrics[] = [];
  swidList: any[] = [];
  selectedSwidList: any[] = [];
  errorMessage: string;
  loadingSubscription: Subscription;
  HTTPActivity: Boolean;

  constructor(
    private fb: FormBuilder,
    private aggService: AggregationService,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.loadingSubscription = this.sharedService.httpLoading().subscribe(data => {
      this.HTTPActivity = data;
    });
  }

  ngOnInit() {
    this.createForm = this.fb.group({
      name: ['', [Validators.required, validateAggregationName]],
      editor: ['', [Validators.required]],
      metric: ['', [Validators.required]],
      product: ['', [Validators.required]]
    });

    this.getEditorsList();
    this.getMetricesList();
  }

  // Get All Editors
  getEditorsList() {
    this.aggService.getEditorList().subscribe((response: any) => {
        this.editorList = response.editors || [];
      }, (error) => {
        console.log("Error fetching editors");
    });
  }

  // Get All Metrices based on Editor
  getMetricesList() {
    this.aggService.getMetricList().subscribe((response: any) => {
      this.metricesList = response.metrices || [];
    }, (error) => {
      console.log("Error fetching metric");
    });
  }

  // Get All Products based on Editor and Metrics
  getProductsList(product?: string) {
    this.errorMessage = '';
    let query = '?page_num=1&page_size=1000&sort_by=name&sort_order=asc';
    query += '&search_params.editor.filteringkey=' + this.createForm.value.editor;
    query += '&search_params.agFilter.NotForMetric=' + this.createForm.value.metric;
    query += (product ? '&search_params.name.filteringkey=' + this.createForm.value.product + '&search_params.name.filter_type=EQ' : '');

    this.aggService.getProductList(query).subscribe((response: any) => {
      if (product) {
        this.selectedSwidList = [];
        this.swidList = response.products || [];
      } else {
        this.productList = response.products || [];
      }
    }, (error) => {
      this.errorMessage = error && error.error ? error.error.message : '';
      console.log("Error fetching metric");
    });
  }

  selectionChanged(ev: any, type: string) {
    // console.log(type, 'type')
    switch (type) {
      case 'editor':
        // this.createForm.controls['metric'].patchValue('');
        // this.createForm.controls['product'].patchValue('');
        this.createForm.controls['metric'].reset();
        this.createForm.controls['product'].reset();
        this.productList = [];
        this.swidList = [];
        this.selectedSwidList = [];
        break;

      case 'metric':
        this.createForm.controls['product'].patchValue('');
        this.getProductsList();
        break;

      case 'product':
        this.getProductsList('product');
        break;
    }
  }

  createAggregation() {
    this.errorMessage = '';
    if (this.createForm.valid && this.selectedSwidList.length > 0) {
      const reqbody = this.createForm.value;
      reqbody.products = this.selectedSwidList.map(swid => swid.swidTag);
      this.aggService.saveAggregation(reqbody).subscribe((resp) => {
        console.log('aggregation save successfully');
        this.router.navigate(['/optisam/ag/list-aggregation']);
      }, error => {
        this.errorMessage = error && error.error ? error.error.message : '';
        console.log('Error saving aggregation', error);
      });
    } else {
      return false;
    }
  }

  addSwidTag(swid: any, index: number) {
    this.swidList.splice(index, 1);
    this.selectedSwidList.push(swid);
  }

  removeSwidTag(swid: any, index: number) {
    this.selectedSwidList.splice(index, 1);
    this.swidList.push(swid);
  }

  resetForm() {
    this.createForm.reset();
    this.selectedSwidList = [];
    this.swidList = [];
    this.productList = [];
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

}
