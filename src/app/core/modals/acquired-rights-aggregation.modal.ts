import { ProductVersionMapping } from './product-catalog.modal';
export interface AcquiredRightsAggregation {
  aggregations: Aggregation[];
}

export interface Aggregation {
  ID: number;
  aggregation_name: string;
  sku: string;
  product_editor: string;
  metric_name: string;
  product_names: string[];
  swidtags: string[];
  num_licenses_acquired: number;
  avg_unit_price: number;
  start_of_maintenance: string;
  end_of_maintenance: string;
  num_licences_maintenance: number;
  avg_maintenance_unit_price: number;
  scope: string;
  comment: string;
  ordering_date: string;
  corporate_sourcing_contract: string;
  software_provider: string;
  last_purchased_order: string;
  support_number: string;
  maintenance_provider: string;
  file_name: string;
  file_data: string;
}

export interface AggregationEditorParams {
  scope: string;
}

export interface AggregationProductsParams {
  scope: string;
  metric: string;
  editor: string;
  ID?: number;
}

export interface AggregationProductListResponse {
  aggrights_products: AggregationProductObject[];
  selected_products?: AggregationProductObject[];
}

export interface AggregationProductObject {
  swidtag: string;
  product_name: string;
}

export interface AcquiredRightAggregationBody
  extends Omit<Aggregation, 'aggregation_name' | 'sku' | 'repartition'> {
  aggregation_name?: string;
  sku?: string;
  repartition?: boolean;
}

export type AggregationData = AcquiredRightAggregationBody | {};

export interface AcquiredRightAggregationUpdateParams {
  ID: number;
}

export interface AcquiredRightAggregationQuery {
  page_num: string;
  page_size: string;
  sort_order: string;
  sort_by: string;
  scope: string[] | string;
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
  'search_params.ordering_date.filteringOrder'?: number;
  'search_params.ordering_date.filteringkey'?: string;
  'search_params.ordering_date.filter_type'?: boolean;
  'search_params.ordering_date.filteringkey_multiple'?: string[];
  'search_params.software_provider.filteringOrder'?: number;
  'search_params.software_provider.filteringkey'?: string;
  'search_params.software_provider.filter_type'?: boolean;
  'search_params.software_provider.filteringkey_multiple'?: string[];
}

export interface AggregatedAcquiredRights {
  totalRecords: number;
  aggregations: Aggregation[];
}

export interface ProductDetails {
  editor: string;
  product_name: string;
  swidtag: string;
}

export interface CreateAggregationPlayload {
  ID: number;
  aggregation_name: string;
  product_editor: string;
  scope: string;
  product_names: string[];
  swidtags: string[];
}

export interface GetAggregationParams {
  scope: string;
  page_size: number;
  page_num: number;
  sort_by: string;
  sort_order: 'asc' | 'desc';
  'search_params.aggregation_name.filteringOrder'?: number;
  'search_params.aggregation_name.filteringkey'?: string;
  'search_params.aggregation_name.filter_type'?: boolean;
  'search_params.aggregation_name.filteringkey_multiple'?: string[];
  'search_params.product_editor.filteringOrder'?: number;
  'search_params.product_editor.filteringkey'?: string;
  'search_params.product_editor.filter_type'?: boolean;
  'search_params.product_editor.filteringkey_multiple'?: string[];
}

export interface AggregationGetResponse {
  aggregations: AggregationSingle[];
  total_records?: number;
  totalRecords?: number;
}

export interface AggregationSingle {
  ID: number;
  aggregation_name: string;
  product_editor: string;
  product_names: string[];
  swidtags: string[];
  scope: string;
  mapping: ProductVersionMapping[];
}
