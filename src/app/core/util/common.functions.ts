import { PROHIBIT_SCOPES } from './constants/constants';
import { format } from 'date-fns';
import { throwError, Observable } from 'rxjs';
import { ChartTypeEffective, ChartTypeSoft, ProductCatalogProduct } from '@core/modals';
import { FormArray, FormGroup, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Options } from 'chartjs-plugin-datalabels/types/options';
import { HttpParams } from '@angular/common/http';
import { NoEncodingHttpParameterCodec } from './NoEncodingHttpParameterCodec';
import { ChartType } from 'chart.js';

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

export const fixedErrorResponse = (e: any): Observable<never> =>
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


export function pieChartLabelCallback(suffix: string = '') {
  return (tooltipItem, data): string => {
    const allData: number[] | Chart.ChartPoint[] = data.datasets[0].data;
    const index: number = tooltipItem.index;
    const label: string | string[] = data.labels[index];
    let value: number = Number((allData[index] as number).toFixed(2));
    value = Math.floor(value) == value ? Math.floor(value) : value;
    return `  ${label}: ${value.toLocaleString()}${suffix}`;
  }
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


export function resetLegends(cart: Chart): void {
  const dataset = cart.data.datasets[0];
  try {
    const firstKey = Object.keys(dataset?.['_meta'])[0];
    dataset?.['_meta'][firstKey].data
      .map(d => {
        d.hidden = false;
        return d;
      });

  } catch (error) {
    console.log(error);
  }
}

export function convertToInternationalCurrencySystem(labelValue): string | number {

  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e+9

    ? (Math.floor((Math.abs(Number(labelValue)) / 1.0e+9)*100)/100).toLocaleString() + " B"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6

      ? (Math.floor((Math.abs(Number(labelValue)) / 1.0e+6) * 100) / 100).toLocaleString() + " M"
      // Three Zeroes for Thousands
      : Math.abs(Number(labelValue)) >= 1.0e+3

        ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + " K"

        : Math.abs(Number(labelValue));

}


export function getParams(input: any, encoding: boolean = true): HttpParams {
  /**
   * NoEncodingHttpParameterCodec is a custom class that overwrite the default 
   * encoder class HttpParameterCodec. It is doing so by overwriting encodeValue 
   * method with no encoding.
   */
  const arg = !encoding ? { encoder: new NoEncodingHttpParameterCodec() } : {}
  let params = new HttpParams(arg);
  for (let key in input) params = params.set(key, input[key]);
  return params;
}


export function frenchNumber(value: number | string, decimalCount: number = 2): string | number {
  if (!value) return value;
  let number: number;
  if (value.constructor.name === 'String') {
    number = Number(value);
    if (isNaN(number)) return value;
    return numberToFrenchNumber(number, decimalCount);
  }
  return numberToFrenchNumber(value, decimalCount);
}


function numberToFrenchNumber(num: number | string, DECIMALS: number = 2): string {
  const numberArray: string[] = String(num).split('.');
  let decimals: string = numberArray.length === 1 ? '' : numberArray[1].slice(0, numberArray[1].length >= DECIMALS ? DECIMALS : 1);
  let zeroFillers: string = decimals.length ? getExtraDecimalZeroes(DECIMALS - decimals.length) : '';
  let decimalsWithZeroFillers: string = decimals + zeroFillers;
  return Number(numberArray[0]).toLocaleString() + (decimalsWithZeroFillers ? `.` + decimalsWithZeroFillers : '');
}

function getExtraDecimalZeroes(count: number): string {
  let zeroes: string = '';
  for (let i = 0; i < count; i++) zeroes += '0';
  return zeroes;
}


export function fixMapSpaces(chart, chartType: ChartTypeSoft | ChartTypeEffective): void {

  const chartBlock: HTMLDivElement = chart?.el?.closest('.chart-block--map');
  if (chartBlock) {
    try {
      const chartBlockWidth: number = chartBlock.getBoundingClientRect().width;
      const errorMargin = 2;
      const treeMapSeriesWidth: number = chartBlock.querySelector('.apexcharts-treemap-series')?.getBoundingClientRect().width;
      const margin = chartBlockWidth - treeMapSeriesWidth;
      if (chartBlockWidth && treeMapSeriesWidth && Math.abs(margin) > errorMargin) {
        this.resetHeight(margin, chartType)
      }
    } catch (e) {
      console.log(e);
    }
  }
}


export function chopValue(value: number, decimal?: number): number {
  decimal ??= 2;
  let base: number = 1;
  for (let i = 0; i < Math.floor(Math.abs(decimal)); i++)
    base *= 10;
  if (!decimal) return value;
  return parseInt((value * base).toString()) / base;
}

export function metricCompare(metric1: any, metric2: any): boolean {
  return metric1.name === metric2.name
}