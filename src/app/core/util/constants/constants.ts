import {
  FileAnalysisStatus,
  UploadTypes,
  MetricTypes,
  PaginationDefaults,
  TableSortOrder,
} from '@core/modals';

export const PROHIBIT_SCOPES: string[] = ['GENERIC'];
export const UPLOAD_TYPES: UploadTypes = {
  ANALYSIS: 'analysis',
  DATA: 'data',
  METADATA: 'metadata',
  GLOBAL_DATA: 'globaldata',
  CORE_FACTOR: 'corefactor',
};

export const FILE_ANALYSIS_STATUS: FileAnalysisStatus = {
  completed: 'COMPLETED',
  failed: 'FAILED',
  partial: 'PARTIAL',
};

export const REPORT_FILE_NAME = 'Report.xlsx';

export const LOCAL_KEYS = {
  SCOPE_TYPE: 'scopeType',
  ROLE: 'role',
  ACCESS_TOKEN: 'access_token',
  SCOPE: 'scope',
  LANGUAGE: 'language',
  RELEASE_NOTES: 'releaseNotes',
  FUTURE: 'future',
  VERSION: 'version',
  COPYRIGHT: 'copyright',
};

export const METRIC_TYPES: MetricTypes = {
  ORACLE_PROCESSOR_STANDARD: 'oracle.processor.standard',
  ORACLE_NUP_STANDARD: 'oracle.nup.standard',
  SAG_PROCESSOR_STANDARD: 'sag.processor.standard',
  IBM_PVU_STANDARD: 'ibm.pvu.standard',
  ATTRIBUTE_COUNTER_STANDARD: 'attribute.counter.standard',
  ATTRIBUTE_SUM_STANDARD: 'attribute.sum.standard',
  INSTANCE_NUMBER_STANDARD: 'instance.number.standard',
  STATIC_STANDARD: 'static.standard',
};

export const ORACLE_TYPES = [
  METRIC_TYPES.ORACLE_NUP_STANDARD,
  METRIC_TYPES.ORACLE_PROCESSOR_STANDARD,
];

export const METRIC_DEPENDENCY_TYPES = {
  PROCESSOR_OR_NUP: 'processorOrNUP',
  ORACLE_NUP: 'oracleNUP',
  SAG_OR_IBM: 'sagOrIbm',
  ATTRIBUTE_COUNTER_OR_ATTRIBUTE_SUM: 'attributeCounterOrAttributeSum',
  INSTANCE_NUMBER: 'instanceNumber',
  STATIC_STANDARD: 'staticStandard',
};

export const PAGINATION_DEFAULTS: PaginationDefaults = {
  currentPageNum: 1,
  pageSize: 50,
  sortOrder: TableSortOrder.ASC,
  length: null,
};