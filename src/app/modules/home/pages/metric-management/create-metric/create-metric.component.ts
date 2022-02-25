import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { MetricService } from 'src/app/core/services/metric.service';

@Component({
  selector: 'app-create-metric',
  templateUrl: './create-metric.component.html',
  styleUrls: ['./create-metric.component.scss']
})
export class CreateMetricComponent implements OnInit, AfterViewInit {
  metricForm: FormGroup;
  selectedScope: string;
  _loading: Boolean;
  errorMessage: string;
  metricsList: any[] = [];
  metricTypesList: any[] = [];
  selectedMetricTypeId: string;
  equipmentsTypesList: any[] = [];
  firstEquipmentsList: any[] = [];
  referenceEquipmentsList: any[] = [];
  coresList: any[] = [];
  cpusList: any[] = [];
  corefactorsList: any[] = [];
  aggregationLevelsList: any[] = [];
  lastEquipmentsList: any[] = [];
  attributesList: any[] = [];
  selectedAttributeDatatype: string = '';
  zeroValueMsg: string;

  constructor(private equipmentTypeService: EquipmentTypeManagementService,
    private metricService: MetricService,
    public dialog: MatDialog) {
    this.selectedScope = localStorage.getItem('scope');
    this.getMetricList();
    this.getMetricTypes();
  }

  ngOnInit(): void {
    this.setFormData();
  }

  ngAfterViewInit() {
    this.metricForm.valueChanges.subscribe(res => {
      if (this.selectedMetricTypeId === 'Attr_Counter') {
        if (this.selectedAttributeDatatype !== 'STRING' && res.configuration?.value) {
          this.validateNonZero(res.configuration.value);
        }
      }
      else if (this.selectedMetricTypeId === 'Attr_Sum') {
        this.validateNonZero(res.configuration?.referenceValue);
      }
    })
  }

