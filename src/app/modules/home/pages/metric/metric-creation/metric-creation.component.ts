// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { RequiredJSONFormat } from './../../equipmenttypemanagement/dialogs/model';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { AddComponent } from '../../equipmenttypemanagement/dialogs/add/add.component';
import { strictEqual } from 'assert';
import { MetricService } from 'src/app/core/services/metric.service';
@Component({
  selector: 'app-metric-creation',
  templateUrl: './metric-creation.component.html',
  styleUrls: ['./metric-creation.component.scss']
})
export class MetricCreationComponent implements OnInit {

  createForm: FormGroup;
  types = [];
  TypeNameMsg: boolean;
  len = 0;
  typeArr = [];
  metricList = [];
  metricType = [];
  typeDescription = '';
  firstEqui: String;
  refEqui: String;
  lastEqui: String;
  aggLvl: String;
  refEquStatus: Boolean = true;
  coreEquStatus: Boolean = true;
  cpuEquStatus: Boolean = true;
  coreFactor: Boolean = true;
  reqAttri: Boolean = false;
  aggrEquStatus: Boolean = true;
  lastEquStatus: Boolean = true;
  refEquArr = [];
  coreArr = [];
  aggArr = [];
  lastEquiArr = [];
  coreAttri: String;
  cpuAtrri: String;
  coreFacAttri: String;
  cpuArr = [];
  coreFact = [];
  attributeArr = [];
  aggreLvl: String;
  lastEquiVal: String;
  metricTypeName: String;
  cpuId: String;
  coreId: String;
  factorId: String;
  startEquId: String;
  baseEquId: String;
  equType: String;
  aggEquiId: String;
  value: String;
  endEquId: String;
  typeName: String = null;
  creatBtnVis: Boolean = true;
  metricTypRe: String;
  searchTypeEvent: any;
  href;
  type_id;
  metricTypData;
  number_of_users: Number;
  equipID: any;
  attrName: String;
  attrValue: any;
  attrDataType: any;
  metricData: any;
  coefficient:any;

  constructor(public dialogRef: MatDialogRef<AddComponent>,
    public equipmentTypeService: EquipmentTypeManagementService,
    private metricService: MetricService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: RequiredJSONFormat) { }

  ngOnInit() {
    this.getTypes();
    this.getMetricList();
    this.getMetricType();
  }
  getMetricType() {
    this.metricService.getMetricType().subscribe(res => {
      this.metricType = res.types;
    });
  }
  getMetricList() {
    this.metricService.getMetricList().subscribe(res => {
      this.metricList = res.metrices;
    });
  }
  onChangefirstEqui($event, data) {
    if (this.firstEqui !== $event.source.value) {
      this.refEquStatus = false;
      this.startEquId = data.ID;
      this.refEquArr = [];
      this.refEquArr.push(data);
      let parentID = data.parent_id;
      for (let i = 0; i <= this.types.length - 1; i++) {
        if (this.types[i].ID === parentID) {
          this.refEquArr.push(this.types[i]);
          const ObjKey = Object.keys(this.types[i]);
          if (ObjKey.includes('parent_id')) {
            parentID = this.types[i].parent_id;
            i = -1;
          }
        }
      }
      this.getValididty();
    }
  }
  onCoreChange($event, data) {
    if (this.coreAttri !== $event.source.value) {
      this.cpuArr = [];
      this.coreFact = [];
      this.coreId = data.ID;
      this.cpuId = null;
      this.cpuAtrri = '';
      this.factorId = null;
      this.coreFacAttri = '';
      for (let i = 0; i <= this.coreArr.length - 1; i++) {
        if (this.coreArr[i].name !== data.name) {
          this.cpuArr.push(this.coreArr[i]);

        }
      }
      this.getValididty();
    }
  }
  onCpuChange($event, data) {
    if (this.cpuAtrri !== $event.source.value) {
      this.coreFact = [];
      this.cpuId = data.ID;
      this.factorId = null;
      this.coreFacAttri = '';
      for (let i = 0; i <= this.cpuArr.length - 1; i++) {
        if (this.cpuArr[i].name !== data.name) {
          this.coreFact.push(this.cpuArr[i]);

        }
      }
      this.getValididty();
    }
  }
  onCoreFactorChange($event, data) {
    if (this.coreFacAttri !== $event.source.value) {
      this.factorId = data.ID;
      this.getValididty();
    }
  }


