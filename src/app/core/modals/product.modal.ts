import { ProductType } from './data-management.modal';

export enum ProductLocation {
  ON_PREMISE = 'ONPREMISE',
  SAAS = 'SAAS',
}

export class Products {
  swidTag: string;
  name: string;
  version: string;
  category: string;
  edition: string;
  editor: string;
  totalCost: number;
  numOfApplications: number;
  numofEquipments: number;
  allocatedUser: number;
  allocatedMetric: string;
  numofUsers: number;
  location: ProductLocation;
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

export interface UserIndividualCountDetailData {
  productType: ProductType.INDIVIDUAL;
  product: Products;
}

export interface UserAggregationCountDetailData {
  productType: ProductType.AGGREGATION;
  product: ProductAggregation;
}

export type UserCountDetailData =
  | UserIndividualCountDetailData
  | UserAggregationCountDetailData;

export interface ProductAggregation {
  ID: number;
  aggregation_name: string;
  editor: string;
  individual_product_exists: boolean;
  num_applications: number;
  num_equipments: number;
  swidtags: string[];
  total_cost: number;
  users_count: number;
}

export interface ConcurrentUserHistoryParams {
  scope: string;
  swidtag?: string;
  aggID?: number;
  start_date: string;
  end_date: string;
}

export interface ConcurrentUserHistoryResponse {
  concurrentUsersByDays: ConcurrentUserHistorySet[];
  concurrentUsersByMonths: ConcurrentUserHistorySet[];
}

export interface ConcurrentUserHistorySet {
  purchase_month: string;
  concurrent_users: number;
}
export interface EditorsListResponse {
  editors: string[];
}

export interface EditorsListParams {
  scopes: string;
}

export interface UploadedFiles {
  file_details: FileDetail[];
  total: number;
}

export interface FileDetail {
  id: number;
  scope: string;
  swidtag: string;
  aggregations_id: number;
  product_editor: string;
  product_name: string;
  aggregation_name: string;
  product_version: string;
  uploaded_by: string;
  nominative_users_details: NominativeUserDetail[];
  record_succeed: number;
  record_failed: number;
  file_name: string;
  sheet_name: string;
  file_status: NominativeUserFileStatus;
  uploaded_at: string;
  downloadingStatus?: boolean;
  errorFileDownloadingStatus?: boolean;
}

export interface NominativeUserDetail {
  user_name: string;
  first_name: string;
  email: string;
  profile: string;
  activation_date: string;
  comments: string;
}

export interface UploadedFilesParams {
  id?: number;
  scope: string;
  page_num: number;
  page_size: number;
  sort_by: string;
  sort_order: 'asc' | 'desc';
}

export enum NominativeUserFileStatus {
  partial = 'PARTIAL',
  failed = 'FAILED',
  completed = 'SUCCESS',
  pending = 'PENDING',
}

export interface EntitySoftExpenseResponse {
  expense_percent: EntityExpensePercent[];
  total_expenditure: number;
  total_cost: number;
}

export interface EntityExpensePercent {
  scope: string;
  expenditure: number;
  totalCost: number;
  expenditure_percent: number;
}

export interface ProductCatalogOverview {
  total_editor: number;
  total_product: number;
}

export interface DashboardOverviewResponse {
  total_license_cost: number;
  total_maintenance_cost: number;
  num_editors: number;
  num_products: number;
  total_counterfeiting_amount: number;
  total_underusage_amount: number;
  computed_maintenance: number;
  computed_without_maintenance: number;
}

export interface TrueUpDashboardResponse {
  total_true_up_cost: number;
  editors_true_up_cost: EditorTrueUpCost[];
}

export interface EditorTrueUpCost {
  editor: string;
  editor_cost: number;
  products_true_up_cost: ProductTrueUpCost[];
}

export interface ProductTrueUpCost {
  product: string;
  product_cost: number;
  aggregation_name: string;
}

export interface TrueUpDashboardParams {
  scope: string;
}

export interface WasteDashboardResponse {
  total_waste_up_cost: number;
  editors_waste_up_cost: EditorWasteCost[];
}

export interface EditorWasteCost {
  editor: string;
  editor_cost: number;
  products_waste_up_cost: ProductWasteCost[];
}

export interface ProductWasteCost {
  product: string;
  product_cost: number;
  aggregation_name: string;
}

export interface WasteDashboardParams {
  scope: string;
}

export interface TreeMapData {
  x: string;
  y: number;
  editor?: any;
  fillColor: string;
}

export interface SoftwareExpenditure {
  editorExpensesByScope: EditorExpensesByScope[];
}

export interface EditorExpensesByScope {
  editor_name: string;
  total_purchase_cost: number;
  total_maintenance_cost: number;
  total_cost: number;
  total_computed_cost: number;
}
export interface SoftwareExpenditureProduct {
  editorProductExpensesByScope: EditorProductExpensesByScope[];
}

export interface EditorProductExpensesByScope {
  name: string;
  total_purchase_cost: number;
  total_maintenance_cost: number;
  total_cost: number;
  total_computed_cost: number;
  type: string;
}

export interface SoftwareMaintenance {
  product_with_maintenance_percentage: number;
  product_without_maintenance_percentage: number;
  ProductPerc: ProductPerc[];
}

export interface ProductPerc {
  swidtag: string;
  precentage_covered: number;
}

export interface SoftwareWithNoMaintenance {
  total_products: number;
  product_no_main: ProductNoMain[];
}

export interface ProductNoMain {
  sku: string;
  product_name: string;
  version: string;
}

export interface Overview {
  total_license_cost: number;
  total_maintenance_cost: number;
  num_editors: number;
  num_products: number;
  total_counterfeiting_amount: number;
  total_underusage_amount: number;
}

export interface DeploymentType {
  saas_percentage: number;
  on_premise_percentage: number;
}

export interface DashboardLocationResponse {
  open_source: OpenSourceList[];
  closed_source: ClosedSourceList[];
  total_amount: TotalAmount[];
}

export interface ClosedSourceList {
  precentage_cs: number;
  amount_cs: number;
}

export interface OpenSourceList {
  precentage_os: number;
  amount_os: number;
}

export interface TotalAmount {
  precentage: number;
  amount: number;
}

export interface SoftwareExpenditureByProductParams {
  scope: string;
  editor: string;
}

export interface GlobalDataListingParams {
  page_num: number;
  page_size: number;
  sort_order: string;
  sort_by: string;
  scope: string;
}

export interface GlobalDataListingResponse {
  totalRecords: number;
  uploads: InjectionData[];
}

export interface InjectionData {
  upload_id: number;
  scope: string;
  file_name: string;
  status: string;
  uploaded_by: string;
  uploaded_on: string;
  total_records: number;
  success_records: number;
  failed_records: number;
  comments: string;
  error_file_api: string;
}

export interface CancelInjectionParams {
  uploadId: number;
  scope: string;
  fileName: string;
}
