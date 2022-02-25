import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  selectedScope:any;
  reportTypesList: any[]=[];
  selectedReportType: any;
  editorsList:any[]=[];
  productsList:any[]=[];
  equipmentTypesList:any[]=[];
  reportForm: FormGroup;
  _loading: Boolean = true;
  reqInProgress: Boolean;

  constructor(private productService: ProductService,
              private reportService: ReportService,
              private equipmentService: EquipmentTypeManagementService,
              private dialog:MatDialog) { 
                this.selectedScope = localStorage.getItem('scope');
              }

  ngOnInit() {
    this.initForm();
    this.getEditorsList();
    this.getReportsList();
  }

  initForm() {
    this.reportForm = new FormGroup({
      'reportType': new FormControl(null, [Validators.required])
    });
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
    if(this.reportType.value.report_type_name == 'Compliance' || this.reportType.value.report_type_name == 'ProductEquipments') {
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
    let query = '?scopes=' + this.selectedScope;
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
    let query = '?scopes=' + this.selectedScope;
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
    this.equipmentService.getTypes(this.selectedScope).subscribe((res:any) => {
        this.equipmentTypesList = (res.equipment_types || []).reverse();
        this._loading = false;
      },(error) => {
        this._loading = false;
        console.log('Error fetching equipment types.');
      });
  }

  createReport(successMsg, errorMsg) {
    this.reqInProgress = true;
    let body;
    if(this.reportType.value.report_type_name == 'Compliance') {  
      body = {
        "scope"           : this.selectedScope,
        "report_type_id"  : this.reportType.value.report_type_id,
        "acqrights_report": {
                              "editor": this.editor.value,
                              "swidtag": this.product.value
                            }
      }
    }
    else if(this.reportType.value.report_type_name == 'ProductEquipments') {  
      body = {
        "scope"           : this.selectedScope,
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
