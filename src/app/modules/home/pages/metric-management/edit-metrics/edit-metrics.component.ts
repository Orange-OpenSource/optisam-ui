import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  TemplateRef,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewChecked,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MetricService } from '@core/services/metric.service';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { EquipmentTypeManagementService } from '@core/services/equipmenttypemanagement.service';
import {
  ORACLE_TYPES,
  METRIC_TYPES,
  LOCAL_KEYS,
  METRIC_DEPENDENCY_TYPES,
} from '@core/util/constants/constants';
import { CommonService } from '@core/services/common.service';
import { Equipments } from '@core/services/equipments';
import {
  MetricTypes,
  MetricEditInputData,
  FormControlObject,
  MetricDetailsParams,
  MetricDependencyTypes,
  MetricEquipmentTypes,
  MetricCore,
  OracleNupStandardParams,
  OracleProcessorStandardParams,
  MetricUpdateSuccess,
  MetricUpdateError,
  IbmPvuStandardParams,
  SagProcessorStandardParams,
  SetSelectionObject,
  AttributeCounterStandardParams,
  AttributeSumStandardParams,
  EquipmentAttributeParams,
  InstanceNumberStandardParams,
  StaticStandardParams,
  MetricEquipmentAttributes,
} from '@core/modals';
import { Observable } from 'rxjs';
import { tap, map, filter, pluck } from 'rxjs/operators';
import { SharedService } from '@shared/shared.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

const TRANSFORM_METRIC_TYPES: string[] = ['oracle.processor.standard'];

