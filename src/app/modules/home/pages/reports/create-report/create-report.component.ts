// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DialogData } from '../../../dialogs/product-details/details';
import { GroupService } from 'src/app/core/services/group.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from 'src/app/core/services/product.service';
import { ReportService } from 'src/app/core/services/report.service';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.scss']
})
export class CreateReportComponent implements OnInit {
  scopesList: any[]=[];
  selectedScope:any;
  reportTypesList: any[]=[];
  selectedReportType: any;
  editorsList:any[]=[];
  productsList:any[]=[];
  equipmentTypesList:any[]=[];
  reportForm: FormGroup;
  _loading: Boolean = true;
  reqInProgress: Boolean;

  constructor(private groupService: GroupService,
              private productService: ProductService,
              private reportService: ReportService,
              private equipmentService: EquipmentTypeManagementService,
              private dialog:MatDialog) { }

  ngOnInit() {
    this.initForm();
    this.getScopesList();
    this.getReportsList();
  }

  initForm() {
    this.reportForm = new FormGroup({
      'scope': new FormControl(null, [Validators.required]),
      'reportType': new FormControl(null, [Validators.required])
    });
  }

  get scope() {
    return this.reportForm.get('scope');
  }  

  get reportType() {
    return this.reportForm.get('reportType');
  }

  get editor() {
    return this.reportForm.get('editor');
  }

  get product() {
    return this.reportForm.get('product');
  }

  get equipmentType() {
    return this.reportForm.get('equipmentType');
  }
  

  getScopesList() {
    this._loading = true;
    this.groupService.getDirectGroups().subscribe((response: any) => {
      response.groups.map(res=>{ res.scopes.map(s=>{this.scopesList.push(s);});});
      this._loading = false;
    }, (error) => {
      this._loading = false;
      console.log("Error fetching groups");
    });
  }

  scopeSelected() {
    this.selectedScope = this.scope.value;
    this.reportForm.removeControl('editor');
    this.reportForm.removeControl('product');
    this.reportForm.removeControl('equipmentType');
    this.editorsList = [];
    this.productsList = [];
    this.reportForm.markAsPristine();
    if(this.reportType.value && (this.reportType.value.report_type_name == 'compliance' || this.reportType.value.report_type_name == 'ProductEquipments')) {
      this.reportForm.addControl('editor', new FormControl(null,[Validators.required]));
      this.reportForm.addControl('product', new FormControl(null,[Validators.required]));
      if(this.reportType.value.report_type_name == 'ProductEquipments') {
        this.reportForm.addControl('equipmentType', new FormControl(null,[Validators.required]));
      }
      this.getEditorsList();
    }
  }

  getReportsList() {
    this._loading = true;
    this.reportService.getReportTypes().subscribe(res=>{
      this.reportTypesList = res.report_type||[];
      this._loading = false;
    },err=>{
      this._loading = false;
      console.log('Some error occured! Could not fetch report types.')
    });
  }

  reportTypeSelected() {
    this.reportForm.removeControl('editor');
    this.reportForm.removeControl('product');
    this.reportForm.removeControl('equipmentType');
    this.selectedReportType = this.reportType.value.report_type_name;
    if(this.reportType.value.report_type_name == 'compliance' || this.reportType.value.report_type_name == 'ProductEquipments') {
      this.reportForm.addControl('editor', new FormControl(null,[Validators.required]));
      this.reportForm.addControl('product', new FormControl(null,[Validators.required]));
      if(this.reportType.value.report_type_name == 'ProductEquipments') {
        this.reportForm.addControl('equipmentType', new FormControl(null,[Validators.required]));
        this.getEquipTypes();
      }
      this.getEditorsList();
    }
  }

  // Get All Editors
  getEditorsList() {
    this._loading = true;
    let query = '?scopes=' + this.scope.value;
    this.productService.getEditorList(query).subscribe((response: any) => {
        this.editorsList = response.editors || [];
        this._loading = false;
      }, (error) => {
        this._loading = false;
        console.log("Error fetching editors");
    });
  }

  editorSelected() {    
    this.getProductsList();
  }

  // Get All Products based on Editor
  getProductsList() {
    this._loading = true;
    let query = '?scopes=' + this.scope.value;
    query += '&editor='+ this.editor.value;

    this.productService.getProductList(query).subscribe((response: any) => {
      this.productsList = response.products || [];
      this._loading = false;
    }, (error) => {
      this._loading = false;
      console.log("Error fetching products");
    });
  }

  // Get list of equipment types
  getEquipTypes() {
    this._loading = true;
    this.equipmentService.getAllTypes().subscribe((res:any) => {
        this.equipmentTypesList = res.equipment_types || [];
        this._loading = false;
      },(error) => {
        this._loading = false;
        console.log('Error fetching equipment types.');
      });
  }

  createReport(successMsg, errorMsg) {
    this.reqInProgress = true;
    let body;
    if(this.reportType.value.report_type_name == 'compliance') {  
      body = {
        "scope"           : this.scope.value,
        "report_type_id"  : this.reportType.value.report_type_id,
        "acqrights_report": {
                              "editor": this.editor.value,
                              "swidtag": this.product.value
                            }
      }
    }
    else if(this.reportType.value.report_type_name == 'ProductEquipments') {  
      body = {
        "scope"           : this.scope.value,
        "report_type_id"  : this.reportType.value.report_type_id,
        "product_equipments_report": {
                                        "editor": this.editor.value,
                                        "swidtag": this.product.value,
                                        "equipType": this.equipmentType.value.type
                                      }
      }
    }
    this.reportService.createReport(body).subscribe(res=>{
      this.openModal(successMsg);
      this.reqInProgress = false;
    },err=>{
      console.log('Error occured -', err);
      this.reqInProgress = false;
      this.openModal(errorMsg);
    });
  }

  toggleSelectAll(ev) {   
    if(ev._selected){
      let allProductSwidTags = this.productsList.map((p)=>p.swidTag);
      this.product.setValue(allProductSwidTags);
      ev._selected=true;
    }
    if(ev._selected==false){
      this.product.setValue([]);
    }
    
  }

  resetForm() {
    this.reportForm.reset();
    this.selectedScope = null;
    this.selectedReportType = null;
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
        width: '30%',
        disableClose: true
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
