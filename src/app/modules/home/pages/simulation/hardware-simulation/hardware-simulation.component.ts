// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { GroupService } from 'src/app/core/services/group.service';
import { Subscription } from 'rxjs';
import { EquipmentsService } from 'src/app/core/services/equipments.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationService } from 'src/app/core/services/configuration.service';
import { MetricService } from 'src/app/core/services/metric.service';
import { isNullOrUndefined, isUndefined } from 'util';
@Component({
  selector: 'app-hardware-simulation',
  templateUrl: './hardware-simulation.component.html',
  styleUrls: ['./hardware-simulation.component.scss']
})
export class HardwareSimulationComponent implements OnInit, OnDestroy {
  simulateObj: any;
  simulatedResults: any[] = [];
  entityList: any[] = [];
  equipmentList: any[] = [];
  identifierEquipment: any;
  attributeArray: any[] = [];
  equipmentMetricList: any[] = [];
  loadingSubscription: Subscription;
  HTTPActivity: Boolean;
  simulateHttpCount: number; // Maintain iteration count for synchronous http call
  simulatedEditors: any[] = [];
  distinctSimulatedEditors: any[] = [];
  simulatedProducts: any[] = [];
  distinctSimulatedProducts: any[] = [];
  filteredSimulatedResults: any[] = [];
  selectedEditor: any;
  selectedProduct:any;
  eqTypeMetadata:any[] = [];
  configurableAttributes:any[] = [];
  configurableAttrData:any[] = [];
  displayEquipList: string[] = [];
  displayEquipListDistinct: string[] = [];
  allConfigurationData: any[]=[];
  configurationData: any[]=[];
  selectedConfigID: any;
  activeAttrName:any;
  tempActiveAttrName:any;
  activeAttrValue:any;
  conflictingAttrFlag:Boolean;
  _loading:Boolean;
  scopesList:any[]=[];
  selectedScope:any;

  constructor(
    private sharedService: SharedService,
    private groupService: GroupService,
    private equipmentService: EquipmentsService,
    private configurationService: ConfigurationService,
    private dialog: MatDialog,
    private metricService: MetricService
  ) {
    this.loadingSubscription = this.sharedService.httpLoading().subscribe(data => {
      this.HTTPActivity = data;
    });
    this.simulateObj = {
      equipmentType: null,
      identifier: '',
      viewEntity: [],
      entity: '',
      currentEntity: ''
    };
    this.simulateHttpCount = 0;
  }

  ngOnInit() {
    this.getScopesList();
  }

  // Get All Equipment types
  getEquipmentList() {
    this._loading = true;
    this.equipmentService.getTypes(this.selectedScope).subscribe((response: any) => {
      this.equipmentList = (response.equipment_types || []).reverse();
      this.getEquipmentsWithConfigurations();
      this._loading = false;
    }, (error) => {
      this._loading = false;
      console.log("Error fetching equipments list", error);
    });
  }

  getScopesList() {
    this._loading = true;
    this.groupService.getDirectGroups().subscribe((response: any) => {
      response.groups.map(res=>{ res.scopes.map(s=>{this.scopesList.push(s);});});
      this._loading = false;
    }, (error) => {
      this._loading = false;
      console.log("Error fetching scopes.");
    });
  }

  // Get Equipment based on identifier
  getEquipmentWithIdentifierList(templateRef) {
    let query = '?scopes=' + this.selectedScope;
    this.equipmentService.getEquipmentTypeWithIdentifier(this.simulateObj.equipmentType.ID, this.simulateObj.identifier, query).subscribe((response: any) => {
      this.identifierEquipment = JSON.parse(response.equipment);
      this.processEquipmentAttributes();
    }, (error) => {
      this.attributeArray = [];
      this.openModal(templateRef,'30%');
      console.log("Error fetching metric");
    });
  }
  // Get the list of equipments which have configurations available for them
  getEquipmentsWithConfigurations() {
    this._loading = true;
    var data=[];
    for (let i = 0; i < this.equipmentList.length; i++) {
      this.configurationService.listConfiguration(this.equipmentList[i].type).subscribe((response: any) => {
        if(response.configurations) {
          this.displayEquipList.push(this.equipmentList[i]);
          response.configurations.map((res)=>{
            data.push({
              'equipment_type': res.equipment_type,
              'config_id': res.config_id,
              'config_name': res.config_name,
              'attributes': res.config_attributes
            });
          });
          this.allConfigurationData = data;
        }
        this._loading = false;
      }, (error) => {
        this._loading = false;
        console.log("Error fetching configurations list", error);
      });
    }
  }

