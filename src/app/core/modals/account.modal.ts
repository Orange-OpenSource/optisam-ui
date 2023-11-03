export interface ExpenseBodyParams {
  expenses: number | string;
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

export enum PasswordAction {
  activation = '0',
  reset = '1'
}


export interface SetPasswordBody {
  user: string;
  passwordConfirmation: string;
  password: string;
  token: string;
  action: PasswordAction;
}


export interface SetPasswordResponse {
  success: boolean;
}

export enum UserStatus {
  active = "Active",
  inactive = "Inactive",
}

export interface ResendActivationLinkParams {
  user: string;
}


