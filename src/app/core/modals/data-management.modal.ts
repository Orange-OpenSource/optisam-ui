export interface TabMenu {
  title: string;
  link: string;
  show: boolean;
}

export interface UploadTypes {
  ANALYSIS: string;
  DATA: string;
  METADATA: string;
  GLOBAL_DATA: string;
  CORE_FACTOR: string;
}

export interface FileAnalysisStatus {
  completed: string;
  failed: string;
  partial: string;
}
