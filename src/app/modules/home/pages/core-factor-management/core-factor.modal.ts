export interface CoreFactorListGetParam {
  pageNo: number;
  pageSize: number;
}

export interface CoreFactorListResponse {
  references: CoreFactorListData[];
  totalRecord: number;
}

export interface CoreFactorListData {
  manufacturer: string;
  model: string;
  corefactor: string;
}

export interface ActivityLog {
  fileName: string;
  uploadOn: string;
}

export interface ActivityLogResponse {
  corefactorlogs: ActivityLog[];
}