  setFormData() {
    this.selectedMetricTypeId = '';
    this.metricForm = new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9-_.]*$/), this.duplicateName]),
      'type': new FormControl('', [Validators.required]),
      'description': new FormControl({ value: '', disabled: true }, [Validators.required]),
      'configuration': new FormGroup({})
    });
  }

  get name() {
    return this.metricForm.get('name');
  }
  get type() {
    return this.metricForm.get('type');
  }
  get description() {
    return this.metricForm.get('description');
  }
  get configuration() {
    return this.metricForm.get('configuration');
  }
  get firstEquipment() {
    return this.configuration.get('firstEquipment');
  }
  get referenceEquipment() {
    return this.configuration.get('referenceEquipment');
  }
  get core() {
    return this.configuration.get('core');
  }
  get cpu() {
    return this.configuration.get('cpu');
  }
  get corefactor() {
    return this.configuration.get('corefactor');
  }
  get aggregationLevel() {
    return this.configuration.get('aggregationLevel');
  }
  get lastEquipment() {
    return this.configuration.get('lastEquipment');
  }
  get noOfUsers() {
    return this.configuration.get('noOfUsers');
  }
  get attributeName() {
    return this.configuration.get('attributeName');
  }
  get value() {
    return this.configuration.get('value');
  }
  get noOfDeployments() {
    return this.configuration.get('noOfDeployments');
  }
  get referenceValue() {
    return this.configuration.get('referenceValue');
  }

  getEqpNameByID(equipID) {
    return this.equipmentsTypesList.filter(eq => eq.ID === equipID)[0].type;
  }

  // Validators
  duplicateName(input) {
    const value = input.value;
    const metricsList = JSON.parse(localStorage.getItem('existingMetricNames'));
    return (value && metricsList.includes(value)) ? {
      duplicateName: true
    } : null;
  }

  // Validate Input data depending upon the datatype of selected attribute
  validatePattern(input) {
    let regEx;
    const specialKeys: Array<string> = ['Backspace', 'Delete', 'End', 'Home'];
    if (this.selectedAttributeDatatype === 'FLOAT') {
      regEx = new RegExp(/^\d*\.?\d*$/);
    }
    else if (this.selectedAttributeDatatype === 'INT') {
      regEx = new RegExp(/^\d*$/);
    }
    else {
      regEx = new RegExp(/[\w]/);
    }
    return (!regEx.test(input.key) && specialKeys.indexOf(input.key) === -1) ? false : true;
  }

  validateNonZero(value) {
    if (Number(value) > 0) {
      this.zeroValueMsg = null;
    }
    else if (Number(value) !== 0) {
      this.zeroValueMsg = 'Invalid float/int value'
    }
    else {
      this.zeroValueMsg = 'Value should be greater than 0';
    }
  }

  // Get existing metric names
  getMetricList() {
    this.metricService.getMetricList().subscribe(res => {
      this.metricsList = res.metrices.map(m => m.name);
      localStorage.setItem('existingMetricNames', JSON.stringify(this.metricsList));
    });
  }
  // Get metric types
  getMetricTypes() {
    this.metricService.getMetricType(this.selectedScope).subscribe(res => {
      this.metricTypesList = res.types || [];
    });
  }

  // Get Equipment Types
  getEquipmentsTypes() {
    this.equipmentTypeService.getTypes(this.selectedScope).subscribe((res: any) => {
      // For Attr_Sum, only consider equipment with numeric attributes('INT' and 'FLOAT')
      if (this.selectedMetricTypeId === 'Attr_Sum') {
        this.equipmentsTypesList = res.equipment_types
          .filter(e => (e.attributes.map(attr => attr.data_type).includes('FLOAT') ||
            e.attributes.map(attr => attr.data_type).includes('INT'))).reverse();
      }
      else {
        this.equipmentsTypesList = (res.equipment_types || []).reverse();
      }
      this.firstEquipmentsList = this.equipmentsTypesList;
    },
      error => {
        console.log('Some error occured! Could not fetch equipment types. Error: ', error);
      });
  }

  metricSelected(name) {
    this.resetListVariables();
    let configControls;
    const selectedMetric = this.metricTypesList.filter(m => m.name === name)[0];
    this.selectedMetricTypeId = selectedMetric.type_id;
    this.description.setValue(selectedMetric.description);
    this.getEquipmentsTypes();
    switch (this.selectedMetricTypeId) {
      case 'Oracle_Processor':
        configControls = new FormGroup({
          'firstEquipment': new FormControl('', [Validators.required]),
          'referenceEquipment': new FormControl('', [Validators.required]),
          'core': new FormControl('', [Validators.required]),
          'cpu': new FormControl('', [Validators.required]),
          'corefactor': new FormControl('', [Validators.required]),
          'aggregationLevel': new FormControl('', [Validators.required]),
          'lastEquipment': new FormControl('', [Validators.required])
        });
        break;
      case 'SAG_Processor':
      case 'IBM_PVU':
        configControls = new FormGroup({
          'referenceEquipment': new FormControl('', [Validators.required]),
          'core': new FormControl('', [Validators.required]),
          'corefactor': new FormControl('', [Validators.required])
        });
        break;
      case 'Oracle_NUP':
        configControls = new FormGroup({
          'firstEquipment': new FormControl('', [Validators.required]),
          'referenceEquipment': new FormControl('', [Validators.required]),
          'core': new FormControl('', [Validators.required]),
          'cpu': new FormControl('', [Validators.required]),
          'corefactor': new FormControl('', [Validators.required]),
          'aggregationLevel': new FormControl('', [Validators.required]),
          'lastEquipment': new FormControl('', [Validators.required]),
          'noOfUsers': new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[1-9])\d*$/)]) //INT
        });
        break;
      case 'Attr_Counter':
        configControls = new FormGroup({
          'referenceEquipment': new FormControl('', [Validators.required]),
          'attributeName': new FormControl('', [Validators.required]),
          'value': new FormControl({ value: '', disabled: true }, [Validators.required])
        });
        break;
      case 'Instance_Number':
        configControls = new FormGroup({
          'noOfDeployments': new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[1-9])\d*$/)]) //INT
        });
        break;
      case 'User_Sum':
          configControls = new FormGroup({
          });
          break;
      case 'Attr_Sum':
        configControls = new FormGroup({
          'referenceEquipment': new FormControl('', [Validators.required]),
          'attributeName': new FormControl('', [Validators.required]),
          'referenceValue': new FormControl({ value: '', disabled: true }, [Validators.required])
        });
        break;
    }
    this.addControls(configControls);
  }

  // add controls depending on type selected
  addControls(group) {
    this.metricForm.removeControl('configuration');
    this.metricForm.addControl('configuration', group);
  }

  selectionChanged(property, data) {
    switch (property) {
      case 'firstEquipment':
        this.referenceEquipmentsList = [];
        if (this.selectedMetricTypeId === 'Oracle_Processor' || this.selectedMetricTypeId === 'Oracle_NUP') {
          // Populate list of reference equipments
          const selectedEquipment = this.equipmentsTypesList.filter(eq => eq.ID === data)[0];
          this.referenceEquipmentsList = [selectedEquipment];
          this.referenceEquipmentsList.push(...this.getParents(this.firstEquipmentsList, selectedEquipment.parent_id));
        }
        break;
      case 'referenceEquipment':
        //  Populate list for core
        this.coresList = [];
        const selectedRefEquipment = this.equipmentsTypesList.filter(eq => eq.ID === data)[0];
        for (let i = 0; i <= selectedRefEquipment.attributes.length - 1; i++) {
          const dataType = selectedRefEquipment.attributes[i].data_type
          if (dataType === 'FLOAT' || dataType === 'INT') {
            this.coresList.push(selectedRefEquipment.attributes[i]);
          }
        }
        this.aggregationLevelsList = [];
        this.attributesList = [];
        // Populate list of aggregation levels
        this.aggregationLevelsList = [selectedRefEquipment];
        this.aggregationLevelsList.push(...this.getParents(this.referenceEquipmentsList, selectedRefEquipment.parent_id));
        // Populate list of attribute names
        if (this.selectedMetricTypeId === 'Attr_Counter') {
          this.attributesList = selectedRefEquipment.attributes;
        }
        else if (this.selectedMetricTypeId === 'Attr_Sum') {
          this.attributesList = selectedRefEquipment.attributes.filter(attr => attr.data_type !== 'STRING');
        }
        break;
      case 'core':
        this.cpusList = [];
        this.corefactorsList = [];
        this.cpusList = this.coresList.filter(attr => attr.ID != this.core.value);
        if (this.selectedMetricTypeId === 'SAG_Processor' || this.selectedMetricTypeId === 'IBM_PVU') {
          this.corefactorsList = this.coresList.filter(attr => attr.ID != this.core.value);
        }
        break;
      case 'cpu':
        this.corefactorsList = [];
        this.corefactorsList = this.cpusList.filter(attr => attr.ID != this.cpu.value);
        break;
      case 'corefactor':
        break;
      case 'aggregationLevel':
        this.lastEquipmentsList = [];
        // Populate list of last equipments
        const selectedAggrLevel = this.equipmentsTypesList.filter(eq => eq.ID === data)[0];
        this.lastEquipmentsList = [selectedAggrLevel];
        this.lastEquipmentsList.push(...this.getParents(this.aggregationLevelsList, selectedAggrLevel.parent_id));
        break;
      case 'attributeName':
        if (this.selectedMetricTypeId === 'Attr_Counter') {
          this.zeroValueMsg = null;
          this.value.reset();
          this.value.enable();
          this.selectedAttributeDatatype = this.attributesList.filter(attr => attr.name === this.attributeName.value)[0].data_type;
        }
        else if (this.selectedMetricTypeId === 'Attr_Sum') {
          this.referenceValue.enable();
        }
        break;
    }
  }
  // Common methods
  getParents(equipmentsList, parentId) {
    let outputList = [];
    for (let i = 0; i < equipmentsList.length; i++) {
      if (equipmentsList[i].ID === parentId) {
        outputList.push(equipmentsList[i]);
        parentId = equipmentsList[i].parent_id;
      }
    }
    return outputList;
  }

  createMetric(successMsg, errorMsg) {
    let body;
    this._loading = true;
    const url = this.metricTypesList.filter(m => m.type_id === this.selectedMetricTypeId)[0].href.split('/v1').pop();
    switch (this.selectedMetricTypeId) {
      case 'Oracle_Processor':
        body = {
          'ID': '',
          "Name": this.name.value.trim(),
          "num_core_attr_id": this.core.value,
          "numCPU_attr_id": this.cpu.value,
          "core_factor_attr_id": this.corefactor.value,
          "start_eq_type_id": this.firstEquipment.value,
          "base_eq_type_id": this.referenceEquipment.value,
          "aggerateLevel_eq_type_id": this.aggregationLevel.value,
          "end_eq_type_id": this.lastEquipment.value,
          "scopes": [this.selectedScope]
        }
        break;
      case 'SAG_Processor':
      case 'IBM_PVU':
        body = {
          'ID': '',
          "Name": this.name.value.trim(),
          "num_core_attr_id": this.core.value,
          "core_factor_attr_id": this.corefactor.value,
          "base_eq_type_id": this.referenceEquipment.value,
          "scopes": [this.selectedScope]
        }
        break;
      case 'Oracle_NUP':
        body = {
          'ID': '',
          "Name": this.name.value.trim(),
          "num_core_attr_id": this.core.value,
          "numCPU_attr_id": this.cpu.value,
          "core_factor_attr_id": this.corefactor.value,
          "start_eq_type_id": this.firstEquipment.value,
          "base_eq_type_id": this.referenceEquipment.value,
          "aggerateLevel_eq_type_id": this.aggregationLevel.value,
          "end_eq_type_id": this.lastEquipment.value,
          'number_of_users': Number(this.noOfUsers.value),
          "scopes": [this.selectedScope]
        }
        break;
      case 'Attr_Counter':
        body = {
          'ID': '',
          "name": this.name.value.trim(),
          "eq_type": this.getEqpNameByID(this.referenceEquipment.value),
          "attribute_name": this.attributeName.value,
          'value': this.value.value,
          "scopes": [this.selectedScope]
        }
        break;
      case 'Instance_Number':
        body = {
          'ID': '',
          "Name": this.name.value.trim(),
          'num_of_deployments': Number(this.noOfDeployments.value),
          "scopes": [this.selectedScope]
        }
        break;
        case 'User_Sum':
          body = {
            'ID': '',
            "Name": this.name.value.trim(),
            "scopes": [this.selectedScope]
          }
          break;
      case 'Attr_Sum':
        body = {
          'ID': '',
          "name": this.name.value.trim(),
          "eq_type": this.getEqpNameByID(this.referenceEquipment.value),
          "attribute_name": this.attributeName.value,
          'reference_value': this.referenceValue.value,
          "scopes": [this.selectedScope]
        }
        break;
    }
    this.metricService.createMetric(body, url).subscribe(res => {
      this._loading = false;
      this.openModal(successMsg);
    }, error => {
      this._loading = false;
      if (error.status == 400 && error.error.message == "child can not be parent") {
        this.errorMessage = 'Child equipment cannot be selected as a parent';
      }
      else {
        this.errorMessage = 'Some error occured! Metric could not be created. Error: ' + error.error.message;
      }
      this.openModal(errorMsg);
      console.log('An error occured.', error);
    });
  }

  resetListVariables() {
    this.firstEquipmentsList = [];
    this.referenceEquipmentsList = [];
    this.coresList = [];
    this.cpusList = [];
    this.corefactorsList = [];
    this.aggregationLevelsList = [];
    this.lastEquipmentsList = [];
    this.attributesList = [];
    this.selectedAttributeDatatype = '';
    this.zeroValueMsg = null;
  }

  resetForm() {
    this.setFormData();
    this.resetListVariables();
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '30%',
      disableClose: true
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
    localStorage.removeItem('existingMetricNames');
  }
}