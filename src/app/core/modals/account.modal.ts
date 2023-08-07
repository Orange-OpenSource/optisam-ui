export interface ExpenseBodyParams {
  expenses: number;
  scope_code: string;
}

export interface ScopeExpenseResponse {
  expenses: number;
  scope_code: string;
}

export interface GroupComplianceAddParams {
  ID?: string;
  name: string;
  fully_qualified_name: string;
  scopes: string[];
  parent_id: string;
  num_of_child_groups?: number;
  num_of_users?: number;
  group_compliance?: boolean;
}
