import {
  FileAnalysisStatus,
  UploadTypes,
  MetricTypes,
  PaginationDefaults,
  TableSortOrder,
  CommonRegex,
  MenuRouterLinks,
  ProductColumn,
} from '@core/modals';
import { pieChartDataLabelFormatter } from '../common.functions';
import Chart from 'chart.js';
import { Options } from 'chartjs-plugin-datalabels/types/options';

const allowedScopes = (): boolean => {
  const currentScope: string = localStorage.getItem('scopeType') || '';
  const prohibitedScopes: Array<string> = PROHIBIT_SCOPES || []; // prohibition list
  if (!prohibitedScopes.length) return true; // Blank array([]) means no prohibition is set and we can pass true.
  return !prohibitedScopes.includes(currentScope); // If the current scope is present in the prohibition list then we can return false.
};

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
  EQUIPMENT_ATTRIBUTE_STANDARD: 'equipment.attribute.standard',
  SAAS_CONCURRENT: 'user.concurrent.standard',
  SAAS_NOMINATIVE: 'user.nominative.standard',
};

export const ORACLE_TYPES = [
  METRIC_TYPES.ORACLE_NUP_STANDARD,
  METRIC_TYPES.ORACLE_PROCESSOR_STANDARD,
];

export const METRIC_DEPENDENCY_TYPES = {
  PROCESSOR_OR_NUP: 'processorOrNUP',
  ORACLE_NUP: 'oracleNUP',
  SAG_OR_IBM: 'sagOrIbm',
  ATTRIBUTE_COUNTER_OR_ATTRIBUTE_SUM_OR_EQUIPMENT_ATTRIBUTE:
    'attributeCounterOrAttributeSumOrEquipmentAttribute',
  INSTANCE_NUMBER: 'instanceNumber',
  STATIC_STANDARD: 'staticStandard',
  SAAS_CONCURRENT: 'concurrentUser',
  SAAS_NOMINATIVE: 'nominativeUser',
};

export const PAGINATION_DEFAULTS: PaginationDefaults = {
  currentPageNum: 1,
  pageSize: 50,
  sortOrder: TableSortOrder.ASC,
  length: null,
};

export const EDITOR_FORM_FIELDS = {
  EDITOR_TYPES: 'editorTypes',
  EDITOR_TYPES_GROUP: {
    PARTNER_MANAGER: 'partnerManager',
    PARTNER_MANAGER_GROUP: {
      ID: 'id',
      NAME: 'name',
      EMAIL: 'email',
    },
  },
};
export const COMMON_REGEX: CommonRegex = {
  DIGITS_WITH_NAV: new RegExp(
    `^[0-9]*$|Delete|Backspace|ArrowLeft|ArrowRight|ArrowDown|ArrowUp|Tab`
  ),
  ONLY_DIGITS: new RegExp('^[0-9]*$'),
  DIGITS_WITH_DECIMALS: new RegExp(`^(\\d+(\\.\\d+)?)$`),
};

export const IMPORT_FILE_SIZE: number = 13 * 1024 * 1000; // converting MB into bytes

export const MONTH_COLOR_SET: {
  January: string;
  February: string;
  March: string;
  April: string;
  May: string;
  June: string;
  July: string;
  August: string;
  September: string;
  October: string;
  November: string;
  December: string;
} = {
  January: '#ffbb00',
  February: '#ffbbcc',
  March: '#ffbb77',
  April: '#ffbb',
  May: '#ddbb',
  June: '#ccffee',
  July: '#bbee00',
  August: '#ccbb88',
  September: '#bbff',
  October: '#aabb99',
  November: '#bbaa11',
  December: '#33aa33',
};
export enum PRODUCT_CATALOG_TABS {
  EDITOR = 'PRODUCT_CATALOG_TAB_EDITORS',
  PRODUCT = 'PRODUCT_CATALOG_TAB_PRODUCTS',
  EDITOR_DETAIL = 'PRODUCT_CATALOG_TAB_EDITOR_DETAIL',
  PRODUCT_DETAIL = 'PRODUCT_CATALOG_TAB_PRODUCT_DETAIL',
}

export enum CRUD {
  CREATE = 'Create',
  READ = 'Read',
  UPDATE = 'Update',
  DELETE = 'Delete',
}

