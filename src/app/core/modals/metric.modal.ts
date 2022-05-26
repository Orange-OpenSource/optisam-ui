export interface MetricEditInputData {
  metric: Metric;
}

export interface Metric {
  name: string;
  description: string;
  type: string;
}

export interface MetricTypes {
  ORACLE_PROCESSOR_STANDARD: string;
  ORACLE_NUP_STANDARD: string;
  SAG_PROCESSOR_STANDARD: string;
  IBM_PVU_STANDARD: string;
  ATTRIBUTE_COUNTER_STANDARD: string;
  ATTRIBUTE_SUM_STANDARD: string;
  INSTANCE_NUMBER_STANDARD: string;
}

export interface MetricDetailsParams {
  'metric_info.type': string;
  'metric_info.name': string;
  scopes: string;
  GetID?: boolean;
}

export interface MetricDependencyTypes {
  PROCESSOR_OR_NUP: string;
  ORACLE_NUP: string;
  SAG_OR_IBM: string;
  ATTRIBUTE_COUNTER_OR_ATTRIBUTE_SUM: string;
  INSTANCE_NUMBER: string;
}

export interface MetricEquipmentTypes {
  ID: string;
  attributes: MetricEquipmentAttributes[];
  metadata_id: string;
  metadata_source: string;
  parent_id: string;
  parent_type: string;
  scopes: string[];
  type: string;
}

export interface MetricEquipmentAttributes {
  ID: string;
  data_type: string;
  displayed: boolean;
  mapped_to: string;
  name: string;
  parent_identifier: boolean;
  primary_key: boolean;
  searchable: boolean;
  simulated: boolean;
}

export interface MetricCore {
  ID: string;
  data_type: string;
  displayed: boolean;
  mapped_to: string;
  name: string;
  parent_identifier: boolean;
  primary_key: boolean;
  searchable: boolean;
  simulated: boolean;
}

export interface OracleProcessorStandardParams {
  ID: string;
  Name: string;
  num_core_attr_id: string;
  numCPU_attr_id: string;
  core_factor_attr_id: string;
  start_eq_type_id: string;
  base_eq_type_id: string;
  aggerateLevel_eq_type_id: string;
  end_eq_type_id: string;
  scopes: string[];
}

export interface OracleNupStandardParams extends OracleProcessorStandardParams {
  number_of_users: number;
}

export interface MetricUpdateErrorDetails {
  type_url: string;
  value: string;
}

export interface MetricUpdateSuccess {
  success: boolean;
}

export interface MetricUpdateError {
  code: number;
  message: string;
  details: MetricUpdateErrorDetails[];
}

export interface IbmPvuStandardParams {
  ID: string;
  Name: string;
  num_core_attr_id: string;
  core_factor_attr_id: string;
  base_eq_type_id: string;
  scopes: string[];
}

export interface SagProcessorStandardParams extends IbmPvuStandardParams {}

export interface AttributeCounterStandardParams {
  ID: string;
  name: string;
  eq_type: string;
  attribute_name: string;
  value: string;
  scopes: string[];
}

export interface AttributeSumStandardParams {
  ID: string;
  name: string;
  eq_type: string;
  attribute_name: string;
  reference_value: number;
  scopes: string[];
}

export interface IntanceNumberStandardParams {
  ID: string;
  Name: string;
  num_of_deployments: number;
  scopes: string[];
}

export interface OracleProcessorNupSelectionObject {
  firstEquipment: string;
  referenceEquipment: string;
  core: string;
  cpu: string;
  aggregationLevel: string;
}

export interface sagOrIbmSelectionObject {
  referenceEquipment: string;
  core: string;
}

export type SetSelectionObject =
  | OracleProcessorNupSelectionObject
  | sagOrIbmSelectionObject;