  onChangeRefEqui($event, data) {
    if (this.refEqui !== $event.source.value) {
      this.reqAttri = false;
      this.baseEquId = data.ID;
      this.equType = data.type;
      this.coreArr = [];
      this.cpuArr = [];
      this.coreFact = [];
      let count = 0;
      this.attributeArr=[];
      for (let i = 0; i <= data.attributes.length - 1; i++) {
        if (data.attributes[i].data_type === 'FLOAT' || data.attributes[i].data_type === 'INT') {
          count++;
          this.coreArr.push(data.attributes[i]);
        }
        this.attributeArr.push(data.attributes[i]);
      }
      if (count >= 3) {
        this.reqAttri = false;
      } else {
        this.reqAttri = true;
      }
      let parentID = data.parent_id;
      this.aggArr = [];
      this.aggArr.push(data);
      for (let i = 0; i <= this.types.length - 1; i++) {
        if (this.types[i].ID === parentID) {
          this.aggArr.push(this.types[i]);
          const ObjKey = Object.keys(this.types[i]);
          if (ObjKey.includes('parent_id')) {
            parentID = this.types[i].parent_id;
            i = -1;
          }
        }
      }
      this.getValididty();
    }
  }
  onChangeLastEqui($event, data) {
    if (this.lastEquiVal !== $event.source.value) {
      this.endEquId = data.ID;
      this.getValididty();
    }
  }
  onChangeAggrLvl($event, data) {
    if (this.aggreLvl !== $event.source.value) {
      this.lastEquiArr = [];
      this.aggEquiId = data.ID;
      this.lastEquiArr.push(data);
      let parentID = data.parent_id;
      for (let i = 0; i <= this.types.length - 1; i++) {
        if (this.types[i].ID === parentID) {
          this.lastEquiArr.push(this.types[i]);
          const ObjKey = Object.keys(this.types[i]);
          if (ObjKey.includes('parent_id')) {
            parentID = this.types[i].parent_id;
            i = -1;
          }
        }
      }
      this.getValididty();
    }
  }
  onChangeMetricType($event, data) {
    if (this.metricTypRe !== $event.source.value) {
    this.metricTypData = data;
    this.typeDescription = null;
    this.value = null;
    this.value = $event.source.value;
    this.number_of_users = null;
    this.coefficient = null;
    for (let i = 0; i <= this.metricType.length - 1; i++) {
      if (this.metricType[i].name === this.value) {
       this.typeDescription = this.metricType[i].description;
        this.href = this.metricType[i].href;
        this.type_id = this.metricType[i].type_id;

        break;
      } else {
        this.typeDescription = '';
      }
      this.getValididty();
    }
  }
  }

  onChangeAttr(data) {
    this.attrValue = null;
    this.attrDataType = data.data_type;
  }

  setAttrVal() {
    console.log(this.attrValue);
  }
  search($event) {
    const q = $event.target.value;
    this.searchTypeEvent = $event;
    this.TypeNameMsg = false;
    this.metricTypeName = $event.target.value;
    for (let i = 0; i <= this.metricList.length - 1; i++) {
      if(this.metricList[i].name)
        this.typeArr[i] = this.metricList[i].name.toLowerCase();
      else
        this.typeArr[i] = '';
    }
    if (this.typeArr.includes(q.trim().toLowerCase())) {
      this.TypeNameMsg = true;
    } else {
      this.TypeNameMsg = false;
    }
    this.getValididty();
  }