export const MENU_ROUTER_LINKS: MenuRouterLinks = {
  productCatalogManagement: '/optisam/pc/editors',
  acquiredRightsManagement: '/optisam/ar/list-acquired-rights',
  aggregationManagement: '/optisam/ag/list-aggregation',
  groupManagement: '/optisam/gr/groupMang',
  inventoryManagement: allowedScopes()
    ? '/optisam/dm/metadata'
    : '/optisam/dm/globaldata',
  metricsManagement: '/optisam/ma',
  obsolescenceManagement: '/optisam/om/define-obsolescence',
  scopesManagement: '/optisam/sm',
  usersManagement: '/optisam/gr/viewUsers',
  equipmentsManagement: '/optisam/eqm',
  simulatorsManagement: '/optisam/cm/simulation-configuration',
};

export const PRODUCT_RECOMMENDATION: string[] = [
  'RECOMMENDED',
  'AUTHORIZED',
  'BLACKLISTED',
];

export const OPEN_SOURCE_LIST: string[] = [
  '0-clause BSD License (0BSD)',
  '1-clause BSD License (BSD-1-Clause)',
  '2-clause BSD License (BSD-2-Clause)',
  '3-clause BSD License (BSD-3-Clause)',
  'Academic Free License 3.0 (AFL-3.0)',
  'Adaptive Public License (APL-1.0)',
  'Apache Software License 1.1 (Apache-1.1) (superseded)',
  'Apache License 2.0 (Apache-2.0)',
  'Apple Public Source License (APSL-2.0)',
  'Artistic license 1.0 (Artistic-1.0) (superseded)',
  'Artistic License 2.0 (Artistic-2.0)',
  'Attribution Assurance License (AAL)',
  'Boost Software License (BSL-1.0)',
  '3-clause BSD License',
  '2-clause BSD License',
  '1-clause BSD License',
  '0-clause BSD license',
  'BSD-3-Clause-LBNL',
  'BSD+Patent (BSD-2-Clause-Patent)',
  'CERN Open Hardware Licence Version 2 - Permissive',
  'CERN Open Hardware Licence Version 2 - Weakly Reciprocal',
  'CERN Open Hardware Licence Version 2 - Strongly Reciprocal',
  'CeCILL License 2.1 (CECILL-2.1)',
  'Common Development and Distribution License 1.0 (CDDL-1.0)',
  'Common Public Attribution License 1.0 (CPAL-1.0)',
  'Common Public License 1.0 (CPL-1.0) (superseded)',
  'Computer Associates Trusted Open Source License 1.1 (CATOSL-1.1)',
  'Cryptographic Autonomy License v.1.0 (CAL-1.0)',
  'CUA Office Public License Version 1.0 (CUA-OPL-1.0) (retired)',
  'Eclipse Public License 1.0 (EPL-1.0) (superseded)',
  'Eclipse Public License 2.0 (EPL-2.0)',
  'eCos License version 2.0 (eCos-2.0)',
  'Educational Community License, Version 1.0 (ECL-1.0) (superseded)',
  'Educational Community License, Version 2.0 (ECL-2.0)',
  'Eiffel Forum License V1.0 (EFL-1.0) (superseded)',
  'Eiffel Forum License V2.0 (EFL-2.0)',
  'Entessa Public License (Entessa)',
  'EU DataGrid Software License (EUDatagrid)',
  "European Union Public License 1.2 (EUPL-1.2) (links to every language's version on their site)",
  'Fair License (Fair)',
  'Frameworx License (Frameworx-1.0)',
  'Free Public License 1.0.0 (0BSD)',
  'GNU Affero General Public License version 3 (AGPL-3.0)',
  'GNU General Public License version 2 (GPL-2.0)',
  'GNU General Public License version 3 (GPL-3.0)',
  'GNU Lesser General Public License version 2.1 (LGPL-2.1)',
  'GNU Lesser General Public License version 3 (LGPL-3.0)',
  'Historical Permission Notice and Disclaimer (HPND)',
  'IBM Public License 1.0 (IPL-1.0)',
  'Intel Open Source License (Intel) (retired)',
  'IPA Font License (IPA)',
  'ISC License (ISC)',
  'Jabber Open Source License (retired)',
  'JAM License (Jam)',
  'LaTeX Project Public License 1.3c (LPPL-1.3c)',
  'Lawrence Berkeley National Labs BSD Variant License (BSD-3-Clause-LBNL)',
  'Licence Libre du Québec – Permissive (LiLiQ-P) version 1.1 (LiliQ-P)',
  'Licence Libre du Québec – Réciprocité (LiLiQ-R) version 1.1 (LiliQ-R)',
  'Licence Libre du Québec – Réciprocité forte (LiLiQ-R+) version 1.1 (LiliQ-R+)',
  `Lucent Public License ("Plan9"), version 1.0 (LPL-1.0) (superseded)`,
  'Lucent Public License Version 1.02 (LPL-1.02)',
  'Microsoft Public License (MS-PL)',
  'Microsoft Reciprocal License (MS-RL)',
  'MirOS Licence (MirOS)',
  'MIT License (MIT)',
  'MIT No Attribution License (MIT-0)',
  'MITRE Collaborative Virtual Workspace License (CVW) (retired)',
  'Motosoto License (Motosoto)',
  'Mozilla Public License 1.0 (MPL-1.0) (superseded)',
  'Mozilla Public License 1.1 (MPL-1.1) (superseded)',
  'Mozilla Public License 2.0 (MPL-2.0)',
  'Mulan Permissive Software License v2 (MulanPSL - 2.0)',
  'Multics License (Multics)',
  'NASA Open Source Agreement 1.3 (NASA-1.3)',
  'Naumen Public License (Naumen)',
  'Nethack General Public License (NGPL)',
  'Nokia Open Source License (Nokia)',
  'Non-Profit Open Software License 3.0 (NPOSL-3.0)',
  'NTP License (NTP)',
  'OCLC Research Public License 2.0 (OCLC-2.0)',
  'Open Group Test Suite License (OGTSL)',
  'Open Software License 1.0 (OSL-1.0) (superseded)',
  'Open Software License 2.1 (OSL-2.1) (superseded)',
  'Open Software License 3.0 (OSL-3.0)',
  'OpenLDAP Public License Version 2.8 (OLDAP-2.8)',
  'OSET Public License version 2.1',
  'PHP License 3.0 (PHP-3.0) (superseded)',
  'PHP License 3.01 (PHP-3.01)',
  'The PostgreSQL License (PostgreSQL)',
  'Python License (Python-2.0) (overall Python license)',
  'CNRI Python license (CNRI-Python) (CNRI portion of Python License)',
  'Q Public License (QPL-1.0)',
  'RealNetworks Public Source License V1.0 (RPSL-1.0)',
  'Reciprocal Public License, version 1.1 (RPL-1.1) (superseded)',
  'Reciprocal Public License 1.5 (RPL-1.5)',
  'Ricoh Source Code Public License (RSCPL)',
  'SIL Open Font License 1.1 (OFL-1.1)',
  'Simple Public License 2.0 (SimPL-2.0)',
  'Sleepycat License (Sleepycat)',
  'Sun Industry Standards Source License (SISSL) (retired)',
  'Sun Public License 1.0 (SPL-1.0)',
  'Sybase Open Watcom Public License 1.0 (Watcom-1.0)',
  'Universal Permissive License (UPL)',
  'University of Illinois/NCSA Open Source License (NCSA)',
  'Upstream Compatibility License v1.0',
  'Unicode Data Files and Software License',
  'The Unlicense',
  'Vovida Software License v. 1.0 (VSL-1.0)',
  'W3C License (W3C)',
  'wxWindows Library License (WXwindows)',
  'X.Net License (Xnet)',
  'Zero-Clause BSD (0BSD)',
  'Zope Public License 2.0 (ZPL-2.0) (superseded)',
  'Zope Public License 2.1 (ZPL-2.1)',
  'zlib/libpng license (Zlib)',
];

