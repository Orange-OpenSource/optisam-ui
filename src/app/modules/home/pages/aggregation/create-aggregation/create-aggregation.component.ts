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
import { debounceTime, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { GroupService } from 'src/app/core/services/group.service';

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
  scopeList: any[] = [];
  productList: any[] = [];
  editorList: Editor[] = [];
  metricesList: Metrics[] = [];
  swidList: any[] = [];
  selectedSwidList: any[] = [];
  selectedScope:any='';
  errorMessage: string;
  loadingSubscription: Subscription;
  HTTPActivity: Boolean;
  acqrights_products: any[]=[];

  constructor(
    private fb: FormBuilder,
    private aggService: AggregationService,
    private router: Router,
    private sharedService: SharedService,
    private groupService: GroupService,
    public dialog: MatDialog
  ) {
    this.loadingSubscription = this.sharedService.httpLoading().subscribe(data => {
      this.HTTPActivity = data;
    });
  }

  ngOnInit() {
    this.createForm = this.fb.group({
      name: ['', [Validators.required, validateAggregationName]],
      scope: ['', [Validators.required]],
      editor: ['', [Validators.required]],
      metric: ['', [Validators.required]],
      product_names: ['', [Validators.required]]
    });
    
    this.getScopes();
  }

  // Get Scopes
  getScopes() {
    this.groupService.getDirectGroups().subscribe((response: any) => {
      response.groups.map(res=>{ res.scopes.map(s=>{this.scopeList.push(s);});});
    }, (error) => {
      console.log("Error fetching groups");
    });
  }

  // Get All Editors
  getEditorsList() {
    this.aggService.getEditorList(this.selectedScope).subscribe((response: any) => {
        this.editorList = response.editor || [];
      }, (error) => {
        console.log("Error fetching editors");
    });
  }

  // Get All Metrices based on Editor
  getMetricesList() {
    this.aggService.getMetricList(this.selectedScope).subscribe((response: any) => {
      this.metricesList = response.metric || [];
    }, (error) => {
      console.log("Error fetching metric");
    });
  }

  // Get All Products based on Editor and Metrics
  getProductsList() {
    this.errorMessage = '';
    let query = '?scope='+this.selectedScope+'&editor='+this.createForm.value.editor + '&metric='+ this.createForm.value.metric;
    // let query = '?page_num=1&page_size=1000&sort_by=name&sort_order=asc';
    // query += '&search_params.editor.filteringkey=' + this.createForm.value.editor;
    // query += '&search_params.agFilter.NotForMetric=' + this.createForm.value.metric;
    
    this.aggService.getProductList(query).subscribe((response: any) => {
        this.acqrights_products = response.acqrights_products;
        this.productList = response.acqrights_products.filter((v, i, s) => {
                                return s.findIndex(pr => pr.product_name === v.product_name) === i;
                            });
    }, (error) => {
      this.errorMessage = error && error.error ? error.error.message : '';
      console.log("Error fetching metric");
    });
  }

  selectionChanged(ev: any, type: string) {
    switch (type) {
      case 'scope':
        this.selectedScope = this.createForm.value.scope;
        this.getEditorsList();
        this.getMetricesList();
      case 'editor':
        this.createForm.controls['metric'].reset();
        this.createForm.controls['product_names'].reset();
        this.productList = [];
        this.swidList = [];
        this.selectedSwidList = [];
        break;

      case 'metric':
        this.createForm.controls['product_names'].patchValue('');
        this.getProductsList();
        break;

      case 'product':
        this.selectedSwidList = [];
        this.swidList = [];
        for(let i=0; i<this.createForm.value.product_names.length; i++) {
          this.acqrights_products.filter(res=>{
            console.log('res:',res, 'swidList : ',this.swidList);
            if(res.product_name==this.createForm.value.product_names[i] && this.swidList.indexOf(res) == -1)
              {this.swidList.push(res);}
            });
        }
        break;
    }
  }

  createAggregation(successMsg, errorMsg) {
    this.errorMessage = '';
    if (this.createForm.valid && this.selectedSwidList.length > 0) {
      // const reqbody = this.createForm.value;
      const reqbody = {
        ID : 0,
        name : this.createForm.get('name').value,
        editor : this.createForm.get('editor').value,
        metric : this.createForm.get('metric').value,
        scope : this.createForm.get('scope').value,
        products : this.selectedSwidList.map(swid => swid.swidtag)
      }
      console.log(reqbody);
      console.log(this.createForm.value)
      // reqbody.products = this.selectedSwidList.map(swid => swid.swidTag); // Get swid tags from selected object array
      // reqbody.product_names = this.selectedSwidList
      //                         .map(swid => swid.name)
      //                         .filter((v, i, s) => s.indexOf(v) === i); // Get Distinct Array of productnames of selected swid tags

      this.aggService.saveAggregation(reqbody).subscribe((resp) => {
        console.log('aggregation save successfully');
        this.openModal(successMsg);
        // this.router.navigate(['/optisam/ag/list-aggregation']);
      }, error => {
        this.errorMessage = error && error.error ? error.error.message : '';
        this.openModal(errorMsg);
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

  backToList() {
    this.router.navigate(['/optisam/ag/list-aggregation']);
  }
  
  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
        width: '50%',
        disableClose: true
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
    this.loadingSubscription.unsubscribe();
  }

}
