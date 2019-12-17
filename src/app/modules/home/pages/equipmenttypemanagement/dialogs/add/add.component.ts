import { Component, OnInit, ViewChild, ElementRef, inject, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormGroupDirective, NgForm } from '@angular/forms';
import { EquipmentsService } from 'src/app/core/services/equipments.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { MatSort, MatPaginator, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RequiredJSONFormat } from '../model';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  createForm: FormGroup;
  value1: string;
  selectedAttributes = [];
  types: any;
  TypeNameMsg: boolean;
  TypeName = [];
  metaData = [];
  primaryKey = [];
  selected1: any;
  primaryKeys = [];
  primaryKeyValue = [];
  parentIStatus = [];
  checked: Boolean = false;
  isdisabled: Boolean = true;
  selectDisabled = true;
  showMsg: any;
  pkMsg: any;
  selectedParent: any;
  value: any;
  checkStatus: Boolean = false;
  len = 0;
  typeArr = [];
  selected = [];
  prntChckStats: Boolean = false;
  errorMsg: String = '';

  constructor(public dialogRef: MatDialogRef<AddComponent>,
    public equipmentTypeService: EquipmentTypeManagementService,
    @Inject(MAT_DIALOG_DATA) public data: RequiredJSONFormat) { }

  ngOnInit() {
    this.getAttributes();
    this.getTypes();
    const attributeArr = new FormArray([]);
    this.createForm = new FormGroup({
      'type': new FormControl('', [Validators.required, Validators.minLength(1),
      Validators.pattern(/^[-_,A-Za-z0-9]+$/)]),
      'from': new FormControl('', [Validators.required]),
      'root': new FormControl(''),
      // 'parentI': new FormControl('', [Validators.required]),
      'attribute': attributeArr
    });
  }
  get type() {
    return this.createForm.get('type');
  }
  get from() {
    return this.createForm.get('from');
  }
  onChangeParentI(event, i) {
    if (event.checked === true) {
      this.selected[i] = 'STRING';
      this.primaryKeyValue[i] = true;
      this.prntChckStats = true;
    } else {
      this.selected[i] = '';
      this.primaryKeyValue[i] = false;
      this.prntChckStats = false;
    }
    for (let j = 0; j <= this.getControls().length - 1; j++) {
      if (event.checked === true) {
        if (i === j) {
          this.parentIStatus[j] = false;
        } else {
          this.parentIStatus[j] = true;
        }
      } else {
        if (i === j) {
        } else {
          this.parentIStatus[j] = false;
        }
      }
    }
  }
  onChange(event, i) {
    if (event.checked === true) {
      this.primaryKey.push();
      this.primaryKeyValue[i] = true;
      this.selected[i] = 'STRING';
      this.parentIStatus[i] = true;
      this.checkStatus = true;
      // this.isdisabled = false;
    } else {
      this.selected[i] = '';
      this.primaryKeyValue[i] = false;
      this.parentIStatus[i] = false;
      this.primaryKey.pop();
      this.checkStatus = false;
      this.value = true;
    }
    for (let j = 0; j <= this.getControls().length - 1; j++) {
      if (event.checked === true) {
        if (i === j) {
          this.primaryKeys[j] = false;
        } else {
          this.primaryKeys[j] = true;
        }
      } else {
        if (i === j) {
        } else {
          this.primaryKeys[j] = false;
        }
      }
    }
  }
  search($event) {
    const q = $event.target.value;
    this.TypeNameMsg = false;
    for (let i = 0; i < this.TypeName.length; i++) {
      this.typeArr[i] = this.TypeName[i].type;
    }

    if (this.typeArr.includes(q.trim())) {
      this.TypeNameMsg = true;
    } else {
      this.TypeNameMsg = false;
    }
  }

  onAddAttribute() {
    this.len = 0;
    this.len = this.getControls().length;
    if (this.checkStatus === true) {
      this.primaryKeys[this.len] = true;
    }
    if (this.prntChckStats === true) {
      this.parentIStatus[this.len] = true;
    }

    (<FormArray>this.createForm.get('attribute')).push(
      new FormGroup({
        'name': new FormControl(null, [Validators.required, Validators.minLength(1),
        Validators.pattern(/^[-_,A-Za-z0-9]+$/)]),
        'data_type': new FormControl(null),
        'primary_key': new FormControl(null),
        'displayed': new FormControl(null),
        'searchable': new FormControl(null),
        'parent_identifier': new FormControl(null),
        'mapped_to': new FormControl(null, [Validators.required]),
        // 'pIdentity': new FormControl(null, [Validators.required]),
      })
    );
  }

  getControls() {
    return (<FormArray>this.createForm.get('attribute')).controls;
  }
  onDeleteAttribute(index: number) {
    const data = this.createForm.value;
    if (this.primaryKeys[index] === false) {
      for (let j = 0; j <= this.getControls().length; j++) {
        this.primaryKeys[j] = false;
      }
    }
    this.parentIStatus[index] = false;
    this.primaryKeys[index] = false;
    this.primaryKeyValue[index] = false;
    (<FormArray>this.createForm.get('attribute')).removeAt(index);
  }

  onSubmit() {
    const form_data = this.createForm.value;
    for (let i = 0; i <= this.selected.length; i++) {
      if (this.selected[i] === 'STRING') {
        form_data.attribute[i].data_type = 'STRING';
      }
    }
    const attributeData = new RequiredJSONFormat;
    attributeData.parent_id = form_data.root;
    attributeData.type = form_data.type;
    attributeData.metadata_id = form_data.from;
    attributeData.attributes = form_data.attribute;
    // console.log('testing submit data', attributeData);
    if (form_data) {
      this.equipmentTypeService.createEquipments(attributeData)
        .subscribe(res => {
          // console.log('Res ==>', res);
          this.errorMsg = '';
          this.createForm.reset();
          this.getAttributes();
          this.getTypes();
          this.dialogRef.close();
        }, err => {
          // console.log('Error ==>', err);
          this.errorMsg = (err.error && err.rooro.message) ? err.error.message : 'Backend validation failed';
        });
    }
  }
  onFormReset() {
    // console.log('frm reset');
    this.createForm.reset();
    // this.editMode=false;
  }
  getTypes() {
    this.equipmentTypeService.getTypes().subscribe(
      (res: any) => {
        this.types = res.equipment_types;
        this.TypeName = res.equipment_types;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }
  getAttributes() {
    this.equipmentTypeService.getMetaData().subscribe(
      (res: any) => {
        this.metaData = res.metadata;
        //  this.metaData.ID = this.metadata_id;
        // console.log('aagya', this.metaData[0].attributes);
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }
  filterAttributes(ID) {
    console.log('test------', ID);
    if (ID.isUserInput) {
      this.selectedAttributes = this.metaData.filter(x => x.ID === ID.source.value).map(x => x.attributes);
     // console.log('the value----', this.selectedAttributes);
    }
  }
  reduceMapped_toList(type, selectedAttributes, value) {
      // console.log('type--------', type);
      // console.log('value--------', value);
      // console.log('selectedAttributes--------', selectedAttributes[value]);
     for ( let  j = 0; j < selectedAttributes[value].length; j++) {
        if (selectedAttributes[value][j] === type) {

         const arr = [];
            for ( let  m = 0; m < selectedAttributes[value].length; m++) {
            if (selectedAttributes[value][m] !== type) {
              arr.push(selectedAttributes[value][m]);
            }
          }
        selectedAttributes[selectedAttributes.length] = arr;
        }
      }

  }
  onSelect(ID) {
    this.selectedParent = ID;
    // console.log(this.selectedParent);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
