import { PROHIBIT_SCOPES } from './constants/constants';
import { format } from 'date-fns';
import { throwError, Observable } from 'rxjs';
import { ProductCatalogProduct } from '@core/modals';
import { FormArray, FormGroup, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Options } from 'chartjs-plugin-datalabels/types/options';

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

export const fixErrorResponse = (e: any): Observable<never> =>
  e?.error ? throwError(e.error) : throwError(e);

export function bytesToMB(number: number): number {
  return Number((number / 1024 / 1000).toFixed(2));
}

export const _sString = (value: string) =>
  value.trim().replace(/\s+/, '').toLowerCase();

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
    locationType: data.productLocation.locationType,
    licensing: data?.licensing,
    openSource: {
      openLicences: data?.OpenSource?.openLicenses || '',
      openSourceType: data?.OpenSource?.openLicensesType,
    },
    // closeSource: {
    //   isCloseSource: data?.productCloseSource?.isCloseSource,
    //   closeLicences: data?.productCloseSource?.closeLicenses.map(
    //     (c) => c?.closeSourceName
    //   ),
    // },
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

export const updateValidity = (group: FormGroup | FormArray) => {
  const name = group?.constructor?.name;
  if (name === 'FormGroup') {
    const controls = group?.controls;
    for (let controlName in controls) {
      const target = group.get(controlName);
      switch (target.constructor.name) {
        case 'FormControl':
          (target as FormControl).markAsDirty();
          (target as FormControl).markAsTouched();
          break;
        case 'FormGroup':
          updateValidity(target as FormGroup);
          break;
        case 'FormArray':
          updateValidity(target as FormArray);
          break;
      }
    }
  }

  if (name === 'FormArray') {
    (group as FormArray).controls.forEach((control) => {
      switch (control?.constructor?.name) {
        case 'FormControl':
          (control as FormControl).markAsDirty();
          (control as FormControl).markAsTouched();
          break;
        case 'FormGroup':
          updateValidity(control as FormGroup);
          break;
        case 'FormArray':
          updateValidity(control as FormArray);
          break;
      }
    });
  }
};


export function supportNumberMax(number: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const supportNumbers: string = control.value;
    const supportNumberArray = supportNumbers?.split(',') || [];
    const isValid: boolean = supportNumberArray.every((num: string) => num.length <= number);
    if (!isValid) {
      return <ValidationErrors>{
        maxSupportLength: {
          requiredLength: number,
          index: supportNumberArray.findIndex((num: string) => (num.length > number)) + 1
        }
      }
    }
    return null;
  }
}


export function pieChartLabelCallback(tooltipItem, data): string {
  const allData: number[] | Chart.ChartPoint[] = data.datasets[0].data;
  const index: number = tooltipItem.index;
  const label: string | string[] = data.labels[index];
  let value: number = Number((allData[index] as number).toFixed(2));
  value = Math.floor(value) == value ? Math.floor(value) : value;
  return `  ${label}: ${value.toLocaleString()}`;
}


export function pieChartDataLabelFormatter(value, context): string {
  const data: number[] = (context?.dataset?.data || []) as Array<number>;
  let totalValue: number = 0;
  for (let val of data) totalValue += val;
  let percentage: number = Number(((Number(data[context.dataIndex]) / totalValue) * 100).toFixed(2));
  percentage = Math.floor(percentage) == percentage ? Math.floor(percentage) : percentage;
  return percentage + '%';
}


export function commonPieChartDataLabelConfig(): Options {
  return {
    anchor: 'center',
    align: 'top',
    color: "#fff",
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 5,
    formatter: pieChartDataLabelFormatter
  }
}
