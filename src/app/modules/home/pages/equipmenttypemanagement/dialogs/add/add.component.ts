// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, ViewChild, ElementRef, inject, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormGroupDirective, NgForm } from '@angular/forms';
import { EquipmentsService } from 'src/app/core/services/equipments.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { MatSort, MatPaginator, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
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
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: RequiredJSONFormat) { }

  ngOnInit() {
    this.getAttributes();
    this.getTypes();
    this.createForm = new FormGroup({
      'type': new FormControl('', [Validators.required, Validators.minLength(1),
      Validators.pattern(/^[-_,A-Za-z0-9]+$/)]),
      'from': new FormControl('', [Validators.required]),
      'root': new FormControl(''),
      // 'parentI': new FormControl('', [Validators.required]),
      'attribute': new FormArray([])
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
      this.primaryKeys[i] = true;
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
    } else {
      this.parentIStatus[this.len] = false;
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

  onSubmit(successMsg,errorMsg) {
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
    if (form_data) {
      this.equipmentTypeService.createEquipments(attributeData)  
        .subscribe(res => {
          this.errorMsg = '';
          this.createForm.reset();
          this.getAttributes();
          this.getTypes();
          this.openModal(successMsg);
        }, err => {
          this.errorMsg = (err.error && err.rooro.message) ? err.error.message : 'Backend validation failed';
          this.openModal(errorMsg);
        });
    }
  }
  onFormReset() {
    this.createForm.reset();
    this.checkStatus = false;
    this.prntChckStats = false;
    this.primaryKeys = [];
    const control = <FormArray>this.createForm.get('attribute');
        for(let i = control.length-1; i >= 0; i--) {
            control.removeAt(i);
    }
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
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }
  filterAttributes(ID) {
    if (ID.isUserInput) {
      this.selectedAttributes = this.metaData.filter(x => x.ID === ID.source.value).map(x => x.attributes);
    }
  }
  reduceMapped_toList(type, selectedAttributes, value) {
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
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  
  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '50%',
      disableClose: true
    });
  } 

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