export const COLUMNS: ProductColumn[] = [
  { key: 'name', label: 'PRODUCT_CATALOG.PRODUCTS_LIST_COLUMNS.NAME' },
  {
    key: 'editorName',
    label: 'PRODUCT_CATALOG.PRODUCTS_LIST_COLUMNS.EDITOR',
  },

  {
    key: 'locationType',
    label: 'DEPLOYMENT_TYPE',
  },
  {
    key: 'licensing',
    label: 'Licensing',
  },
];

export const ALL_SELECTION_NAME: string = 'all-selection';
export enum ReportTypeNames {
  compliance = 'Compliance',
  productEquipments = 'ProductEquipments',
  expensesByEditor = 'Expenses by Editor',
}

export const MAX_CHARS_ENTITY_LABEL: number = 8;

export const REPORT_TRANSLATIONS = {
  product: 'Product',
  purchaseCost: 'PURCHASED_COST_BY_EDITOR',
  maintenanceCost: 'MAINTENANCE_COST_BY_EDITOR',
  editor: 'EDITOR_REPORT',
  product_name: 'Product',
  product_version: 'Version',
  user_name: 'Username',
  first_name: 'First Name',
  user_email: 'Email',
  profile: 'PROFILE',
  activation_date: 'ACTIVATION_DATE',
  aggregation_name: 'Aggregation Name',
  totalCost: 'TOTAL_COST',
  sku: "SKU",
  aggregationName: "AGGREGATION_NAME",
  metric: "METRIC_ONLY",
  computedLicenses: "COMPUTED_LICENSES",
  computationDetails: "COMPUTATION_DETAILS",
  acquiredLicenses: "ACQUIRED_LICENSES",
  'delta(licenses)': 'DELTA_LICENSES',
  'delta(cost)': "DELTA_COST",
  totalcost: "TOTAL_COST",
  avgunitprice: "AVERAGE_UNIT_PRICE",
  metaTranslation: {
    title: {
      reportType: "REPORT_META_REPORT_TYPE",
      scope: "REPORT_META_SCOPE",
      createdOn: "REPORT_META_CREATED_ON",
      createdBy: "REPORT_META_CREATED_BY",
      equipmentType: "REPORT_META_EQUIPMENT_TYPE",
      editor: "REPORT_META_EDITOR"
    },
    value: {
      'Expenses by Editor': "REPORT_META_EXPENSES_BY_EDITOR",
      ProductEquipments: "REPORT_META_PRODUCT_EQUIPMENTS",
      Compliance: "REPORT_META_COMPLIANCE",
      server: "SERVER",
      softpartition: "SOFT_PARTITION",
      vcenter: "VCENTER",
      cluster: "CLUSTER"
    }
  }
};

