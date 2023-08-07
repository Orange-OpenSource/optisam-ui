export interface FormControlObject {
  name: string;
  value: any;
  validation: any[];
}

export interface ErrorDetails {
  type_url: string;
  value: string;
}

export interface ErrorResponse {
  code: number;
  message: string;
  details: ErrorDetails[];
}

export interface SuccessResponse {
  success: boolean;
}
export interface AdvanceSearchModel {
  title: string;
  other: Array<AdvanceSearchField | AdvanceSearchFieldSelect>;
  primary: string;
  translate?: boolean;
}

export interface AdvanceSearchField {
  key: string;
  label: string;
  type?: 'text' | 'date';
  show?: boolean;
}

export interface AdvanceSearchFieldSelect
  extends Omit<AdvanceSearchField, 'type'> {
  type: 'select';
  selection: {
    key: string;
    value: string;
  }[];
}

export enum TableSortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
export interface PaginationDefaults {
  currentPageNum: number;
  pageSize: number;
  sortOrder: TableSortOrder;
  length: number;
}

export interface CommonRegex {
  ONLY_DIGITS: RegExp;
  DIGITS_WITH_NAV: RegExp;
  DIGITS_WITH_DECIMALS: RegExp;
}

export interface PaginationEvent {
  length: number;
  pageIndex: number;
  pageSize: number;
  previousPageIndex: number;
}

export interface CommonPopupSetting {
  title: string;
  message: string;
  singleButton?: boolean;
  buttonText: string;
  messageVariable?: object;
}

export interface PaginationEvent {
  previousPageIndex: number;
  pageIndex: number;
  pageSize: number;
  length: number;
}