  // Get Metrics of selected equipment type
  getEquipmentMetricListList() {
    this.metricService.getMetricList(this.selectedScope).subscribe((response: any) => {
      this.equipmentMetricList = response.metrices || [];
    }, (error) => {
      console.log("Error fetching metric list");
    });
  }

  // Get list configurations for the selected equipment type
  getConfigurationsList(EquipType) {
    this.configurationData = this.allConfigurationData.filter((res)=> res.equipment_type === EquipType);
  }

  // Get values for selected equipment type
  getAttrValues() {
    // Get configurable attributes for selected equip type
    this.configurableAttributes = [];
    this.configurableAttrData = [];
    this.configurationData.filter((res)=> res.config_id === this.selectedConfigID)[0].attributes.map((attr)=>{
      this.configurableAttributes.push({
        ...attr,
        tempSelectedAttrVal:null,
        selectedAttrVal:null,
        linkedAttrs:[]
      })
    })
    // Get data for these attributes by calling service
    for(let i=0;i<this.configurableAttributes.length;i++) {
      this.equipmentService.getEquipmentTypesAttributes(this.selectedConfigID, this.configurableAttributes[i].attribute_id).subscribe((res:any)=>{
        JSON.parse(atob(res.data)).map(res=>this.configurableAttrData.push(res));
      }, (error) => {
        console.log("Error fetching products");
      });
    }
  }
  // Process the equipment type attributes with actual values from identifier
  processEquipmentAttributes() {
    this.getAttrValues();
    const arr = [];
    this.simulateObj.equipmentType.attributes.forEach(ele => {
      if (ele.data_type === 'INT' || ele.data_type === 'FLOAT') {
        const temp = {
          original_val: this.identifierEquipment[ele.name],
          simulated: false,
          ...ele
        };
        if (ele.data_type === 'INT') {
          temp.int_val_old = this.identifierEquipment[ele.name];
          temp.int_val = this.identifierEquipment[temp.name];
        } else {
          temp.float_val_old = this.identifierEquipment[ele.name];
          temp.float_val = this.identifierEquipment[temp.name];
        }
        arr.push(temp);
      }
    });
    this.attributeArray = arr;
    this.simulatedResults = [];
    this.filteredSimulatedResults =[];
    // this.selectedAttrVal=null;
  }
  // When user selects different value for an attribute
  attrSelectionChanged(attrName: string, value: any, attrChangeConfirmationMsg) {
    this.configurableAttrData.map((res) => {
      if(isNullOrUndefined(value)) {
        this.configurableAttributes.map((attr) => {
          if (attr.attribute_name == attrName) {
            attr.linkedAttrs = [];
          }
        });
        this.conflictingAttrFlag = false
      }
      else {
        if (value && res[attrName] === value) {
        const linkedAttrs = Object.keys(res);
        linkedAttrs.splice(linkedAttrs.indexOf(attrName), 1); //remove the parent attribute from list
        this.configurableAttributes.map((attr) => {
          if (attr.attribute_name == attrName) {
            attr.linkedAttrs = linkedAttrs;
          }
        });
        // if the selection impacts the data changed by other attribute selections, ask for user confirmation
        this.conflictingAttrFlag = false;
        linkedAttrs.forEach(la => {
          for (let i = 0; i < this.configurableAttributes.length; i++) {
            if (this.configurableAttributes[i].attribute_name != attrName && this.configurableAttributes[i].linkedAttrs.indexOf(la) > -1) {
              this.conflictingAttrFlag = true;
              break;
            }
          }
        });
        }
      }
    });      
    if(this.conflictingAttrFlag && this.activeAttrName != attrName) {
      this.tempActiveAttrName = attrName;
      this.activeAttrValue = value;
      this.openModal(attrChangeConfirmationMsg,'40%');
    }
    else {
      this.tempActiveAttrName = attrName;
      this.activeAttrValue = value||null;
      this.changeAttrValues();
    }
  }

