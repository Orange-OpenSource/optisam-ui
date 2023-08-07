import { ProductDetails } from './acquired-rights-aggregation.modal';
import { AcquiredRightsIndividualParams } from './acquired-rights.modal';

export interface AggregationProductRes {
  aggrights_products: ProductDetails[];
  selected_products: ProductDetails[];
}

export interface AcquiredRightsAggregationParams {
  page_num: number;
  page_size: number;
  sort_by?: string;
  sort_order: string;
  scope: string;
  'search_params.name.filteringkey'?: string;
  'search_params.name.filteringOrder'?: number;
  'search_params.name.filter_type'?: boolean;
  'search_params.name.filteringkey_multiple'?: string[];
  'search_params.editor.filteringOrder'?: number;
  'search_params.editor.filteringkey'?: string;
  'search_params.editor.filter_type'?: boolean;
  'search_params.editor.filteringkey_multiple'?: string[];
  'search_params.SKU.filteringOrder'?: number;
  'search_params.SKU.filteringkey'?: string;
  'search_params.SKU.filter_type'?: boolean;
  'search_params.SKU.filteringkey_multiple'?: string[];
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
