import { Aggregation } from './acquired-rights-aggregation.modal';

export interface AcquiredRightsIndividualParams {
  page_num: number;
  page_size: number;
  sort_by: string;
  sort_order: string;
  scopes: string | string[];
  'search_params.swidTag.filteringOrder'?: number;
  'search_params.swidTag.filteringkey'?: string;
  'search_params.swidTag.filter_type'?: boolean;
  'search_params.swidTag.filteringkey_multiple'?: string[];
  'search_params.SKU.filteringOrder'?: number;
  'search_params.SKU.filteringkey'?: string;
  'search_params.SKU.filter_type'?: boolean;
  'search_params.SKU.filteringkey_multiple'?: string[];
  'search_params.editor.filteringOrder'?: number;
  'search_params.editor.filteringkey'?: string;
  'search_params.editor.filter_type'?: boolean;
  'search_params.editor.filteringkey_multiple'?: string[];
  'search_params.productName.filteringOrder'?: number;
  'search_params.productName.filteringkey'?: string;
  'search_params.productName.filter_type'?: boolean;
  'search_params.productName.filteringkey_multiple'?: string[];
  'search_params.metric.filteringOrder'?: number;
  'search_params.metric.filteringkey'?: string;
  'search_params.metric.filter_type'?: boolean;
  'search_params.metric.filteringkey_multiple'?: string[];
  'search_params.softwareProvider.filteringOrder'?: number;
  'search_params.softwareProvider.filteringkey'?: string;
  'search_params.softwareProvider.filter_type'?: boolean;
  'search_params.softwareProvider.filteringkey_multiple'?: string[];
  'search_params.orderingDate.filteringOrder'?: number;
  'search_params.orderingDate.filteringkey'?: string;
  'search_params.orderingDate.filter_type'?: boolean;
  'search_params.orderingDate.filteringkey_multiple'?: string[];
}

export interface AcquiredRights
  extends Omit<Aggregation, 'swid_tag' | 'product_name'> {
  swid_tag: string;
  product_name: string;
}

export interface AcquiredRightsResponse {
  acquired_rights: AcquiredRights[];
  totalRecords: number;
}
