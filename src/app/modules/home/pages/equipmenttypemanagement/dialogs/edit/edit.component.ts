
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApplicationService } from 'src/app/core/services/application.service';
import { Router } from '@angular/router';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { DialogData } from 'src/app/modules/home/dialogs/product-details/details';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { ModifyJSONFormat } from './model';
import { RequiredJSONFormat } from '../model';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  id: any;
  type: any;
  metadata_source: any;
  attributes: any;
  parent_id: any;
  attributeForm: FormGroup;
  createForm: FormGroup;
  value1: string;
  selectedAttributes = [];
  types: any;
  metaData = [];
  primaryKeyValue = [];
  checked: Boolean = false;
  selectDisabled = true;
  showMsg: any;
  pkMsg: any;
  selectedParent: any;
  value: any;
  parent_type: any;
  metadata_id: String;
  parentId: String;

  constructor(public equipmentTypeService: EquipmentTypeManagementService,
  public dialogRef: MatDialogRef<EditComponent>,
  @Inject(MAT_DIALOG_DATA) public data: RequiredJSONFormat) { }

  attribute = this.data.attributes;

  displayedColumns = ['name', 'data_type', 'mapped_to', 'searchable', 'displayed' ];
  public formDisabled = false;

  ngOnInit() {
    console.log('modify data', this.data);
    this.type = this.data['type'];
    this.id = this.data['id'];
    this.metadata_id = this.data['metadata_id'];
    this.metadata_source = this.data['metadata_source'];
    this.parent_type = this.data['parent_type'];
    console.log( 'play with parer----', this.parent_type);
    if (this.parent_type === undefined || this.parent_type === 'undefined' || this.parent_type === null) {
      this.parentId = '1';
      this.getTypes();
    } else {
      this.parentId = '2';
    }
   this.getMappedSource();
    // this.RenderDataTable();
    const attributeArr = new FormArray([]);
    this.attributeForm = new FormGroup({
        'from': new FormControl({ disabled: true}),
        'root': new FormControl(''),
        // 'parentI': new FormControl('', [Validators.required]),
      'attribute': attributeArr
    });
  }
  getTypes() {
    this.equipmentTypeService.getTypes().subscribe(
      (res: any) => {
        this.types = res.equipment_types;
       // this.TypeName = res.equipment_types;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }
  onAddAttribute() {
    (<FormArray>this.attributeForm.get('attribute')).push(
      new FormGroup({
        'name': new FormControl(null, [Validators.required, Validators.minLength(1),
        Validators.pattern(/^[-_,A-Za-z0-9]+$/)]),
        'data_type': new FormControl(null, [Validators.required]),
        'displayed': new FormControl(null),
        'searchable': new FormControl(null),
        'mapped_to': new FormControl(null, [Validators.required]),
        // 'pIdentity': new FormControl(null, [Validators.required]),
      })
    );
  }
  // RenderDataTable() {

  // }
  getControls() {
    return (<FormArray>this.attributeForm.get('attribute')).controls;
  }
  onDeleteAttribute(index: number) {
    // const data = this.createForm.value;
    // if (data.attribute[index].primary_key && this.primaryKey.length > 1) {
    //   this.primaryKey.pop();
    // }
    // console.log(this.primaryKey);
    (<FormArray>this.attributeForm.get('attribute')).removeAt(index);
  }

  modifyAttribute() {
    const attribute_data = this.attributeForm.value;
    const attributeData = new ModifyJSONFormat;
    // attributeData.parent_id = attribute_data.from;
    attributeData.attributes = attribute_data.attribute;
    if (attribute_data) {
      this.equipmentTypeService.updateAttribute(this.id, attributeData)
      .subscribe(res => {
        this.attributeForm.reset();
      });
    }
  }
  onFormReset() {
    // console.log('frm reset');
    this.attributeForm.reset();
    // this.editMode=false;
  }
  getMappedSource() {
    this.equipmentTypeService.getMappedSource(this.metadata_id).subscribe(
      (res: any) => {
        this.metaData = res.attributes;
        //  this.metaData.ID = this.metadata_id;
        console.log('aagya', this.metaData);
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }
  // filterAttributes(ID) {
  //   if (ID.isUserInput) {
  //     this.selectedAttributes = this.metaData.filter(x => x.ID === ID.source.value).map(x => x.attributes);
  //     console.log(this.selectedAttributes);
  //   }
  // }
  onSelect(ID) {
    this.selectedParent = ID;
    console.log(this.selectedParent);
  }
    onNoClick(): void {
    this.dialogRef.close();
  }
}
