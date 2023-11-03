import { PRODUCT_CATALOG_TABS } from '@core/util/constants/constants';

export interface ProductCatalogTab {
  tabName: PRODUCT_CATALOG_TABS;
  link: string;
}

export interface MenuRouterLinks {
  productCatalogManagement: string;
  acquiredRightsManagement: string;
  aggregationManagement: string;
  groupManagement: string;
  inventoryManagement: string;
  metricsManagement: string;
  obsolescenceManagement: string;
  scopesManagement: string;
  usersManagement: string;
  equipmentsManagement: string;
  simulatorsManagement: string;
}

export interface ProductCatalogProductListParams {
  page_num: string | number;
  page_size: string | number;
  sort_by: string;
  sort_order: 'asc' | 'desc';
  'search_params.name.filteringkey'?: string;
  'search_params.editorName.filteringkey'?: string;
  'search_params.licensing.filteringkey'?: string;
  'search_params.locationType.filteringkey'?: string;
}

export interface ProductCatalogProductsListResponse {
  total_records: number;
  product: ProductCatalogProduct[];
}

export interface ProductCatalogProduct {
  id: string;
  editorID: string;
  name: string;
  metrics: string[];
  genearlInformation: string;
  contracttTips: string;
  locationType: string;
  licensing: string;
  openSource: ProductCatalogOpenSource;
  // closeSource: ProductCatalogCloseSource;
  version: ProductCatalogVersion[];
  recommendation: string;
  usefulLinks: string[];
  supportVendors: string[];
  createdOn: string;
  UpdatedOn: string;
  swidtagProduct: string;
}

export interface ProductCatalogCloseSource {
  isCloseSource: boolean;
  closeLicences: string[];
}

export interface ProductCatalogOpenSource {
  openLicences: string;
  openSourceType: OpenSourceType;
}

export interface ProductCatalogVersion {
  id: string;
  swidTagVersion: string;
  name: string;
  recommendation: string;
  endOfLife: string;
  endOfSupport: string;
}

export interface ProductCatalogEditorListParams {
  pageNum: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
}

export type ProductColumn = {
  key: string;
  label: string;
};

export interface ProductCatalogEditorListResponse {
  totalrecords: number;
  editors: ProductCatalogEditor[];
}

export interface ProductCatalogEditor {
  id: string;
  name: string;
  general_information: string;
  partner_managers: NameEmail[];
  audits: ProductCatalogAudit[];
  globalAccountManager: GlobalAccountManager[];
  vendors: ProductCatalogVendor[];
  created_on: string;
  updated_on: string;
  scopes: string[];
  country_code: string;
  address: string;
  groupContract: boolean;
  global_account_manager: NameEmail[];
  product_count: number;
  entities: string;
  sourcers: NameEmail[];
}

export interface GlobalAccountManager {
  email: string;
  name: string;
}
export interface Sourcers {
  email: string;
  name: string;
}
export interface ProductCatalogAudit {
  entity: string;
  date: string;
}

export interface NameEmail {
  name: string;
  email: string;
}

export interface ProductCatalogVendor {
  name: string;
}

//TODO: change the naming convention of the Editor;
export interface Editor {
  name: string;
  genearlInformation: string;
  vendors: Vendor[];
  partner_managers: PartnerManager[];
  audits: Audit[];
}

export interface Audit {
  entity: string;
  date: string;
}

export interface PartnerManager {
  email: string;
  name: string;
}

export interface Vendor {
  name: string;
}

export enum OpenSourceType {
  none = 'NONE',
  commercial = 'COMMERCIAL',
  community = 'COMMUNITY',
  both = 'BOTH',
}

export enum LicenseType {
  OPENSOURCE = 'OPENSOURCE',
  CLOSEDSOURCE = 'CLOSEDSOURCE',
  NONE = 'NONE',
  BOTH = 'BOTH',
}

export interface LandingEditorParams {
  pageNum: number;
  sortOrder: 'asc' | 'desc';
  sortBy: string;
  pageSize: number;
  'search_params.name.filteringkey'?: string;
  'search_params.group_contract.filteringkey'?: string;
  'search_params.entities.filteringkey'?: string;
  'search_params.countryCodes.filteringkey'?: string;
  'search_params.audityears.filteringkey'?: string;
}

