// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { RequiredJSONFormat } from './../../equipmenttypemanagement/dialogs/model';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import {MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AddComponent } from '../../equipmenttypemanagement/dialogs/add/add.component';
import { strictEqual } from 'assert';
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



  constructor(public dialogRef: MatDialogRef<AddComponent>,
    public equipmentTypeService: EquipmentTypeManagementService,
    @Inject(MAT_DIALOG_DATA) public data: RequiredJSONFormat) { }

  ngOnInit() {
    this.getTypes();
    this.getMetricList();
    this.getMetricType();
  }
  getMetricType() {
    this.equipmentTypeService.getMetricType().subscribe(res => {
      this.metricType = res.types;
    });
  }
  getMetricList() {
    this.equipmentTypeService.getMetricList().subscribe(res => {
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
      this.coreArr = [];
      this.cpuArr = [];
      this.coreFact = [];
      let count = 0;
      for (let i = 0; i <= data.attributes.length - 1; i++) {
        if (data.attributes[i].data_type === 'FLOAT' || data.attributes[i].data_type === 'INT') {
          count++;
          this.coreArr.push(data.attributes[i]);
          this.attributeArr.push(data.attributes[i]);
        }
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
    console.log('Arraay', this.coreArr);
  }
  onChangeLastEqui($event, data) {
    if (this.lastEquiVal !== $event.source.value) {
      //   this.lastEquiArr.push(data);
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

      console.log('metricTypRe-----', this.metricTypRe);
      console.log('$event.source.value-----', $event.source.value);
    this.metricTypData = data;
    this.typeDescription = null;
    this.value = null;
    this.value = $event.source.value;
    for (let i = 0; i <= this.metricType.length - 1; i++) {
      if (this.metricType[i].name === this.value) {
       // this.typeDescription = this.metricType[i].description;
       this.typeDescription = 'Number of processor licenses required = CPU nb x Core (per CPU) nb x CoreFactor';
        this.href = this.metricType[i].href;
        this.type_id = this.metricType[i].type_id;
        console.log('href---------', this.href);
        console.log('this.type_id---------', this.type_id);

        break;
      } else {
        this.typeDescription = '';
      }
      this.getValididty();
    }
  }
  }
  search($event) {
    const q = $event.target.value;
    this.searchTypeEvent = $event;
    this.TypeNameMsg = false;
    this.metricTypeName = $event.target.value;
    for (let i = 0; i <= this.metricList.length - 1; i++) {
      this.typeArr[i] = this.metricList[i].name.toLowerCase();
    }
    if (this.typeArr.includes(q.trim().toLowerCase())) {
      this.TypeNameMsg = true;
    } else {
      this.TypeNameMsg = false;
    }
    this.getValididty();
  }

  onSubmit() {
    const splithref = this.href.split('/v1');
    const metricData = {
      'ID': '',
      'Name': this.metricTypeName.trim(),
      'num_core_attr_id': this.coreId,
      'core_factor_attr_id': this.factorId,
      'numCPU_attr_id': this.cpuId,
      'start_eq_type_id': this.startEquId,
      'base_eq_type_id': this.baseEquId,
      'aggerateLevel_eq_type_id': this.aggEquiId,
      'end_eq_type_id': this.endEquId,
    };
    this.equipmentTypeService.createMetric(metricData, splithref[splithref.length - 1])
      .subscribe(res => {
        console.log('res---------', res);
      });
  }
  onFormReset() {
    // console.log('frm reset');
    // this.editMode=false;
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
    this.types = [];
    this.refEquArr = [];
    this.coreArr = [];
    this.cpuArr = [];
    this.coreFact = [];
    this.aggArr = [];
    this.lastEquiArr = [];
    this.metricType = [];
    this.typeDescription = null;
    this.getTypes();
    this.getMetricList();
    this.getMetricType();
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


  }
  getValididty() {
   // this.creatBtnVis = true;
    if ( this.type_id === 'Oracle_Processor') {
    if (this.startEquId != null && this.coreId != null && this.factorId != null  && this.baseEquId != null
      && this.aggEquiId != null && this.endEquId != null && this.metricTypeName != null && this.value != null &&
      this.metricTypeName !== '' && this.firstEqui != null && this.coreFacAttri != null && this.aggreLvl != null) {
      this.creatBtnVis = false;
    } else {
      this.creatBtnVis = true;
    }
  } else {
    console.log('metricTypRe', this.metricTypRe);
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
        console.log('res.equipment_types----', res.equipment_types);
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
