export interface ReportMetaData {
  createdBy: string;
  createdOn: string;
  scope: string;
  reportType: string;
  editor: string;
  equipmentType: string;
}

export interface ReportByIdResponse {
  report_type: string;
  report_data: string;
  scope: string;
  created_by: string;
  created_on: string;
  equip_type: string;
}

export interface DownloadInput {
  data: any[];
  headerList: string[];
  filename: string;
  formatType: 'CSV' | 'PDF' | 'XLSX';
  metaData?: ReportMetaData;
  translations?: object;
}

export interface ConvertCSVInput {
  objArray: any;
  headerList: string[];
  metaData?: ReportMetaData;
  translations?: object;
}
