export class Products {
  swidTag: string;
  name: string;
  version: string;
  category: string;
  editor: string;
  numOfOptions: string;
  numOfApplications: string;
  numofEquipments: string;
}
class ProdApplications {
  swidTag: string;
  name: string;
  Editor: string;
  Edition: string;
  Version: string;
  totalCost: string;
  numOfInstances: string;
  numofEquipments: string;
}

export interface AggregationProductsInformation {
  products: string[];
}

export interface AggregationDetailsInformation {
  ID: string;
  name: string;
  editor: string;
  product_name: string;
  metric: string;
  num_applications: number;
  num_equipments: number;
  products: string[];
  editions: string[];
}

export interface AggregationDetailsOptions {
  numOfOptions: number;
  optioninfo: OptionInformation[];
}

export interface OptionInformation {
  swidTag: string;
  Name: string;
  edition: string;
  editor: string;
  version: string;
  metric: string;
}

export interface AggregationDetailsAquiredRights {
  acq_rights: AquiredRightsInformation[];
}

export interface MetricComputationDetails {
  computed_details: ComputedDetails[];
}

export interface AggregationComputationDetails {
  computed_details: ComputedAggDetails[];
}

export interface ComputedAggDetails {
  metric_name: string;
  numCptLicences: number;
  computedDetails: string;
  numAcqLicences: number;
  deltaNumber: number;
  deltaCost: number;
}
export interface ComputedDetails {
  metric_name: string;
  numCptLicences: number;
  computedDetails: string;
  numAcqLicences: number;
  deltaNumber: number;
  deltaCost: number;
}

export interface AquiredRightsInformation {
  SKU: string;
  swidTag: string;
  metric: string;
  numCptLicences: number;
  numAcqLicences: number;
  computedDetails: string;
  totalCost: number;
  deltaNumber: number;
  deltaCost: number;
  metricNotDefined: boolean;
}

export interface ProductAggregationApplications {
  totalRecords: number;
  applications: AggregationApplications[];
}

export interface AggregationApplications {
  application_id: string;
  name: string;
  app_owner: string;
  numOfInstances: number;
  numofEquipments: number;
}

export interface MetricSimulationRequest {
  swid_tag: string;
  metric_name: string;
  unit_cost: number;
}

export interface CostSimulationRequest {
  swid_tag: string;
  metric_name: string;
  unit_cost: number;
}
export interface MetricSimulationResponse {
  numCptLicences: number;
  total_cost: number;
  metric_name?: string;
}

export interface CostSimulationResponse {
  numCptLicences: number;
  total_cost: number;
  metric_name?: string;
}