export enum ProductUserType {
  nominative = 'NOMINATIVE',
  concurrent = 'CONCURRENT',
}

export const CHART_COLORS = {
  totalCost: '#3dcbff',
  counterfeiting: '#ee4646',
  underUsage: '#b0e57c',
  acquiredLicense: '#d1d1f9',
  computedLicense: '#ffd670',
  expenditure: '#ff70a6',
  sharedLicense: "#354e82",
  receivedLicense: "#ec583a",
  saas: "#3376bd",
  onPremise: "#edae49"

}

export enum AdminLevel {
  admin = "ADMIN",
  superAdmin = "SUPER_ADMIN"
}


export const TREE_MAP_COLOR_RANGE: { from: number; to: number; color: string }[] = [
  { from: 0, to: 5, color: '#3B93A5' },
  { from: 6, to: 10, color: '#F7B844' },
  { from: 11, to: 15, color: '#DAA89B' },
  { from: 16, to: 20, color: '#9C8CB9' },
  { from: 21, to: 25, color: '#616247' },
  { from: 26, to: 30, color: '#F7E967' },
  { from: 31, to: 35, color: '#FF5733' },
  { from: 36, to: 40, color: '#00FFFF' },
  { from: 41, to: 45, color: '#FFC300' },
  { from: 46, to: 50, color: '#581845' },
  { from: 51, to: 55, color: '#900C3F' },
  { from: 56, to: 60, color: '#FF5733' },
  { from: 61, to: 65, color: '#00FFFF' },
  { from: 66, to: 70, color: '#FFC300' },
  { from: 71, to: 75, color: '#581845' },
  { from: 76, to: 80, color: '#900C3F' },
  { from: 81, to: 85, color: '#F7E967' },
  { from: 86, to: 90, color: '#FF5733' },
  { from: 91, to: 95, color: '#00FFFF' },
  { from: 96, to: 100, color: '#FFC300' },
]

export const TREE_MAP_COMMON_DATA_THRESHOLD: number = 1.5;
export const TREE_MAP_COMMON_MAX_DATA = 100;

export const EQUIPMENT_COLORS = {
  desktop: '#fcbf49',
  virtualMachines: '#2a9d8f',
  server: '#f765a3',
  cluster: '#a155b9',
  vcenter: '#165baa',
  softpartition: '#b4ff69'

}

