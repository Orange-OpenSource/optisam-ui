import { SortDirection } from '@angular/material/sort';

export interface TabMenu {
  title: string;
  link: string;
  show: boolean;
  id?: ProductType | 'log';
}

export enum ProductType {
  INDIVIDUAL = 'Individual',
  AGGREGATION = 'Aggregation',
}

export interface UploadTypes {
  ANALYSIS: string;
  DATA: string;
  METADATA: string;
  GLOBAL_DATA: string;
  CORE_FACTOR: string;
}

export interface FileAnalysisStatus {
  completed: string;
  failed: string;
  partial: string;
}

export interface NominativeUserListParams {
  page_num: number;
  page_size: number;
  sort_by: string;
  sort_order: SortDirection;
  scopes: string;
  is_product: boolean;
  'search_params.product_name.filteringOrder'?: number;
  'search_params.product_name.filteringkey'?: string;
  'search_params.product_name.filter_type'?: boolean;
  'search_params.product_name.filteringkey_multiple'?: string[];
  'search_params.editor.filteringkey'?: string;
  'search_params.editor.filteringOrder'?: number;
  'search_params.editor.filter_type'?: boolean;
  'search_params.editor.filteringkey_multiple'?: string[];
  'search_params.aggregation_name.filteringOrder'?: number;
  'search_params.aggregation_name.filteringkey'?: string;
  'search_params.aggregation_name.filter_type'?: boolean;
  'search_params.aggregation_name.filteringkey_multiple'?: string[];
  'search_params.product_version.filteringOrder'?: number;
  'search_params.product_version.filteringkey'?: string;
  'search_params.product_version.filter_type'?: boolean;
  'search_params.product_version.filteringkey_multiple'?: string[];
  'search_params.user_name.filteringOrder'?: number;
  'search_params.user_name.filteringkey'?: string;
  'search_params.user_name.filter_type'?: boolean;
  'search_params.user_name.filteringkey_multiple'?: string[];
  'search_params.first_name.filteringOrder'?: number;
  'search_params.first_name.filteringkey'?: string;
  'search_params.first_name.filter_type'?: boolean;
  'search_params.first_name.filteringkey_multiple'?: string[];
  'search_params.user_email.filteringOrder'?: number;
  'search_params.user_email.filteringkey'?: string;
  'search_params.user_email.filter_type'?: boolean;
  'search_params.user_email.filteringkey_multiple'?: string[];
  'search_params.profile.filteringOrder'?: number;
  'search_params.profile.filtering<key'?: string;
  'search_params.profile.filter_type'?: boolean;
  'search_params.profile.filteringkey_multiple'?: string[];
  'search_params.activation_date'?: string;
}

export interface NominativeUsersExportParams
  extends Omit<NominativeUserListParams, 'page_num' | 'page_size'> {}

export interface ConcurrentUserListParams {
  page_num: number;
  page_size: number;
  sort_by: string;
  sort_order: 'asc' | 'desc';
  scopes: string;
  is_aggregation: boolean;
  number_of_users?: number;
  'search_params.product_name.filteringOrder'?: number;
  'search_params.product_name.filteringkey'?: string;
  'search_params.product_name.filter_type'?: boolean;
  'search_params.product_name.filteringkey_multiple'?: string[];
  'search_params.product_editor.filteringOrder'?: number;
  'search_params.product_editor.filteringkey'?: string;
  'search_params.product_editor.filter_type'?: boolean;
  'search_params.product_editor.filteringkey_multiple'?: string[];
  'search_params.aggregation_name.filteringOrder'?: number;
  'search_params.aggregation_name.filteringkey'?: string;
  'search_params.aggregation_name.filter_type'?: boolean;
  'search_params.aggregation_name.filteringkey_multiple'?: string[];
  'search_params.product_version.filteringOrder'?: number;
  'search_params.product_version.filteringkey'?: string;
  'search_params.product_version.filter_type'?: boolean;
  'search_params.product_version.filteringkey_multiple'?: string[];
  'search_params.profile_user.filteringOrder'?: number;
  'search_params.profile_user.filteringkey'?: string;
  'search_params.profile_user.filter_type'?: boolean;
  'search_params.profile_user.filteringkey_multiple'?: string[];
  'search_params.team.filteringOrder'?: number;
  'search_params.team.filteringkey'?: string;
  'search_params.team.filter_type'?: boolean;
  'search_params.team.filteringkey_multiple'?: string[];
  'search_params.purchase_date'?: string;
}

export interface ConcurrentUsersExportParams
  extends Omit<ConcurrentUserListParams, 'page_num' | 'page_size'> {}

export interface NominativeUserListResponse {
  totalRecords: number;
  nominative_user: NominativeUserList[];
}

export interface ConcurrentUserListResponse {
  totalRecords: number;
  concurrent_user: ConcurrentUserList[];
}

export interface NominativeUserList {
  product_name: string;
  aggregation_name: string;
  product_version: string;
  user_name: string;
  first_name: string;
  user_email: string;
  profile: string;
  activation_date: string;
  editor?: string;
  aggregation_id: number;
  id: number;
}

export interface ConcurrentUserList {
  product_name: string;
  aggregation_name: string;
  product_version: string;
  product_editor?: string;
  team: string;
  profile_user: string;
  number_of_users: number;
  purchase_date: string;
  aggregation_id: number;
  is_aggregation: boolean;
  id: number;
}

export interface NominativeUserProductBody {
  editor: string;
  scope: string;
  product_name: string;
  product_version: string;
  aggregation_id: number;
  user_details: NominativeUserDetails[];
}

export interface ConcurrentUserBody {
  scope: string;
  aggregation_id: number;
  is_aggregations: boolean;
  swidtag: string;
  product_name: string;
  product_editor: string;
  product_version: string;
  number_of_users: number;
  profile_user: string;
  team: string;
  id: number;
}

export interface NominativeUserDetails {
  user_name: string;
  first_name: string;
  email: string;
  profile: string;
  activation_date: string;
  fileInsertion?: boolean;
}

export interface UserDetailFormType {
  activationDate: Date;
  email: string;
  firstName: string;
  profile: string;
  username: string;
}

export interface SharedLicencesUpdateResponse {
  success: boolean;
}

export interface SharedDataLicences {
  available_licenses: number;
  shared_data: SharedDatum[];
  total_shared_licenses: number;
  total_recieved_licenses: number;
}

export interface SharedDatum {
  scope: string;
  shared_licenses: number;
  recieved_licenses: number;
}

export interface SharedLicencesParams {
  scope: string;
  sku: string;
}

export interface SharedLicData {
  scope: string;
  sharedLicencesNum: string;
}

export interface SharedLicencesUpdateParams {
  sku: string;
  license_data: LicenseDatum[];
  scope: string;
}
export interface SharedAggregationUpdateParams {
  sku: string;
  license_data: LicenseDatum[];
  scope: string;
  aggregation_name: string;
}

export interface LicenseDatum {
  reciever_scope: string;
  shared_licenses: string;
}

export interface SharedAmount {
  total_shared_amount: number;
  total_recieved_amount: number;
}

export interface SharedAmountParams {
  scope: string;
}

export enum NominativeUserType {
  product = 'product',
  aggregation = 'aggregation',
}

export enum NominativeUserDownloadType {
  error = 'error',
  actual = 'actual',
}
export interface NominativeUserDownloadParams {
  id: number;
  scope: string;
  type: NominativeUserDownloadType;
}
