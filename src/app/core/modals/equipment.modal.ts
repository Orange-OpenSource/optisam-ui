export interface DeleteAllocatedMetricParams {
  scope: string;
  swidtag: string;
  equipment_id: string;
  eq_type: string;
  allocated_metrics: string;
  eqTypeId: string;
}

export interface DeleteAllocatedMetricResponse {
  success: boolean;
}

export interface AttributeData {
  ID: string;
  data_type: string;
  displayed: boolean;
  mapped_to: string;
  name: string;
  parent_identifier: boolean;
  primary_key: boolean;
  searchable: boolean;
  simulated: boolean;
  schema_name?: string;
}

export interface DeleteAttributeParams {
  id: string;
  equip_type: string;
  scope: string;
  'deleteAttributes.ID': string;
  'deleteAttributes.name': string;
}
