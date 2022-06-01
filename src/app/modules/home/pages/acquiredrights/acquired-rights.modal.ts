export interface AcquiredRightsAggregation {
  aggregations: Aggregation[];
}

export interface Aggregation {
  ID: number;
  aggregation_name: string;
  sku: string;
  product_editor?: string;
  metric_name?: string;
  product_names?: string[];
  swidtags?: string[];
  num_licenses_acquired: number;
  avg_unit_price: number;
  start_of_maintenance: string;
  end_of_maintenance: string;
  num_licences_maintainance: number;
  avg_maintenance_unit_price: number;
  scope: string;
  comment: string;
  ordering_date: string;
  corporate_sourcing_contract: string;
  software_provider: string;
  last_purchased_order: string;
  support_number: string;
  maintenance_provider: string;
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
  extends Omit<
    Aggregation,
    | 'aggregation_name'
    | 'aggregationID'
    | 'sku'
    | 'ID'
    | 'num_licences_maintainance'
  > {
  ID?: number;
  aggregation_name?: string;
  sku?: string;
  aggregationID?: string;
  num_licences_maintainance?: number;
  num_licences_maintenance?: number;
  file_name?: string;
  file_data?: string;
}

export interface AcquiredRightAggregationUpdateParams {
  ID: number;
}
