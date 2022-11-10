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
  other: AdvanceSearchField[];
  primary: string;
  translate?: boolean;
}

export interface AdvanceSearchField {
  key: string;
  label: string;
  type?: 'text' | 'date';
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
  ONLY_DIGITS: string;
  DIGITS_WITH_NAV: string;
}