  changeAttrValues() {
    this.activeAttrName = this.tempActiveAttrName;
    this.configurableAttributes.map((res)=>{if(res.attribute_name == this.activeAttrName) {res.selectedAttrVal = this.activeAttrValue}});
    this.attributeArray.forEach(ele => {
        this.configurableAttrData.map((res) => {
          if (!this.activeAttrValue) { 
            if (ele.data_type === 'INT') {
              ele.int_val = ele.int_val_old 
            }
            else {
              ele.float_val = ele.float_val_old
            }
          }  
          else if (this.activeAttrValue && res[this.activeAttrName] === this.activeAttrValue) {
            if (ele.data_type === 'INT') {
              ele.int_val = parseInt(res[ele.name] || ele.int_val); 
            }
            else {
              ele.float_val = parseFloat(res[ele.name] || ele.float_val); 
            }
          }
        });
    });
  }

  restoreOldSelection() {
    this.configurableAttributes.map((res)=>{res.tempSelectedAttrVal = res.selectedAttrVal})

  }

  // Function for change in dropdown selection
  selectionChanged(ev: any, type: string) {
    switch (type) {
      case 'scope':
        this.simulateObj.editor = null;
        this.simulateObj.product = null;
        this.getEquipmentList();
        break;

      case 'equipment':
        this.getConfigurationsList(ev.value.type);
        this.getEquipmentMetricListList();
        break;
      
      case 'configuration':
        this.selectedConfigID = ev.value;
        break;

      default:
        break;
    }
  }

  // Simulate results
  simulate() {
    this.simulatedResults = [];
    this.filteredSimulatedResults =[];
    this.selectedEditor = undefined;
    this.selectedProduct = undefined;
    this.simulateHttpCount = this.equipmentMetricList.length;
    const attributes_value = this.attributeArray
                      // .filter(v => v[(v.data_type === 'FLOAT' ? 'float_val_old' : 'int_val_old')] != v[(v.data_type === 'FLOAT' ? 'float_val' : 'int_val')])//v.original_val replaced
                      .map(e => { if(e[(e.data_type === 'FLOAT' ? 'float_val_old' : 'int_val_old')] != e[(e.data_type === 'FLOAT' ? 'float_val' : 'int_val')]){e.simulated = true;} else {e.simulated = false;} return e; });
    const body = {
      equip_type: this.simulateObj.equipmentType.type,
      equip_id: this.simulateObj.identifier,//this.simulateObj.equipmentType.ID,
      attributes: attributes_value,
      scope: this.selectedScope,
      metric_details:[]
    };
    this.equipmentMetricList.map((res,idx)=> {
      body.metric_details.push({"metric_type": this.equipmentMetricList[idx].type,"metric_name": this.equipmentMetricList[idx].name})
    });

    this.equipmentService.equipmentHardwareSimulation(body).subscribe((response: any) => {
      if(response.simulation_result) {
        response.simulation_result.map((res)=>{
          {
            if(res.licenses) {
              res.licenses.map(lic => {
                this.simulatedResults.push({
                  "metric_name" : res.metric_name,
                  "product_name" : lic.product_name,
                  "editor": lic.editor,
                  "swid_tag": lic.swid_tag,
                  "old_licences": lic.old_licences ||null,
                  "new_licenses": lic.new_licenses ||null,
                  "delta" : lic.delta || null
                });
              });
            }
            if(res.sim_failure_reason) {
              // TODO: Uncomment this
              // this.simulatedResults.push({
              //   "metric_name" : res.metric_name,
              //   "sim_failure_reason" : res.sim_failure_reason
              // });
            }
            // this.simulatedResults = response.simulation_result;
          }
        });
        this.simulatedResults.sort((a, b) => a.delta - b.delta);
        this.simulatedEditors = this.simulatedResults.map(res => {if(res.editor) return res.editor});
        this.distinctSimulatedEditors = this.simulatedEditors.filter( this.onlyUnique ); 
        this.simulatedProducts = this.simulatedResults.map(res => {if(res.product_name) return res.product_name});
        this.distinctSimulatedProducts = this.simulatedProducts.filter( this.onlyUnique );
        this.filteredSimulatedResults = this.simulatedResults.filter(()=>true);
        console.log('filteredSimulatedResults : ',this.filteredSimulatedResults);
      }
        // this.callRecursionSimulate(body);
    }, (error) => {
      console.log("Error in simulating metric");
      this.equipmentMetricList.map((res)=>{
        this.simulatedResults.push({
          "metric_name": res.metric_name,
          error: true,
          errorMsg: error.status == 501 ? error.error.message: ''
        });
      });
      
      // this.callRecursionSimulate(body);
    });
      
    // this.callRecursionSimulate(body);
  }

  onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index
  }
  filterResults(ev, filter) {
    if (filter === 'editor') {
      this.selectedProduct = undefined;
      this.simulatedProducts = this.simulatedResults.filter(res => { if ((ev.value == undefined) || (res.editor === ev.value)) return res }).map(p => p.product_name);
      this.distinctSimulatedProducts = this.simulatedProducts.filter(this.onlyUnique);
    }
    this.filteredSimulatedResults = this.simulatedResults.filter(res => { 
      if (filter === 'editor')  { return ((ev.value == undefined) || (res.editor === ev.value)) && ((this.selectedProduct == undefined)||(res.product_name === this.selectedProduct)) } 
      if (filter === 'product') { return (((ev.value == undefined) || (res.product_name === ev.value)) && ((this.selectedEditor == undefined) ||(res.editor === this.selectedEditor))) } 
    });

  }

  // Recursively call HTTP request to make it synchronous
  callRecursionSimulate(body: any) {
    if (!this.simulateHttpCount) {
      this.simulatedResults.sort((a, b) => a.delta - b.delta);
      this.simulatedEditors = this.simulatedResults.map(res => {if(res.editor) return res.editor});
      this.distinctSimulatedEditors = this.simulatedEditors.filter( this.onlyUnique ); 
      this.simulatedProducts = this.simulatedResults.map(res => {if(res.product_name) return res.product_name});
      this.distinctSimulatedProducts = this.simulatedProducts.filter( this.onlyUnique );
      this.filteredSimulatedResults = this.simulatedResults.filter(()=>true);
      return false;
    }

    body.metric_type = this.equipmentMetricList[this.simulateHttpCount - 1].type;
    body.metric_name = this.equipmentMetricList[this.simulateHttpCount - 1].name;
    this.simulateHttpCount -= 1;

    this.equipmentService.equipmentHardwareSimulation(body).subscribe((response: any) => {
      if(response.licenses) {
        this.simulatedResults = this.simulatedResults.concat(response.licenses);
      }
        this.callRecursionSimulate(body);
    }, (error) => {
      console.log("Error in simulating metric");
      this.simulatedResults.push({
        "metric_name": body.metric_name,
        error: true,
        errorMsg: error.status == 501 ? error.error.message: ''
      });
      this.callRecursionSimulate(body);
    });
  }

  // Check if all required parameters available for simulation
  checkValidSimulation(): boolean {
    if (this.attributeArray.length === 0) {
      return true;
    }
    // return !this.attributeArray.some(v => v.original_val != v[(v.data_type === 'FLOAT' ? 'float_val' : 'int_val')]);
    return !this.attributeArray.some(v => v[(v.data_type === 'FLOAT' ? 'float_val_old' : 'int_val_old')] != v[(v.data_type === 'FLOAT' ? 'float_val' : 'int_val')]);
  }

  validateAttributePattern(ev: any, type: string): boolean {
    const regEx = (type === 'FLOAT') ? new RegExp(/^\d*\.?\d*$/) : new RegExp(/^\d*$/);
    const specialKeys: Array<string> = [ 'Backspace', 'Delete', 'End', 'Home'];
    if (!regEx.test(ev.key) && specialKeys.indexOf(ev.key) === -1) {
      return false;
    }
    return true;
  }

  openModal(templateRef,width) {
    let dialogRef = this.dialog.open(templateRef, {
        width: width,
        disableClose: true
    });
  } 

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

}