@Component({
  selector: 'app-edit-metrics',
  templateUrl: './edit-metrics.component.html',
  styleUrls: ['./edit-metrics.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class EditMetricsComponent implements OnInit, AfterViewChecked {
  @ViewChild('successDialog') successDialog: TemplateRef<any>;
  @ViewChild('errorDialog') errorDialog: TemplateRef<any>;

  show: boolean = true;
  metricEditForm: FormGroup;
  metricType: string;
  oracleTypes: string[] = ORACLE_TYPES;
  metricTypes: MetricTypes = METRIC_TYPES;
  oracleTypeGroup: FormGroup;
  sagOrIbmTypes: string[] = [
    METRIC_TYPES.SAG_PROCESSOR_STANDARD,
    METRIC_TYPES.IBM_PVU_STANDARD,
  ];
  attributeCounterOrAttributeSumOrEquipemntTypes: string[] = [
    METRIC_TYPES.ATTRIBUTE_COUNTER_STANDARD,
    METRIC_TYPES.ATTRIBUTE_SUM_STANDARD,
    METRIC_TYPES.EQUIPMENT_ATTRIBUTE_STANDARD,
  ];
  metricDetails: any;
  _loading: boolean = false;
  dependencyTypes: MetricDependencyTypes = METRIC_DEPENDENCY_TYPES;
  firstEquipmentsList$: Observable<any>;
  currentScope: string = this.cs.getLocalData(LOCAL_KEYS.SCOPE);
  equipmentsTypesList: MetricEquipmentTypes[] = [];
  aggregationLevelsList: any;
  coresList: MetricCore[] = [];
  lastEquipmentsList: any;
  selectedMetricTypeId: any;
  zeroValueMsg: any;
  selectedAttributeDatatype: string;
  attributesList: any;
  corefactorsList: any;
  cpusList: any;
  referenceEquipmentsList: MetricEquipmentTypes[] = [];
  excludeFields: string[] = ['metricName', 'metricType', 'metricDescription'];
  errorMsg: string;
  transformProcessor: boolean = false;
  processorMetricList$: Observable<any>;

  constructor(
    private cs: CommonService,
    private fb: FormBuilder,
    private metricService: MetricService,
    @Inject(MAT_DIALOG_DATA) public data: MetricEditInputData,
    private equipmentTypeService: EquipmentTypeManagementService,
    private sharedService: SharedService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {}
  ngAfterViewChecked(): void {
    this.updateTransformProcessorValidator();
  }

  ngOnInit(): void {
    this.sharedService.httpLoading().subscribe((status) => {
      this._loading = Boolean(status);
    });
    this.initiateForm();
    this.fetchMetricDetails();
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

  updateTransformProcessorValidator(): void {
    if (!this.transformProcessorMetric) return;
    if (this.transformProcessor)
      this.transformProcessorMetric.setValidators(Validators.required);
    else this.transformProcessorMetric.clearValidators();

    this.transformProcessorMetric.updateValueAndValidity();
    this.cd.detectChanges();
  }

  // getters
  get isProcessorOrNUP(): boolean {
    return this.oracleTypes.includes(this.metricType);
  }

  get transformProcessorMetric(): FormControl {
    return this.metricEditForm.get('transformProcessorMetric') as FormControl;
  }

  get isOracleNUP(): boolean {
    return this.metricType === this.metricTypes.ORACLE_NUP_STANDARD;
  }

  get isSagOrIbm(): boolean {
    return this.sagOrIbmTypes.includes(this.metricType);
  }

  get isAttributeCounterOrAttributeSumOrEquipemntAttribute(): boolean {
    return this.attributeCounterOrAttributeSumOrEquipemntTypes.includes(
      this.metricType
    );
  }

  get getOracleTypeGroup(): FormControlObject[] {
    let controls: FormControlObject[] = [
      {
        name: 'firstEquipment',
        value: null,
        validation: [Validators.required],
      },
      {
        name: 'referenceEquipment',
        value: null,
        validation: [Validators.required],
      },
      {
        name: 'core',
        value: null,
        validation: [Validators.required],
      },
      {
        name: 'corefactor',
        value: null,
        validation: [Validators.required],
      },
      {
        name: 'cpu',
        value: null,
        validation: [Validators.required],
      },
      {
        name: 'aggregationLevel',
        value: null,
        validation: [Validators.required],
      },
      {
        name: 'lastEquipment',
        value: null,
        validation: [Validators.required],
      },
    ];
    if (this.isOracleNUP) {
      controls = [
        ...controls,
        {
          name: 'noOfUsers',
          value: null,
          validation: [
            Validators.required,
            Validators.pattern(/^(?=.*[1-9])\d*$/),
          ],
        },
        {
          name: 'transformProcessorMetric',
          value: '',
          validation: [Validators.required],
        },
      ];
    }

    return controls;
  }

  get getSagOrIbmGroup(): FormControlObject[] {
    const controls: FormControlObject[] = [
      {
        name: 'referenceEquipment',
        value: this.metricDetails?.BaseEqType || '',
        validation: [Validators.required],
      },
      {
        name: 'core',
        value: this.metricDetails?.NumCoreAttr || '',
        validation: [Validators.required],
      },
      {
        name: 'cpu',
        value: null,
        validation: [Validators.required],
      },
      {
        name: 'corefactor',
        value: this.metricDetails?.CoreFactorAttr || '',
        validation: [Validators.required],
      },
    ];
    return controls;
  }

  get getAttributeCounterOrAttributeSumGroup(): FormControlObject[] {
    const controls: FormControlObject[] = [
      {
        name: 'referenceEquipment',
        value: null,
        validation: [Validators.required],
      },
      {
        name: 'attributeName',
        value: null,
        validation: [Validators.required],
      },
    ];
    if (this.metricType === this.metricTypes.ATTRIBUTE_COUNTER_STANDARD)
      controls.push({
        name: 'value',
        value: null,
        validation: [Validators.required],
      });

    if (this.metricType === this.metricTypes.ATTRIBUTE_SUM_STANDARD)
      controls.push({
        name: 'referenceValue',
        value: null,
        validation: [Validators.required],
      });

    if (this.metricType === this.metricTypes.EQUIPMENT_ATTRIBUTE_STANDARD)
      controls.push({
        name: 'environmentValue',
        value: null,
        validation: [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9,]*$/),
        ],
      });

    if (this.metricType === this.metricTypes.EQUIPMENT_ATTRIBUTE_STANDARD)
      controls.push({
        name: 'value',
        value: null,
        validation: [Validators.required, Validators.pattern(/^[1-9]*$/)],
      });

    return controls;
  }
  get getInstanceNumberGroup(): FormControlObject[] {
    const controls: FormControlObject[] = [
      {
        name: 'noOfDeployments',
        value: null,
        validation: [Validators.required],
      },
    ];
    return controls;
  }

  get getReferenceValueGroup(): FormControlObject[] {
    const controls: FormControlObject[] = [
      {
        name: 'referenceValue',
        value: null,
        validation: [Validators.pattern(/^[0-9]*$/), Validators.required],
      },
    ];
    return controls;
  }

  get isValid(): boolean {
    return (
      this.metricEditForm.valid &&
      this.metricEditForm.touched &&
      this.metricEditForm.dirty
    );
  }

  get firstEquipment(): FormControl {
    return this.metricEditForm.get('firstEquipment') as FormControl;
  }
  get referenceEquipment(): FormControl {
    return this.metricEditForm.get('referenceEquipment') as FormControl;
  }
  get core(): FormControl {
    return this.metricEditForm.get('core') as FormControl;
  }
  get cpu(): FormControl {
    return this.metricEditForm.get('cpu') as FormControl;
  }
  get corefactor(): FormControl {
    return this.metricEditForm.get('corefactor') as FormControl;
  }
  get aggregationLevel(): FormControl {
    return this.metricEditForm.get('aggregationLevel') as FormControl;
  }
  get lastEquipment(): FormControl {
    return this.metricEditForm.get('lastEquipment') as FormControl;
  }
  get noOfUsers(): FormControl {
    return this.metricEditForm.get('noOfUsers') as FormControl;
  }
  get attributeName(): FormControl {
    return this.metricEditForm.get('attributeName') as FormControl;
  }
  get value(): FormControl {
    return this.metricEditForm.get('value') as FormControl;
  }
  get noOfDeployments(): FormControl {
    return this.metricEditForm.get('noOfDeployments') as FormControl;
  }
  get referenceValue(): FormControl {
    return this.metricEditForm.get('referenceValue') as FormControl;
  }

  get environmentValue(): FormControl {
    return this.metricEditForm.get('environmentValue') as FormControl;
  }

  get metricName(): FormControl {
    return this.metricEditForm.get('metricName') as FormControl;
  }

  get formMetricType(): FormControl {
    return this.metricEditForm.get('metricType') as FormControl;
  }

  get metricDescription(): FormControl {
    return this.metricEditForm.get('metricDescription') as FormControl;
  }

  get isReset(): boolean {
    return !Object.keys(this.metricEditForm.controls).some((key: string) => {
      if (this.excludeFields.includes(key)) return false;
      return !!this.metricEditForm.get(key).value;
    });
  }

  // end getters!!

  initiateForm(): void {
    this.metricEditForm = this.fb.group({
      metricName: this.fb.control({
        value: this.data.metric.name,
        disabled: true,
      }),
      metricType: this.fb.control({
        value: this.data.metric.type,
        disabled: true,
      }),
      metricDescription: this.fb.control({
        value: this.data.metric.description,
        disabled: true,
      }),
    });
  }

  private fetchMetricDetails(): void {
    this._loading = true;
    const params: MetricDetailsParams = {
      'metric_info.type': this.data.metric.type,
      'metric_info.name': this.data.metric.name,
      scopes: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      GetID: true,
    };

    this.metricService.getMetricDetails(params).subscribe(
      (res) => {
        const { metric_config } = res;
        this.metricDetails = JSON.parse(metric_config);

        this.metricType = this.data.metric.type;
        this.checkForMetricType();
        this._loading = false;
      },
      (error) => {
        console.log(error);
        this._loading = false;
      }
    );
  }

  changeHandler(): void {
    this.metricType = this.metricTypes.ORACLE_NUP_STANDARD;
    this.checkForMetricType();
  }

  private checkForMetricType(): void {
    //combined metricType checking with if conditions
    if (this.isProcessorOrNUP) {
      this.getDependency(this.dependencyTypes.PROCESSOR_OR_NUP);
      this.addControls(this.getOracleTypeGroup);
      return;
    }

    if (this.isSagOrIbm) {
      this.addControls(this.getSagOrIbmGroup);
      this.getDependency(this.dependencyTypes.SAG_OR_IBM);
      return;
    }

    if (this.isAttributeCounterOrAttributeSumOrEquipemntAttribute) {
      this.addControls(this.getAttributeCounterOrAttributeSumGroup);
      this.getDependency(
        this.dependencyTypes
          .ATTRIBUTE_COUNTER_OR_ATTRIBUTE_SUM_OR_EQUIPMENT_ATTRIBUTE
      );
      return;
    }

    // single metricType check with switch condition
    switch (this.metricType) {
      case this.metricTypes.INSTANCE_NUMBER_STANDARD:
        this.addControls(this.getInstanceNumberGroup);
        this.getDependency(this.dependencyTypes.INSTANCE_NUMBER);
        break;

      case this.metricTypes.STATIC_STANDARD:
        this.addControls(this.getReferenceValueGroup);
        this.getDependency(this.dependencyTypes.STATIC_STANDARD);
        break;

      default:
        break;
    }
  }

  private getDependency(dependencyType: string): void {
    switch (dependencyType) {
      case this.dependencyTypes.PROCESSOR_OR_NUP:
        this.firstEquipmentsList$ = this.equipmentTypeService
          .getTypes(this.currentScope)
          .pipe(
            map((res: any) => (res['equipment_types'] || []).reverse()),
            tap((res: MetricEquipmentTypes[]) => {
              this.equipmentsTypesList = res;
              this.setSelections({
                firstEquipment: this.metricDetails.StartEqTypeID,
                referenceEquipment: this.metricDetails.BaseEqTypeID,
                core: this.metricDetails.NumCoreAttrID,
                cpu: this.metricDetails.NumCPUAttrID,
                aggregationLevel: this.metricDetails.AggerateLevelEqTypeID,
              });

              this.transformProcessor = this.metricDetails.Transform;

              this.metricEditForm.patchValue({
                firstEquipment: this.metricDetails.StartEqTypeID,
                referenceEquipment: this.metricDetails.BaseEqTypeID,
                core: this.metricDetails.NumCoreAttrID,
                cpu: this.metricDetails.NumCPUAttrID,
                corefactor: this.metricDetails.CoreFactorAttrID,
                aggregationLevel: this.metricDetails.AggerateLevelEqTypeID,
                lastEquipment: this.metricDetails.EndEqTypeID,
                noOfUsers: this.metricDetails.NumberOfUsers,
                transformProcessorMetric:
                  this.metricDetails.TransformMetricName,
              });
            })
          );

        break;

      case this.dependencyTypes.SAG_OR_IBM:
        this.firstEquipmentsList$ = this.equipmentTypeService
          .getTypes(this.currentScope)
          .pipe(
            map((res: any) => (res['equipment_types'] || []).reverse()),
            tap((res: MetricEquipmentTypes[]) => {
              this.equipmentsTypesList = res;

              this.setSelections({
                referenceEquipment: this.metricDetails.BaseEqTypeID,
                core: this.metricDetails.NumCoreAttrID,
              });

              this.metricEditForm.patchValue({
                referenceEquipment: this.metricDetails.BaseEqTypeID,
                core: this.metricDetails.NumCoreAttrID,
                corefactor: this.metricDetails.CoreFactorAttrID,
                cpu: this.metricDetails.NumCPUAttrID,
              });
            })
          );
        break;

      case this.dependencyTypes
        .ATTRIBUTE_COUNTER_OR_ATTRIBUTE_SUM_OR_EQUIPMENT_ATTRIBUTE:
        this.firstEquipmentsList$ = this.equipmentTypeService
          .getTypes(this.currentScope)
          .pipe(
            map((res: any) => (res['equipment_types'] || []).reverse()),
            tap((res: MetricEquipmentTypes[]) => {
              if (this.metricType === this.metricTypes.ATTRIBUTE_SUM_STANDARD) {
                this.equipmentsTypesList = res
                  .filter(
                    (e) =>
                      e.attributes
                        .map((attr) => attr.data_type)
                        .includes('FLOAT') ||
                      e.attributes.map((attr) => attr.data_type).includes('INT')
                  )
                  .reverse();
              } else if (
                this.metricType ===
                this.metricTypes.EQUIPMENT_ATTRIBUTE_STANDARD
              ) {
                this.equipmentsTypesList = res.filter(
                  (e) =>
                    e.attributes.some((attr) => attr.data_type === 'INT') &&
                    this.isValidEquipment(e, res)
                );
              } else {
                this.equipmentsTypesList = res;
              }

              const tempReferenceEquipmentId = this.equipmentsTypesList.find(
                (e: MetricEquipmentTypes) =>
                  e.type === this.metricDetails.EqType
              )?.ID;

              this.selectionChanged(
                'referenceEquipment',
                tempReferenceEquipmentId
              );

              const tempAttributeNameId = this.attributesList.find(
                (a) => a.name === this.metricDetails.AttributeName
              )?.ID;

              this.metricEditForm.patchValue({
                referenceEquipment: tempReferenceEquipmentId,
                environmentValue: this.metricDetails.Environment,
                attributeName: tempAttributeNameId,
                ...(this.metricType ===
                  this.metricTypes.ATTRIBUTE_COUNTER_STANDARD ||
                this.metricType ===
                  this.metricTypes.EQUIPMENT_ATTRIBUTE_STANDARD
                  ? { value: this.metricDetails.Value }
                  : { referenceValue: this.metricDetails.ReferenceValue }),
              });
            })
          );

        break;
      case this.dependencyTypes.INSTANCE_NUMBER:
        this.metricEditForm.patchValue({
          noOfDeployments: this.metricDetails.Coefficient,
        });

        break;

      case this.dependencyTypes.STATIC_STANDARD:
        this.metricEditForm.patchValue({
          referenceValue: this.metricDetails.ReferenceValue,
        });

        break;

      default:
        break;
    }
  }

  private addControls(controlObjects: FormControlObject[]): void {
    for (let control of controlObjects) {
      this.metricEditForm.addControl(
        control.name,
        this.fb.control(control.value, control.validation)
      );
    }
  }

  private isValidEquipment(e, equipments): boolean {
    // debugger;

    const isValid = e.attributes.some((attr) => attr.name === 'environment');

    if (isValid) return true;

    if (!e.parent_type) return false;

    const parent = equipments.find((eqp) => eqp.type === e.parent_type);

    if (!parent) return false;

    return this.isValidEquipment(parent, equipments);
  }

  selectionChanged(property, data) {
    switch (property) {
      case 'firstEquipment':
        if (this.isProcessorOrNUP) {
          // Populate list of reference equipments
          this.referenceEquipmentsList = [];
          const selectedEquipment = this.equipmentsTypesList.filter(
            (eq) => eq.ID === data
          )[0];
          this.referenceEquipmentsList = [selectedEquipment];
          this.referenceEquipmentsList.push(
            ...this.getParents(
              this.equipmentsTypesList,
              selectedEquipment.parent_id
            )
          );
          this.checkReset(
            this.referenceEquipment,
            this.referenceEquipmentsList
          );
        }
        break;
      case 'referenceEquipment':
        this.referenceEquipment.markAsDirty();
        //  Populate list for core
        this.coresList = [];
        const selectedRefEquipment = this.equipmentsTypesList.find(
          (eq) => eq.ID === data
        );

        if (this.metricType === this.metricTypes.EQUIPMENT_ATTRIBUTE_STANDARD) {
          this.attributeName.reset();
          this.coresList = this.cs.customSort(
            selectedRefEquipment?.attributes.filter((a) =>
              ['INT'].includes(a.data_type)
            ) || [],
            'asc',
            'name'
          );
        } else {
          this.coresList = this.cs.customSort(
            selectedRefEquipment?.attributes.filter((a) =>
              ['FLOAT', 'INT'].includes(a.data_type)
            ) || [],
            'asc',
            'name'
          );
        }

        this.checkReset(this.core, this.coresList);

        if (this.isSagOrIbm) return;

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
        this.checkReset(this.aggregationLevel, this.aggregationLevelsList);
        // Populate list of attribute names
        if (this.metricType === this.metricTypes.ATTRIBUTE_COUNTER_STANDARD) {
          this.attributesList = this.cs.customSort(
            selectedRefEquipment?.attributes || [],
            'asc',
            'name'
          );
        }
        if (this.metricType === this.metricTypes.ATTRIBUTE_SUM_STANDARD) {
          this.attributesList = this.cs.customSort(
            selectedRefEquipment?.attributes.filter(
              (attr) => attr.data_type !== 'STRING'
            ) || [],
            'asc',
            'name'
          );
        }
        if (this.metricType === this.metricTypes.EQUIPMENT_ATTRIBUTE_STANDARD) {
          this.attributesList = this.cs.customSort(
            selectedRefEquipment?.attributes.filter(
              (attr) => attr.data_type === 'INT'
            ) || [],
            'asc',
            'name'
          );
        }

        break;
      case 'core':
        this.cpusList = [];
        this.cpusList = this.cs.customSort(
          this.coresList.filter((attr) => attr.ID != data),
          'asc',
          'name'
        );
        if (this.isSagOrIbm) {
          this.corefactorsList = [];
          this.corefactorsList = this.cs.customSort(
            this.coresList.filter((attr) => attr.ID != data),
            'asc',
            'name'
          );
          this.checkReset(this.corefactor, this.corefactorsList);
        }
        this.checkReset(this.cpu, this.cpusList);

        break;
      case 'cpu':
        this.corefactorsList = [];
        this.corefactorsList = this.cs.customSort(
          this.cpusList.filter((attr) => attr.ID != data),
          'asc',
          'name'
        );
        this.checkReset(this.corefactor, this.corefactorsList);
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
        this.checkReset(this.lastEquipment, this.lastEquipmentsList);
        break;
      case 'attributeName':
        if (
          this.metricType === this.metricTypes.ATTRIBUTE_COUNTER_STANDARD ||
          this.metricType === this.metricTypes.EQUIPMENT_ATTRIBUTE_STANDARD
        ) {
          this.zeroValueMsg = null;
          this.value.reset();
          this.value.enable();
          this.selectedAttributeDatatype = this.attributesList.filter(
            (attr) => attr.name === this.attributeName.value
          )[0].data_type;
        }
        if (this.metricType === this.metricTypes.ATTRIBUTE_SUM_STANDARD) {
          this.referenceValue.enable();
        }
        break;
    }
  }

  private getParents(
    equipmentsList: MetricEquipmentTypes[],
    parentId: string
  ): MetricEquipmentTypes[] {
    return equipmentsList.reduce((outputList, equipment, index) => {
      if (equipment.ID === parentId) {
        outputList.push(equipment);
        parentId = equipment.parent_id;
      }
      return outputList;
    }, []);
  }

  private checkReset(formControl: FormControl, array: any[]) {
    if (formControl?.value && !array.some((a) => a.ID === formControl.value)) {
      formControl.setValue(null);
      formControl.markAsTouched();
    }
  }

  updateMetric(): void {
    switch (this.metricType) {
      case this.metricTypes.ORACLE_NUP_STANDARD:
        this.updateOracleNupStandard();
        break;

      case this.metricTypes.ORACLE_PROCESSOR_STANDARD:
        this.updateOracleProcessorStandard();
        break;

      case this.metricTypes.IBM_PVU_STANDARD:
        this.updateIbmPvuStandard();
        break;

      case this.metricTypes.SAG_PROCESSOR_STANDARD:
        this.updateSagProcessorStandard();
        break;

      case this.metricTypes.ATTRIBUTE_COUNTER_STANDARD:
        this.updateAttributeCounterStandard();
        break;

      case this.metricTypes.ATTRIBUTE_SUM_STANDARD:
        this.updateAttributeSumStandard();
        break;

      case this.metricTypes.EQUIPMENT_ATTRIBUTE_STANDARD:
        this.updateEquipmentAttributeStandard();
        break;

      case this.metricTypes.INSTANCE_NUMBER_STANDARD:
        this.updateInstanceNumberStandard();
        break;

      case this.metricTypes.STATIC_STANDARD:
        this.updateStaticStandard();
        break;

      default:
        break;
    }
  }

  private updateOracleProcessorStandard(): void {
    const params: OracleProcessorStandardParams = {
      ID: this.metricDetails.ID,
      Name: this.metricName.value,
      num_core_attr_id: this.core.value,
      numCPU_attr_id: this.cpu.value,
      core_factor_attr_id: this.corefactor.value,
      start_eq_type_id: this.firstEquipment.value,
      base_eq_type_id: this.referenceEquipment.value,
      aggerateLevel_eq_type_id: this.aggregationLevel.value,
      end_eq_type_id: this.lastEquipment.value,
      scopes: [this.cs.getLocalData(LOCAL_KEYS.SCOPE)],
    };
    this.metricService.updateOracleProcessorStandard(params).subscribe(
      (res: MetricUpdateSuccess) => {
        this.openModal(this.successDialog);
      },
      (error: MetricUpdateError) => {
        this.openModal(this.errorDialog);
        this.errorMsg = error.message;
      }
    );
  }

  private updateOracleNupStandard(): void {
    const params: OracleNupStandardParams = {
      ID: this.metricDetails.ID,
      Name: this.metricName.value,
      num_core_attr_id: this.core.value,
      numCPU_attr_id: this.cpu.value,
      core_factor_attr_id: this.corefactor.value,
      start_eq_type_id: this.firstEquipment.value,
      base_eq_type_id: this.referenceEquipment.value,
      aggerateLevel_eq_type_id: this.aggregationLevel.value,
      end_eq_type_id: this.lastEquipment.value,
      number_of_users: this.noOfUsers.value,
      transform: this.transformProcessor,
      transform_metric_name: this.transformProcessor
        ? this.transformProcessorMetric.value
        : '',
      scopes: [this.cs.getLocalData(LOCAL_KEYS.SCOPE)],
    };
    this.metricService.updateOracleNupStandard(params).subscribe(
      (res: MetricUpdateSuccess) => {
        this.openModal(this.successDialog);
      },
      (error: MetricUpdateError) => {
        this.openModal(this.errorDialog);
        this.errorMsg = error.message;
      }
    );
  }

  private updateIbmPvuStandard(): void {
    const params: IbmPvuStandardParams = {
      ID: this.metricDetails.ID,
      Name: this.metricName.value,
      num_core_attr_id: this.core.value,
      numCPU_attr_id: this.cpu.value,
      core_factor_attr_id: this.corefactor.value,
      base_eq_type_id: this.referenceEquipment.value,
      scopes: [this.cs.getLocalData(LOCAL_KEYS.SCOPE)],
    };

    this.metricService.updateIbmPvuStandard(params).subscribe(
      (res: MetricUpdateSuccess) => {
        this.openModal(this.successDialog);
      },
      (error: MetricUpdateError) => {
        this.openModal(this.errorDialog);
        this.errorMsg = error.message;
      }
    );
  }

  private updateSagProcessorStandard(): void {
    const params: SagProcessorStandardParams = {
      ID: this.metricDetails.ID,
      Name: this.metricName.value,
      num_core_attr_id: this.core.value,
      numCPU_attr_id: this.cpu.value,
      core_factor_attr_id: this.corefactor.value,
      base_eq_type_id: this.referenceEquipment.value,
      scopes: [this.cs.getLocalData(LOCAL_KEYS.SCOPE)],
    };

    this.metricService.updateSagProcessorStandard(params).subscribe(
      (res: MetricUpdateSuccess) => {
        this.openModal(this.successDialog);
      },
      (error: MetricUpdateError) => {
        this.openModal(this.errorDialog);
        this.errorMsg = error.message;
      }
    );
  }

  private updateAttributeCounterStandard(): void {
    const params: AttributeCounterStandardParams = {
      ID: this.metricDetails.ID,
      name: this.metricName.value,
      eq_type: this.equipmentsTypesList.find(
        (e: MetricEquipmentTypes) => e.ID === this.referenceEquipment.value
      )?.type,
      attribute_name: this.attributesList.find(
        (a) => a.ID === this.attributeName.value
      )?.name,
      value: this.value.value,
      scopes: [this.cs.getLocalData(LOCAL_KEYS.SCOPE)],
    };

    this.metricService.updateAttributeCounterStandard(params).subscribe(
      (res: MetricUpdateSuccess) => {
        this.openModal(this.successDialog);
      },
      (error: MetricUpdateError) => {
        this.openModal(this.errorDialog);
        this.errorMsg = error.message;
      }
    );
  }

  private updateEquipmentAttributeStandard(): void {
    const eqType: MetricEquipmentTypes = this.equipmentsTypesList.find(
      (e: MetricEquipmentTypes) => e.ID === this.referenceEquipment.value
    );
    const params: EquipmentAttributeParams = {
      ID: this.metricDetails.ID,
      name: this.metricName.value,
      eq_type: eqType.type,
      attribute_name: eqType.attributes.reduce(
        (attributeName: string, attribute: MetricEquipmentAttributes) => {
          if (attribute.ID === this.attributeName.value) {
            attributeName = attribute.name;
          }
          return attributeName;
        },
        ''
      ),
      value: Number(this.value.value),
      environment: this.environmentValue.value,
      scopes: [this.cs.getLocalData(LOCAL_KEYS.SCOPE)],
    };

    this.metricService.equipmentAttributeStandard(params).subscribe(
      (res: MetricUpdateSuccess) => {
        this.openModal(this.successDialog);
      },
      (error: MetricUpdateError) => {
        this.openModal(this.errorDialog);
        this.errorMsg = error.message;
      }
    );
  }

  private updateAttributeSumStandard(): void {
    const eqType: MetricEquipmentTypes = this.equipmentsTypesList.find(
      (e: MetricEquipmentTypes) => e.ID === this.referenceEquipment.value
    );
    const params: AttributeSumStandardParams = {
      ID: this.metricDetails.ID,
      name: this.metricName.value,
      eq_type: eqType.type,
      attribute_name: eqType.attributes.reduce(
        (attributeName: string, attribute: MetricEquipmentAttributes) => {
          if (attribute.ID === this.attributeName.value) {
            attributeName = attribute.name;
          }
          return attributeName;
        },
        ''
      ),
      reference_value: this.referenceValue.value,
      scopes: [this.cs.getLocalData(LOCAL_KEYS.SCOPE)],
    };

    this.metricService.updateAttributeSumStandard(params).subscribe(
      (res: MetricUpdateSuccess) => {
        this.openModal(this.successDialog);
      },
      (error: MetricUpdateError) => {
        this.openModal(this.errorDialog);
        this.errorMsg = error.message;
      }
    );
  }

  private updateInstanceNumberStandard(): void {
    const params: InstanceNumberStandardParams = {
      ID: this.metricDetails.ID,
      Name: this.metricDetails.Name,
      num_of_deployments: this.noOfDeployments.value,
      scopes: [this.cs.getLocalData(LOCAL_KEYS.SCOPE)],
    };

    this.metricService.updateInstanceNumberStandard(params).subscribe(
      (res: MetricUpdateSuccess) => {
        this.openModal(this.successDialog);
      },
      (error: MetricUpdateError) => {
        this.openModal(this.errorDialog);
        this.errorMsg = error.message;
      }
    );
  }

  private updateStaticStandard(): void {
    const params: StaticStandardParams = {
      ID: this.metricDetails.ID,
      Name: this.metricDetails.Name,
      reference_value: this.referenceValue.value,
      scopes: [this.cs.getLocalData(LOCAL_KEYS.SCOPE)],
    };

    this.metricService.updateStaticStandard(params).subscribe(
      (res: MetricUpdateSuccess) => {
        this.openModal(this.successDialog);
      },
      (error: MetricUpdateError) => {
        this.openModal(this.errorDialog);
        this.errorMsg = error.message;
      }
    );
  }

  resetHandler(): void {
    Object.keys(this.metricEditForm.controls).forEach((key: string) => {
      if (this.excludeFields.includes(key)) return; // preventing some of the fields to be reset
      // this.metricEditForm.get(key).setValue(null);
      this.initiateForm();
      this.fetchMetricDetails();
    });
  }

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

  private openModal(template: TemplateRef<any>): void {
    this.dialog.open(template, {
      width: '30%',
      disableClose: true,
    });
  }

  private closeAll(): void {
    this.dialog.closeAll();
  }

  private setSelections(fieldSet: SetSelectionObject): void {
    for (let field of Object.keys(fieldSet)) {
      this.selectionChanged(field, fieldSet[field]);
    }
  }

  inputChangeDetection(value: any): void {
    this.metricEditForm.markAsTouched();
  }

  transformChange({ checked }: MatCheckboxChange): void {
    this.transformProcessor = checked;
    if (!checked) {
      this.transformProcessorMetric.setValue('');
      this.transformProcessorMetric.updateValueAndValidity();
      this.metricEditForm.markAsTouched();
    }
  }
}