  onSubmit(successMsg, errorMsg) {
    const splithref = this.href.split('/v1');
    if(splithref[splithref.length - 1] === '/metric/acs'){
      this.metricData = {
        'ID': '',
        'name': this.metricTypeName.trim(),
        'eq_type': this.equType,
        'attribute_name': this.attrName,
        'value': this.attrValue
      }
    }
    else if(splithref[splithref.length - 1] === '/metric/inm') {
      this.metricData = {
        'ID': '',
        'Name': this.metricTypeName.trim(),
        'Coefficient': this.coefficient
      }
    }
    else {
      this.metricData = {
      'ID': '',
      'Name': this.metricTypeName.trim(),
      'num_core_attr_id': this.coreId,
      'core_factor_attr_id': this.factorId,
      'numCPU_attr_id': this.cpuId,
      'start_eq_type_id': this.startEquId,
      'base_eq_type_id': this.baseEquId,
      'aggerateLevel_eq_type_id': this.aggEquiId,
      'end_eq_type_id': this.endEquId,
      'number_of_users': Number(this.number_of_users || 0)
    };}

    this.metricService.createMetric(this.metricData, splithref[splithref.length - 1])
      .subscribe(res => {
        this.openModal(successMsg);
      },error => {
        console.log('An error occured.', error);
        this.openModal(errorMsg);
      });
  }
  onFormReset() {
    'use strict';
    this.typeName = null;
    this.startEquId = null;
    this.metricTypeName = null;
    this.coreId = null;
    this.factorId = null;
    this.cpuId = null;
    this.startEquId = null;
    this.baseEquId = null;
    this.aggEquiId = null;
    this.endEquId = null;
    // this.types = [];
    this.refEquArr = [];
    this.coreArr = [];
    this.cpuArr = [];
    this.coreFact = [];
    this.aggArr = [];
    this.lastEquiArr = [];
    // this.metricType = [];
    this.typeDescription = null;
    // this.getTypes();
    // this.getMetricList();
    // this.getMetricType();
    this.creatBtnVis = true;
    this.firstEqui = null;
    this.metricTypRe = null;
    this.refEqui = null;
    this.coreAttri = null;
    this.cpuAtrri = null;
    this.coreFacAttri = null;
    this.aggreLvl = null;
    this.lastEquiVal =  null;
    this.typeName = null;
    this.value = '';
    this.searchTypeEvent.target.value = null;
    this.creatBtnVis = true;
    this.metricTypData = null;
    this.number_of_users = null;
    this.coefficient = null;
    this.attrName = null;
    this.attrValue = null;
    this.attrDataType = null;
    this.TypeNameMsg = false;
  }
  getValididty() {
    // this.creatBtnVis = true;
    if ( this.type_id === 'Oracle_Processor') {
      if (this.startEquId != null && this.coreId != null && this.factorId != null  && this.baseEquId != null
        && this.aggEquiId != null && this.endEquId != null && this.metricTypeName != null && this.value != null &&
        this.metricTypeName !== '' && this.firstEqui != null && this.coreFacAttri != null && this.aggreLvl != null) {
        this.creatBtnVis = false;
      } else {
        if (this.type_id === 'Oracle_NUP' && (!this.number_of_users || this.number_of_users < 1)) {
          this.creatBtnVis = false;
        } else {
          this.creatBtnVis = true;
        }
      }
    } 
    else if ( this.type_id === 'Attr_Counter') {
      if(this.metricTypeName != null && this.value != null && this.metricTypeName !== '' && this.baseEquId != null && 
        this.metricTypData != null && this.attrName !=null && this.attrValue != null && this.attrValue != '') {
          this.creatBtnVis = false;
        }
      else {
        this.creatBtnVis = true;
      }
    }
    else if( this.type_id === 'Instance_Number') {
      if(this.coefficient != null) { this.creatBtnVis = false }
      else { this.creatBtnVis = true }
    }
    else {
      if (this.coreId != null && this.factorId != null  && this.metricTypeName != null && this.value != null
        && this.metricTypeName !== ''   && this.coreAttri != null
        && this.baseEquId != null && this.metricTypData != null) {
        this.creatBtnVis = false;
      } else {
        this.creatBtnVis = true;
      }
    }

  }
  getTypes() {
    this.equipmentTypeService.getTypes().subscribe(
      (res: any) => {
        this.types = res.equipment_types;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  validateFloat(ev) {
    return this.validatePattern(ev,'FLOAT');
  }

  validatePattern(ev: any, attrType ?: any) {
    var regEx;
    const type = this.attrDataType;
    if(type) {
      regEx = (type === 'FLOAT') ? new RegExp(/^\d*\.?\d*$/) :((type== 'INT')?new RegExp(/^\d*$/): new RegExp(/[\w]/));
    }
    else { regEx = new RegExp('^[0-9]*$'); }
    const specialKeys: Array<string> = [ 'Backspace', 'Delete', 'End', 'Home' , 'Enter'];
    if(attrType) {
      regEx = new RegExp(/^\d*\.?\d*$/);
    }
    if (!regEx.test(ev.key) && specialKeys.indexOf(ev.key) === -1) {
      return false;
    }
    else {
      return true;}
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