export interface LandingProductParams {
  page_num: number;
  sort_order: 'asc' | 'desc';
  sort_by: string;
  page_size: number;
  'search_params.name.filteringkey'?: string;
  'search_params.deploymentType.filteringkey'?: string;
  'search_params.vendor.filteringkey'?: string;
  'search_params.recommendation.filteringkey'?: string;
  'search_params.licensing.filteringkey'?: string;
  'search_params.entities.filteringkey'?: string;
}

export interface VersionHeader {
  key: string;
  header: string;
  translation: string;
}
export interface PartnerManagerHeader extends VersionHeader { }

export interface AuditHeader extends VersionHeader { }

export interface EditorNamesResponse {
  editors: EditorName[];
}

export interface EditorName {
  id: string;
  name: string;
}

export interface ProductCatalogManagementEditorListParams
  extends ProductCatalogEditorListParams {
  'search_params.name.filteringkey'?: string;
  'search_params.group_contract.filteringkey'?: boolean;
}

export interface ProductCatalogEditProductData extends ProductCatalogProduct {
  productSwidTag?: string;
}

export interface ProductVersionMapping {
  product_name: string;
  product_version: string;
}

export interface ProductFilters {
  search: string;
  filters: ProductFormFilter;
}

export interface EditorFilters {
  search: string;
  filters: EditorFormFilter;
}

export interface EditorFormFilter {
  groupContract: string[];
  entities: string[];
  audit: string[];
  country: string[];
}
export interface ProductFormFilter {
  deploymentType: string[];
  vendor: string[];
  recommendation: string[];
  licensing: string[];
  entities: string[];
}

export interface ProductFiltersResponse {
  deploymentType: FilterType;
  vendors: FilterType;
  recommendation: FilterType;
  licensing: FilterType;
  entities: FilterType;
}

export interface EditorFiltersResponse {
  groupContract: FilterType;
  year: FilterType;
  countryCode: FilterType;
  entities: FilterType;
}

export interface FilterType {
  total_count: number;
  filter: Filter[];
}

export interface Filter {
  name: string;
  count: number;
}

export interface CountryFilter {
  name: {
    countryCode: string;
    countryName: string;
  };
  count: number;
}

export interface ProductCatalogProductListResponse {
  total_records: number;
  product: ProductCatalogProductSet[];
}

export interface ProductCatalogProductSet {
  id: string;
  editorID: string;
  name: string;
  metrics: string[];
  genearlInformation: string;
  contracttTips: string;
  locationType: string;
  openSource: OpenSource;
  closeSource: CloseSource;
  version: Version[];
  scopes: string[];
  licensing: string;
  recommendation: string;
  usefulLinks: string[];
  supportVendors: string[];
  createdOn: string;
  UpdatedOn: string;
  productSwidTag: string;
  editorName: string;
}

export interface CloseSource {
  isCloseSource: boolean;
  closeLicences: string[];
}

export interface OpenSource {
  isOpenSource: boolean;
  openSourceType: string;
  openLicences: string;
}

export interface Version {
  id: string;
  swidTagVersion: string;
  name: string;
  recommendation: string;
  endOfLife: string;
  endOfSupport: string;
}

export interface TabsFlow {
  tabName: PRODUCT_CATALOG_TABS;
  from: PRODUCT_CATALOG_TABS;
  alias?: string;
  data?: any;
}

export interface TrimTextRangeInput {
  min: {
    char: number;
    minWidth: number;
  };
  max: {
    char: number;
    maxWidth: number;
  };
  currentWidth: number;
}

export enum RecommendationTypes {
  authorized = 'AUTHORIZED',
  blackListed = 'BLACKLISTED',
  recommended = 'RECOMMENDED',
}

export interface ProductCatalogTabs { title: PRODUCT_CATALOG_TABS; alias: string; }




export interface PCDashboardOverviewResponse {
  total_editor: number;
  total_product: number;
  total_opensource_product: number;
  total_saas_product: number;
}
