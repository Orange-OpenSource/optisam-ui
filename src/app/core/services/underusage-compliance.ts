export interface ComplianceUnderUsage {
  UnderusageByEditorData: UnderUsageEditors[];
}

export interface UnderUsageEditors {
  scope: string;
  metrics: string;
  delta_number: string;
  product_name: string;
  is_aggregation: boolean;
}

export interface UnderUsageComplianceParams {
  scopes: string[];
  sortBy: string;
  sortOrder: string;
  editor: string;
  product_name?: string;
}
