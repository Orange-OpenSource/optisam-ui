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
  openSource: ProductCatalogOpenSource;
  closeSource: ProductCatalogCloseSource;
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
  isOpenSource: boolean;
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
  partner_managers: ProductCatalogPartnerManager[];
  audits: ProductCatalogAudit[];
  vendors: ProductCatalogVendor[];
  created_on: string;
  updated_on: string;
  scopes: string[];
}

export interface ProductCatalogAudit {
  entity: string;
  date: string;
}

export interface ProductCatalogPartnerManager {
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

export interface LandingEditorParams {
  pageNum: number;
  sortOrder: 'asc' | 'desc';
  sortBy: string;
  pageSize: number;
}

export interface VersionHeader {
  key: string;
  header: string;
  translation: string;
}
export interface PartnerManagerHeader extends VersionHeader {}

export interface AuditHeader extends VersionHeader {}

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
}

export interface ProductCatalogEditProductData extends ProductCatalogProduct {
  productSwidTag?: string;
}

export interface ProductVersionMapping {
  product_name: string;
  product_version: string;
}
