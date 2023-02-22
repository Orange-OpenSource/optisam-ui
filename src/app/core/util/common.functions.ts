import { PROHIBIT_SCOPES } from './constants/constants';
import { format } from 'date-fns';
import { throwError } from 'rxjs';
import { ProductCatalogProduct } from '@core/modals';

export function isSpecificScopeType(): boolean {
  const currentScope: string = localStorage.getItem('scopeType') || '';
  const prohibitedScopes: Array<string> = PROHIBIT_SCOPES || []; // prohibition list

  if (!prohibitedScopes.length) return true; // Blank array([]) means no prohibition is set and we can pass true.
  return !prohibitedScopes.includes(currentScope); // If the current scope is present in the prohibition list then we can return false.
}

export function _dateUTC(date: Date) {
  return new Date(
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
  );
}

export function ISOFormat(date: Date | string): string {
  if (!date) return '';
  date = typeof date === 'string' ? new Date(date) : date;
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
}

export const fixErrorResponse = (e) =>
  e?.error ? throwError(e.error) : throwError(e);

export function bytesToMB(number: number): number {
  return Number((number / 1024 / 1000).toFixed(2));
}

export function createPostData(data: any): ProductCatalogProduct {
  console.log(data);
  return {
    id: '',
    editorID: data.productEditor,
    name: data.productName,
    metrics:
      data.productMetric?.constructor.name === 'Array'
        ? data.productMetric
        : [data.productMetric],
    genearlInformation: data.productGeneralInformation,
    contracttTips: data.productContractTips,
    locationType: this.currentLocationType,
    openSource: {
      isOpenSource: data?.productOpenSource?.isOpenSource,
      openLicences: data?.productOpenSource?.openLicenses || '',
      openSourceType: data?.productOpenSource?.openSourceType,
    },
    closeSource: {
      isCloseSource: data?.productCloseSource?.isCloseSource,
      closeLicences: data?.productCloseSource?.closeLicenses.map(
        (c) => c?.closeSourceName
      ),
    },
    version: data?.productVersions.map((version) => ({
      id: version?.versionId || '',
      swidtagVersion: version?.swidTag || '',
      name: version?.versionName,
      recommendation: version?.versionRecommendation,
      endOfLife: !/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(
        version?.versionEOL
      )
        ? version?.versionEOL
        : new Date(version?.versionEOL)?.toISOString(),
      endOfSupport: !/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(
        version?.versionEOS
      )
        ? version?.versionEOS
        : new Date(version?.versionEOS)?.toISOString(),
    })),
    recommendation: data?.productRecommendation, //TODO: check if recommendation value is set during creation of  new product.
    usefulLinks: data?.productUsefulLinks?.map((link) => link?.link),
    supportVendors: data?.productSupportVendor?.map(
      (vendor) => vendor?.supportVendorName
    ),
    createdOn: new Date().toISOString(),
    UpdatedOn: new Date().toISOString(),
    swidtagProduct: data?.swidTag,
  };
}
