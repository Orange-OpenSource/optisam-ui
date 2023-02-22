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
  DIGITS_WITH_NAV:
    '^[0-9]*$|Backspace|ArrowLeft|ArrowRight|ArrowDown|ArrowUp|Tab',
  ONLY_DIGITS: '^[0-9]*$',
};

export const IMPORT_FILE_SIZE: number = 13 * 1024 * 1000; // converting MB into bytes

export enum PRODUCT_CATALOG_TABS {
  EDITOR = 'Editors',
  PRODUCT = 'Products',
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
    label: 'PRODUCT_CATALOG.PRODUCTS_LIST_COLUMNS.LOCATION_TYPE',
  },
  {
    key: 'licensing',
    label: 'Licensing',
  },
  
];
