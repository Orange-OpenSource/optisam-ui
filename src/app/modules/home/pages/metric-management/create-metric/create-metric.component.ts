import { LOCAL_KEYS } from '@core/util/constants/constants';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ɵangular_packages_router_router_h } from '@angular/router';
import { MetricType } from '@core/modals';
import { CommonService } from '@core/services/common.service';
import { Observable } from 'rxjs';
import { filter, pluck } from 'rxjs/operators';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { MetricService } from 'src/app/core/services/metric.service';
import { SharedService } from '@shared/shared.service';

const TRANSFORM_METRIC_TYPES = ['oracle.processor.standard'];

@Component({
  selector: 'app-create-metric',
  templateUrl: './create-metric.component.html',
  styleUrls: ['./create-metric.component.scss'],
})
export class CreateMetricComponent
  implements OnInit, AfterViewInit, AfterViewChecked {
  metricForm: FormGroup;
  selectedScope: string;
  _loading: Boolean;
  errorMessage: string;
  metricsList: any[] = [];
  metricTypesList: MetricType[] = [];
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
  transformProcessor: boolean = false;
  processorMetricList$: Observable<any>;

  constructor(
    private equipmentTypeService: EquipmentTypeManagementService,
    private metricService: MetricService,
    public dialog: MatDialog,
    private cs: CommonService,
    private cd: ChangeDetectorRef,
    private ss: SharedService
  ) {
    this.selectedScope = localStorage.getItem('scope');
    this.getMetricList();
    this.getMetricTypes();
  }
  ngAfterViewChecked(): void {
    this.updateTransformProcessorValidator();
  }

  ngOnInit(): void {
    this.setFormData();
    this.processorMetricList$ = this.metricService.getMetricList().pipe(
      filter((list) => {
        list.metrices = list?.metrices.filter((metric) => {
          return TRANSFORM_METRIC_TYPES.includes(metric.type);
        });
        return list;
      }),

      pluck('metrices')
    );
  }

  ngAfterViewInit() {
    this.metricForm.valueChanges.subscribe((res) => {
      if (this.selectedMetricTypeId === 'Attr_Counter') {
        if (
          this.selectedAttributeDatatype !== 'STRING' &&
          res.configuration?.value
        ) {
          this.validateNonZero(res.configuration.value);
        }
      } else if (this.selectedMetricTypeId === 'Attr_Sum') {
        this.validateNonZero(res.configuration?.referenceValue);
      } else if (this.selectedMetricTypeId === 'Equip_Attr') {
        this.validateNonZero(res.configuration?.value);
      }
    });
  }

  updateTransformProcessorValidator(): void {
    if (!this.transformProcessorMetric) return;
    if (this.transformProcessor)
      this.transformProcessorMetric.setValidators(Validators.required);
    else this.transformProcessorMetric.clearValidators();

    this.transformProcessorMetric.updateValueAndValidity();
    this.cd.detectChanges();
  }

  setFormData() {
    this.selectedMetricTypeId = '';
    this.metricForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9-_.]*$/),
        this.duplicateName,
      ]),
      type: new FormControl('', [Validators.required]),
      description: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      configuration: new FormGroup({}),
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
  get environmentValue() {
    return this.configuration.get('environmentValue');
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

  get transformProcessorMetric(): FormControl {
    return this.configuration.get('transformProcessorMetric') as FormControl;
  }

  getEqpNameByID(equipID) {
    return this.equipmentsTypesList.filter((eq) => eq.ID === equipID)[0].type;
  }

  get concurrentProfile(): FormControl {
    return this.configuration.get('concurrentProfile') as FormControl;
  }

  get nominativeProfile(): FormControl {
    return this.configuration.get('nominativeProfile') as FormControl;
  }

  // Validators
  duplicateName(input) {
    const value = input.value.toLowerCase().trim();
    const metricsList = (
      JSON.parse(localStorage.getItem('existingMetricNames')) || []
    ).map((metricName: string) => metricName.toLowerCase().trim());
    return value && metricsList.includes(value)
      ? {
        duplicateName: true,
      }
      : null;
  }

  // Validate Input data depending upon the datatype of selected attribute
  validatePattern(input) {
    let regEx;
    const specialKeys: Array<string> = ['Backspace', 'Delete', 'End', 'Home'];
    if (this.selectedAttributeDatatype === 'FLOAT') {
      regEx = new RegExp(/^\d*\.?\d*$/);
    } else if (this.selectedAttributeDatatype === 'INT') {
      regEx = new RegExp(/^\d*$/);
    } else {
      regEx = new RegExp(/[\w]/);
    }
    return !regEx.test(input.key) && specialKeys.indexOf(input.key) === -1
      ? false
      : true;
  }

  validateNonZero(value) {
    if (Number(value) > 0) {
      this.zeroValueMsg = null;
    } else if (Number(value) !== 0) {
      this.zeroValueMsg = 'Invalid float/int value';
    } else {
      this.zeroValueMsg = 'Value should be greater than 0';
    }
  }

  // Get existing metric names
  getMetricList() {
    this.metricService.getMetricList().subscribe((res) => {
      this.metricsList = res.metrices.map((m) => m.name);
      localStorage.setItem(
        'existingMetricNames',
        JSON.stringify(this.metricsList)
      );
    });
  }
  // Get metric types
  getMetricTypes() {
    this.metricService.getMetricType(this.selectedScope).subscribe((res) => {
      this.metricTypesList = this.cs.customSort(res.types, 'asc', 'name') || [];
    });
  }

  // Get Equipment Types
  getEquipmentsTypes() {
    this.equipmentTypeService.getTypes(this.selectedScope).subscribe(
      (res: any) => {
        // For Attr_Sum, only consider equipment with numeric attributes('INT' and 'FLOAT')
        if (this.selectedMetricTypeId === 'Attr_Sum') {
          this.equipmentsTypesList = res.equipment_types
            .filter(
              (e) =>
                e.attributes.map((attr) => attr.data_type).includes('FLOAT') ||
                e.attributes.map((attr) => attr.data_type).includes('INT')
            )
            .reverse();
        } else if (this.selectedMetricTypeId === 'Equip_Attr') {
          this.equipmentsTypesList = res.equipment_types.filter(
            (e) =>
              e.attributes.some((attr) => attr.data_type === 'INT') &&
              this.isValidEquipment(e, res.equipment_types)
          );
        } else {
          this.equipmentsTypesList = (res.equipment_types || []).reverse();
        }

        this.firstEquipmentsList = this.equipmentsTypesList;
      },
      (error) => {
        console.log(
          'Some error occured! Could not fetch equipment types. Error: ',
          error
        );
      }
    );
  }

  private isValidEquipment(e, equipments): boolean {
    const isValid = e.attributes.some(
      (attr) => attr.name.toLowerCase() === 'environment'
    );

    if (isValid) return true;

    if (!e.parent_type) return false;

    const parent = equipments.find((eqp) => eqp.type === e.parent_type);

    if (!parent) return false;

    return this.isValidEquipment(parent, equipments);
  }

  metricSelected(name) {
    this.resetListVariables();
    let configControls;
    const selectedMetric = this.metricTypesList.filter(
      (m) => m.name === name
    )[0];
    this.selectedMetricTypeId = selectedMetric.type_id;
    this.description.setValue(selectedMetric.description);
    this.getEquipmentsTypes();

    switch (this.selectedMetricTypeId) {
      case 'Oracle_Processor':
        configControls = new FormGroup({
          firstEquipment: new FormControl('', [Validators.required]),
          referenceEquipment: new FormControl('', [Validators.required]),
          core: new FormControl('', [Validators.required]),
          cpu: new FormControl('', [Validators.required]),
          corefactor: new FormControl('', [Validators.required]),
          aggregationLevel: new FormControl('', [Validators.required]),
          lastEquipment: new FormControl('', [Validators.required]),
        });
        break;
      case 'SAG_Processor':
      case 'IBM_PVU':
        configControls = new FormGroup({
          referenceEquipment: new FormControl('', [Validators.required]),
          core: new FormControl('', [Validators.required]),
          corefactor: new FormControl('', [Validators.required]),
          cpu: new FormControl('', [Validators.required]),
        });
        break;
      case 'Oracle_NUP':
        configControls = new FormGroup({
          firstEquipment: new FormControl('', [Validators.required]),
          referenceEquipment: new FormControl('', [Validators.required]),
          core: new FormControl('', [Validators.required]),
          cpu: new FormControl('', [Validators.required]),
          corefactor: new FormControl('', [Validators.required]),
          aggregationLevel: new FormControl('', [Validators.required]),
          lastEquipment: new FormControl('', [Validators.required]),
          noOfUsers: new FormControl('', [
            Validators.required,
            Validators.pattern(/^(?=.*[1-9])\d*$/),
          ]), //INT
          transformProcessorMetric: new FormControl(
            '',
            this.transformProcessor ? [Validators.required] : []
          ),
        });
        break;
      case 'Attr_Counter':
        configControls = new FormGroup({
          referenceEquipment: new FormControl('', [Validators.required]),
          attributeName: new FormControl('', [Validators.required]),
          value: new FormControl({ value: '', disabled: true }, [
            Validators.required,
          ]),
        });
        break;

      case 'Equip_Attr':
        configControls = new FormGroup({
          referenceEquipment: new FormControl('', [Validators.required]),
          attributeName: new FormControl('', [Validators.required]),
          environmentValue: new FormControl('', [
            Validators.required,
            Validators.pattern(/^[a-zA-Z0-9,]*$/),
          ]),
          value: new FormControl(null, [
            Validators.required,
            Validators.pattern(/^[0-9]*$/),
          ]),
        });

        break;
      case 'Instance_Number':
        configControls = new FormGroup({
          noOfDeployments: new FormControl('', [
            Validators.required,
            Validators.pattern(/^(?=.*[1-9])\d*$/),
          ]), //INT
        });
        break;

      case 'Static_Standard':
        configControls = new FormGroup({
          referenceValue: new FormControl(null, [
            Validators.required,
            Validators.pattern(/^[0-9]*$/),
          ]),
        });
        break;

      case 'User_Sum':
        configControls = new FormGroup({});
        break;

      case 'Attr_Sum':
        configControls = new FormGroup({
          referenceEquipment: new FormControl('', [Validators.required]),
          attributeName: new FormControl('', [Validators.required]),
          referenceValue: new FormControl({ value: '', disabled: true }, [
            Validators.required,
          ]),
        });
        break;

      case 'User_Concurent':
        configControls = new FormGroup({
          concurrentProfile: new FormControl('', [
            Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
          ]),
        });
        break;

      case 'Nominative_User':
        configControls = new FormGroup({
          nominativeProfile: new FormControl('', [
            Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
          ]),
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
        if (
          this.selectedMetricTypeId === 'Oracle_Processor' ||
          this.selectedMetricTypeId === 'Oracle_NUP'
        ) {
          // Populate list of reference equipments
          const selectedEquipment = this.equipmentsTypesList.filter(
            (eq) => eq.ID === data
          )[0];
          this.referenceEquipmentsList = [selectedEquipment];
          this.referenceEquipmentsList.push(
            ...this.getParents(
              this.firstEquipmentsList,
              selectedEquipment.parent_id
            )
          );
        }
        break;
      case 'referenceEquipment':
        //  Populate list for core
        this.coresList = [];
        const selectedRefEquipment = this.equipmentsTypesList.filter(
          (eq) => eq.ID === data
        )[0];
        for (let i = 0; i <= selectedRefEquipment.attributes.length - 1; i++) {
          const dataType = selectedRefEquipment.attributes[i].data_type;
          if (dataType === 'FLOAT' || dataType === 'INT') {
            this.coresList.push(selectedRefEquipment.attributes[i]);
          }
        }
        this.coresList = this.cs.customSort(this.coresList, 'asc', 'name');
        this.aggregationLevelsList = [];
        this.attributesList = [];
        // Populate list of aggregation levels
        this.aggregationLevelsList = [selectedRefEquipment];
        this.aggregationLevelsList.push(
          ...this.getParents(
            this.referenceEquipmentsList,
            selectedRefEquipment.parent_id
          )
        );
        this.attributeName.reset();
        // Populate list of attribute names
        if (this.selectedMetricTypeId === 'Attr_Counter') {
          this.attributesList = selectedRefEquipment.attributes;
        } else if (this.selectedMetricTypeId === 'Attr_Sum') {
          this.attributesList = selectedRefEquipment.attributes.filter(
            (attr) => attr.data_type !== 'STRING'
          );
        } else if (this.selectedMetricTypeId === 'Equip_Attr') {
          this.attributesList = selectedRefEquipment.attributes.filter(
            (attr) => attr.data_type === 'INT'
          );
        }
        this.attributesList = this.cs.customSort(
          this.attributesList,
          'asc',
          'name'
        );
        break;
      case 'core':
        this.cpusList = [];
        this.corefactorsList = [];
        this.cpusList = this.coresList.filter(
          (attr) => attr.ID != this.core.value
        );
        if (
          this.selectedMetricTypeId === 'SAG_Processor' ||
          this.selectedMetricTypeId === 'IBM_PVU'
        ) {
          this.corefactorsList = this.coresList.filter(
            (attr) => attr.ID != this.core.value
          );
        }
        this.corefactorsList = this.cs.customSort(
          this.corefactorsList,
          'asc',
          'name'
        );
        this.cpusList = this.cs.customSort(this.cpusList, 'asc', 'name');
        break;
      case 'cpu':
        this.corefactorsList = [];
        this.corefactorsList = this.cs.customSort(
          this.cpusList.filter((attr) => attr.ID != this.cpu.value),
          'asc',
          'name'
        );
        break;
      case 'corefactor':
        break;
      case 'aggregationLevel':
        this.lastEquipmentsList = [];
        // Populate list of last equipments
        const selectedAggrLevel = this.equipmentsTypesList.filter(
          (eq) => eq.ID === data
        )[0];
        this.lastEquipmentsList = [selectedAggrLevel];
        this.lastEquipmentsList.push(
          ...this.getParents(
            this.aggregationLevelsList,
            selectedAggrLevel.parent_id
          )
        );
        break;
      case 'attributeName':
        if (this.selectedMetricTypeId === 'Attr_Counter') {
          this.zeroValueMsg = null;
          this.value.reset();
          this.value.enable();
          this.selectedAttributeDatatype = this.attributesList.filter(
            (attr) => attr.name === this.attributeName.value
          )[0].data_type;
        } else if (this.selectedMetricTypeId === 'Attr_Sum') {
          this.referenceValue.enable();
        } else if (this.selectedMetricTypeId === 'Equip_Attr') {
          this.zeroValueMsg = null;
          this.value.reset();
          this.value.enable();
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
    const url = this.metricTypesList
      .filter((m) => m.type_id === this.selectedMetricTypeId)[0]
      .href.split('/v1')
      .pop();

    switch (this.selectedMetricTypeId) {
      case 'Oracle_Processor':
        body = {
          ID: '',
          Name: this.name.value.trim(),
          num_core_attr_id: this.core.value,
          numCPU_attr_id: this.cpu.value,
          core_factor_attr_id: this.corefactor.value,
          start_eq_type_id: this.firstEquipment.value,
          base_eq_type_id: this.referenceEquipment.value,
          aggerateLevel_eq_type_id: this.aggregationLevel.value,
          end_eq_type_id: this.lastEquipment.value,
          scopes: [this.selectedScope],
        };
        break;
      case 'SAG_Processor':
      case 'IBM_PVU':
        body = {
          ID: '',
          Name: this.name.value.trim(),
          num_core_attr_id: this.core.value,
          numCPU_attr_id: this.cpu.value,
          core_factor_attr_id: this.corefactor.value,
          base_eq_type_id: this.referenceEquipment.value,
          scopes: [this.selectedScope],
        };
        break;
      case 'Oracle_NUP':
        body = {
          ID: '',
          Name: this.name.value.trim(),
          num_core_attr_id: this.core.value,
          numCPU_attr_id: this.cpu.value,
          core_factor_attr_id: this.corefactor.value,
          start_eq_type_id: this.firstEquipment.value,
          base_eq_type_id: this.referenceEquipment.value,
          aggerateLevel_eq_type_id: this.aggregationLevel.value,
          end_eq_type_id: this.lastEquipment.value,
          number_of_users: Number(this.noOfUsers.value),
          transform: this.transformProcessor,
          transform_metric_name: this.transformProcessor
            ? this.transformProcessorMetric.value
            : '',
          scopes: [this.selectedScope],
        };
        break;
      case 'Attr_Counter':
        body = {
          ID: '',
          name: this.name.value.trim(),
          eq_type: this.getEqpNameByID(this.referenceEquipment.value),
          attribute_name: this.attributeName.value,
          value: this.value.value,
          scopes: [this.selectedScope],
        };
        break;
      case 'Equip_Attr':
        body = {
          ID: '',
          name: this.name.value.trim(),
          eq_type: this.getEqpNameByID(this.referenceEquipment.value),
          attribute_name: this.attributeName.value,
          environment: this.environmentValue.value,
          value: Number(this.value.value),
          scopes: [this.selectedScope],
        };
        break;
      case 'Instance_Number':
        body = {
          ID: '',
          Name: this.name.value.trim(),
          num_of_deployments: Number(this.noOfDeployments.value),
          scopes: [this.selectedScope],
        };
        break;
      case 'Static_Standard':
        body = {
          ID: '',
          Name: this.name.value.trim(),
          reference_value: Number(this.referenceValue.value),
          scopes: [this.selectedScope],
        };
        break;

      case 'User_Sum':
        body = {
          ID: '',
          Name: this.name.value.trim(),
          scopes: [this.selectedScope],
        };
        break;

      case 'Attr_Sum':
        body = {
          ID: '',
          name: this.name.value.trim(),
          eq_type: this.getEqpNameByID(this.referenceEquipment.value),
          attribute_name: this.attributeName.value,
          reference_value: this.referenceValue.value,
          scopes: [this.selectedScope],
        };
        break;

      case 'User_Concurent':
        body = {
          ID: '',
          Name: this.name.value.trim(),
          profile: this.concurrentProfile.value,
          scopes: [this.cs.getLocalData(LOCAL_KEYS.SCOPE)],
        };
        break;

      case 'Nominative_User':
        body = {
          ID: '',
          Name: this.name.value.trim(),
          profile: this.nominativeProfile.value,
          scopes: [this.cs.getLocalData(LOCAL_KEYS.SCOPE)],
        };
        break;
    }

    this.metricService.createMetric(body, url).subscribe(
      (res) => {
        this._loading = false;
        this.openModal(successMsg);
      },
      (error) => {
        this._loading = false;
        if (
          error.status == 400 &&
          error.error.message == 'child can not be parent'
        ) {
          this.errorMessage = 'Child equipment cannot be selected as a parent';
        } else {
          this.errorMessage =
            'Some error occured! Metric could not be created. Error: ' +
            error.error.message;
        }

        this.ss.commonPopup({
          title: 'Error',
          singleButton: true,
          message: this.errorMessage,
          buttonText: 'OK',
        });
      }
    );
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
      disableClose: true,
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
    localStorage.removeItem('existingMetricNames');
  }
}
