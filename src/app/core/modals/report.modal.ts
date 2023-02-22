export interface ReportMetaData {
  createdBy: string;
  createdOn: string;
  scope: string;
  reportType: string;
  editor: string;
}

export interface ReportByIdResponse {
  report_type: string;
  report_data: string;
  scope: string;
  created_by: string;
  created_on: string;
}
