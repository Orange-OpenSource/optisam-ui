import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Products,
  AggregationDetailsAquiredRights,
  AggregationDetailsInformation,
  AggregationDetailsOptions,
  ProductAggregationApplications,
  MetricSimulationResponse,
  MetricSimulationRequest,
  AggregationProductsInformation,
  MetricComputationDetails,
  AggregationComputationDetails,
} from './product';
import { Applications } from './application';
import {
  AcquiredRightsAggregation,
  AggregationEditorParams,
  AggregationProductsParams,
  AcquiredRightAggregationBody,
} from '../../modules/home/pages/acquiredrights/acquired-rights.modal';
import {
  AcquiredRightAggregationQuery,
  AcquiredRightsAggregationParams,
  AggregatedAcquiredRights,
  AggregationGetResponse,
  CreateAggregationPlayload,
  ErrorResponse,
  GetAggregationParams,
  SuccessResponse,
} from '@core/modals';
import { CommonService } from './common.service';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { delay, catchError } from 'rxjs/operators';
import {
  AcquiredRights,
  AcquiredRightsIndividualParams,
  AcquiredRightsResponse,
} from '@core/modals/acquired.rights.modal';

export interface CommonURL {
  acquiredRightAggregationAdmin: string;
  AggregationAcquiredRights: string;
  AcquiredRights: string;
  aggregation: string;
  aggregationEditor: string;
  aggregatedAcquiredRights: string;
}

@Injectable()
export class ProductService {
  apiUrl = environment.API_PRODUCT_URL;
  apiLicenseUrl = environment.API_URL;
  apiApplicationUrl = environment.API_APPLICATION_URL;
  apiSimulationUrl = environment.API_CONFIG_URL;
  defaultHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  private aggregationData: BehaviorSubject<any> = new BehaviorSubject<any>({});

  private URLs: CommonURL = {
    acquiredRightAggregationAdmin: `${this.apiUrl}/product/aggregated_acqrights`,
    AggregationAcquiredRights: `${this.apiUrl}/product/aggregated_acqrights`,
    aggregatedAcquiredRights: `${this.apiUrl}/product/aggregatedrights`,
    AcquiredRights: `${this.apiUrl}/product/acqrights`,
    aggregation: `${this.apiUrl}/product/aggregations`,
    aggregationEditor: `${this.apiUrl}/product/aggregations/editors`,
  };

  constructor(private http: HttpClient, private cs: CommonService) {}

  getAggregationData(): Observable<any> {
    return this.aggregationData.asObservable();
  }

  setAggregationData(data: any): void {
    this.aggregationData.next(data);
  }

  getProducts(pageSize, length): Observable<Products[]> {
    const url =
      this.apiUrl +
      '/products?page_num=' +
      length +
      '&page_size=' +
      pageSize +
      '&sort_by=name&sort_order=asc' +
      '&scopes=' +
      localStorage.getItem('scope');

    return this.http.get<Products[]>(url);
  }
  getMoreDetails(swidTag): Observable<Products[]> {
    return this.http.get<any>(
      this.apiUrl +
        '/product/' +
        swidTag +
        '?scope=' +
        localStorage.getItem('scope')
    );
  }
  getOptionsDetails(swidTag): Observable<any> {
    return this.http.get<any>(
      this.apiUrl +
        '/product/' +
        swidTag +
        '/options?scope=' +
        localStorage.getItem('scope')
    );
  }
  getAcquiredRightDetails(
    swidTag,
    scope: string,
    appID?: string
  ): Observable<any> {
    if (appID && appID != null) {
      return this.http.get<any>(
        this.apiLicenseUrl +
          '/license/applications/' +
          appID +
          '/products/' +
          swidTag +
          '?scope=' +
          localStorage.getItem('scope')
      );
    } else {
      return this.http.get<any>(
        this.apiLicenseUrl +
          '/license/product/' +
          swidTag +
          '/acquiredrights?scope=' +
          (scope ? scope : localStorage.getItem('scope'))
      );
    }
  }
  filteredData(
    length,
    pageSize,
    sort_by,
    sort_order,
    filteringkey1,
    filteringkey2,
    filteringkey3
  ): Observable<Products[]> {
    let filteringCondition = '';
    if (filteringkey1 !== '' && filteringkey1 !== undefined) {
      filteringCondition =
        filteringCondition +
        '&search_params.swidTag.filteringkey=' +
        encodeURIComponent(filteringkey1);
    }

    if (filteringkey2 !== '' && filteringkey2 !== undefined) {
      filteringCondition =
        filteringCondition +
        '&search_params.name.filteringkey=' +
        encodeURIComponent(filteringkey2);
    }
    if (filteringkey3 !== '' && filteringkey3 !== undefined) {
      filteringCondition =
        filteringCondition +
        '&search_params.editor.filteringkey=' +
        filteringkey3;
    }
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url =
      this.apiUrl +
      '/products?page_num=' +
      length +
      '&page_size=' +
      pageSize +
      '&sort_by=' +
      sort_by +
      '&sort_order=' +
      sort_order +
      '&scopes=' +
      localStorage.getItem('scope') +
      filteringCondition;
    return this.http.get<Products[]>(url);
  }
  getprodApplications(
    swidTag,
    pageSize,
    length,
    sort_order,
    sort_by
  ): Observable<Applications[]> {
    const url =
      this.apiApplicationUrl +
      '/applications?page_num=' +
      length +
      '&page_size=' +
      pageSize +
      '&sort_by=' +
      sort_by +
      '&sort_order=' +
      sort_order +
      '&scopes=' +
      localStorage.getItem('scope') +
      '&search_params.product_id.filteringkey=' +
      encodeURIComponent(swidTag);
    return this.http.get<Applications[]>(url);
  }
  getprodInstances(
    swidTag,
    app_id,
    pageSize,
    length
  ): Observable<Applications[]> {
    let url;
    // For Products->Application->Instance
    if (swidTag && swidTag != null) {
      url =
        this.apiApplicationUrl +
        '/application/instances' +
        '?page_num=' +
        length +
        '&page_size=' +
        pageSize +
        '&sort_by=instance_id&sort_order=asc' +
        '&scopes=' +
        localStorage.getItem('scope') +
        '&search_params.product_id.filter_type=1&search_params.product_id.filteringkey=' +
        encodeURIComponent(swidTag) +
        '&search_params.application_id.filter_type=1&search_params.application_id.filteringkey=' +
        app_id;
    }
    // For Application->Instances
    else {
      url =
        this.apiApplicationUrl +
        '/application/instances' +
        '?page_num=' +
        length +
        '&page_size=' +
        pageSize +
        '&sort_by=instance_id&sort_order=asc' +
        '&scopes=' +
        localStorage.getItem('scope') +
        '&search_params.application_id.filter_type=1&search_params.application_id.filteringkey=' +
        app_id;
    }
    return this.http.get<Applications[]>(url);
  }
  prodAplfilteredData(
    swidTag,
    length,
    pageSize,
    sort_by,
    sort_order,
    filteringkey1,
    filteringkey2
  ): Observable<Applications[]> {
    let filteringCondition = '';

    if (filteringkey1 !== '' && filteringkey1 !== undefined) {
      filteringCondition =
        filteringCondition +
        '&search_params.name.filteringkey=' +
        encodeURIComponent(filteringkey1);
    }

    if (filteringkey2 !== '' && filteringkey2 !== undefined) {
      filteringCondition =
        filteringCondition +
        '&search_params.owner.filteringkey=' +
        encodeURIComponent(filteringkey2);
    }
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url =
      this.apiApplicationUrl +
      '/applications?page_num=' +
      length +
      '&page_size=' +
      pageSize +
      '&sort_by=' +
      sort_by +
      '&sort_order=' +
      sort_order +
      '&scopes=' +
      localStorage.getItem('scope') +
      filteringCondition +
      '&search_params.product_id.filteringkey=' +
      encodeURIComponent(swidTag);
    return this.http.get<Applications[]>(url);
  }
  getInstancesSort(
    swidTag,
    app_id,
    pageSize,
    length,
    sort_by,
    sort_order
  ): Observable<Applications[]> {
    if (sort_order === '') {
      sort_order = 'asc';
    }
    let url;
    // For Products->Application->Instance
    if (swidTag && swidTag != null) {
      url =
        this.apiApplicationUrl +
        '/application/instances' +
        '?page_num=' +
        length +
        '&page_size=' +
        pageSize +
        '&sort_by=' +
        sort_by +
        '&sort_order=' +
        sort_order +
        '&scopes=' +
        localStorage.getItem('scope') +
        '&search_params.product_id.filter_type=1&search_params.product_id.filteringkey=' +
        encodeURIComponent(swidTag) +
        '&search_params.application_id.filter_type=1&search_params.application_id.filteringkey=' +
        app_id;
    }
    // For Application->Instances
    else {
      url =
        this.apiApplicationUrl +
        '/application/instances' +
        '?page_num=' +
        length +
        '&page_size=' +
        pageSize +
        '&sort_by=' +
        sort_by +
        '&sort_order=' +
        sort_order +
        '&scopes=' +
        localStorage.getItem('scope') +
        '&search_params.application_id.filter_type=1&search_params.application_id.filteringkey=' +
        app_id;
    }
    return this.http.get<Applications[]>(url);
  }

  getAggregationProducts(query: string): Observable<any> {
    const url =
      this.apiUrl +
      '/product/aggregation/view' +
      query +
      '&scopes=' +
      localStorage.getItem('scope');
    return this.http.get<any>(url);
  }

  getAggregationOptions(
    aggregationID: string
  ): Observable<AggregationDetailsOptions> {
    const url =
      this.apiUrl +
      '/product/aggregations/productview/' +
      aggregationID +
      '/options' +
      '?scopes=' +
      localStorage.getItem('scope');
    return this.http.get<AggregationDetailsOptions>(url);
  }

  getAggregationAquiredRights(
    aggregationName: string
  ): Observable<AggregationDetailsAquiredRights> {
    const url =
      this.apiLicenseUrl +
      '/license/aggregation/' +
      encodeURIComponent(aggregationName) +
      '/acquiredrights?scope=' +
      localStorage.getItem('scope');
    return this.http.get<AggregationDetailsAquiredRights>(url);
  }

  getAggregationInfoDetails(
    aggregationID: string
  ): Observable<AggregationDetailsInformation> {
    const url =
      this.apiUrl +
      '/product/aggregations/' +
      aggregationID +
      '/details' +
      '?scope=' +
      localStorage.getItem('scope');
    return this.http.get<AggregationDetailsInformation>(url);
  }

  getAggregationProductDetails(
    aggname
  ): Observable<AggregationProductsInformation> {
    const url =
      this.apiUrl +
      '/product/expand/aggregation_products' +
      '?scope=' +
      localStorage.getItem('scope') +
      '&aggregation_name=' +
      aggname;
    return this.http.get<AggregationProductsInformation>(url);
  }

  getComputationDetails(swidTag, sku): Observable<MetricComputationDetails> {
    const url =
      this.apiLicenseUrl +
      '/license/computationdetails' +
      '?sku=' +
      sku +
      '&swid_tag=' +
      swidTag +
      '&scope=' +
      localStorage.getItem('scope');
    return this.http.get<MetricComputationDetails>(url);
  }

  getAggregationComputationDetails(
    aggregation_name: string,
    sku: string
  ): Observable<AggregationComputationDetails> {
    const url =
      this.apiLicenseUrl +
      '/license/computationdetails' +
      '?sku=' +
      sku +
      '&aggName=' +
      aggregation_name +
      '&scope=' +
      localStorage.getItem('scope');
    return this.http.get<AggregationComputationDetails>(url);
  }

  getProductAggregationApplications(
    swidTags: string[],
    query: string
  ): Observable<ProductAggregationApplications> {
    let url =
      this.apiApplicationUrl +
      '/applications' +
      query +
      '&scopes=' +
      localStorage.getItem('scope');
    for (let i = 0; i < swidTags.length; i++) {
      url +=
        '&search_params.product_id.filteringkey_multiple=' +
        encodeURIComponent(swidTags[i]);
    }
    return this.http.get<ProductAggregationApplications>(url);
  }

  metricSimulation(
    body: MetricSimulationRequest
  ): Observable<MetricSimulationResponse> {
    const url = this.apiSimulationUrl + '/simulation/metric';
    return this.http.post<MetricSimulationResponse>(url, body);
  }

  getEditorList(query: any) {
    const url = this.apiUrl + '/product/aggregations/editors' + query;
    return this.http.get<any>(url);
  }

  getDashboardEditorList(query: any) {
    const url = this.apiUrl + '/product/editors' + query;
    return this.http.get<any>(url);
  }
  getDownloadFile(sku) {
    const url =
      this.apiUrl +
      '/product/acqright/' +
      sku +
      '/file' +
      '?scope=' +
      localStorage.getItem('scope');
    return this.http.get<any>(url);
  }
  getAggregationDownloadFile(sku) {
    const url =
      this.apiUrl +
      '/product/aggregatedrights/' +
      sku +
      '/file' +
      '?scope=' +
      localStorage.getItem('scope');
    return this.http.get<any>(url);
  }

  getProductList(query: any) {
    const url = this.apiUrl + '/product/editors/products' + query;
    return this.http.get<any>(url);
  }

  getSimulationRights(query: any) {
    const url =
      this.apiUrl +
      '/product/simulation/' +
      query +
      '/rights' +
      '?scope=' +
      localStorage.getItem('scope') +
      '&editor=' +
      query;
    return this.http.get<any>(url);
  }

  // Aggregation APIs
  getEditorListAggr(
    scope: any
  ): Observable<{ editor: string[] } | ErrorResponse> {
    let params = new HttpParams().set('scope', scope);
    return this.http.get<{ editor: string[] } | ErrorResponse>(
      this.URLs.aggregationEditor,
      {
        headers: this.defaultHeaders,
        params,
      }
    );
  }

  getMetricListAggr(scope?: any) {
    let httpParams = new HttpParams().set(
      'scope',
      scope ? scope : localStorage.getItem('scope')
    );
    const url = this.apiUrl + '/product/aggregations/metrics';
    return this.http.get<any>(url, {
      params: httpParams,
      headers: this.defaultHeaders,
    });
  }

  getProductListAggr(params: AggregationProductsParams) {
    const url = this.apiUrl + '/product/aggregations/products';
    let httpParams: HttpParams = this.generateParams(params);
    return this.http.get<any>(url, {
      params: httpParams,
      headers: this.defaultHeaders,
    });
  }

  private generateParams(params): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((k) => {
      httpParams = httpParams.set(k, params[k]);
    });
    return httpParams;
  }

  getProductsEditorList(params: AggregationEditorParams): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((k) => {
      httpParams = httpParams.set(k, params[k]);
    });
    const url = this.apiUrl + '/product/aggregations/editors';
    return this.http.get<any>(url, {
      params: httpParams,
      headers: this.defaultHeaders,
    });
  }

  saveAggregation(
    data: CreateAggregationPlayload
  ): Observable<ErrorResponse | SuccessResponse> {
    return this.http
      .post<ErrorResponse | SuccessResponse>(this.URLs.aggregation, data, {
        headers: this.defaultHeaders,
      })
      .pipe(
        catchError((e) => {
          return e?.error ? throwError(e.error) : throwError(e);
        })
      );
  }

  getAggregations(
    paramsObj: GetAggregationParams
  ): Observable<ErrorResponse | AggregationGetResponse> {
    let params = new HttpParams();
    for (const key in paramsObj) params = params.set(key, paramsObj[key]);

    return this.http
      .get<ErrorResponse | AggregationGetResponse>(this.URLs.aggregation, {
        params,
      })
      .pipe(
        /*********** 
        Below line code is a fallback for if we are getting the 
        HttpErrorResponse instead of custom "ErrorResponse" 
        ***********/
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getAcqRightsAggregations(
    paramsObj: AcquiredRightsAggregationParams
  ): Observable<ErrorResponse | AggregationGetResponse> {
    let params = new HttpParams();
    for (const key in paramsObj) params = params.set(key, paramsObj[key]);

    return this.http
      .get<ErrorResponse | AggregationGetResponse>(
        this.URLs.AggregationAcquiredRights,
        {
          params,
        }
      )
      .pipe(
        /*********** 
          Below line code is a fallback for if we are getting the 
          HttpErrorResponse instead of custom "ErrorResponse" 
          ***********/
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  deleteAggregation(id: string) {
    const url =
      this.apiUrl +
      '/product/aggregations/' +
      id +
      '?scope=' +
      localStorage.getItem('scope');
    return this.http.delete<any>(url, { headers: this.defaultHeaders });
  }

  deleteLicensedAggregation(sku: string) {
    const url =
      this.apiUrl +
      '/product/aggregatedrights/' +
      sku +
      '?scope=' +
      localStorage.getItem('scope');
    return this.http.delete<any>(url, { headers: this.defaultHeaders });
  }
  updateAggregation(name: string, data: any) {
    const url = this.apiUrl + '/product/aggregations/' + name;
    return this.http.put<any>(url, data, { headers: this.defaultHeaders });
  }

  // Acquired Rights

  getAcquiredrights(pageSize, length, sortBy, sortOrder) {
    const url =
      this.apiUrl +
      '/product/acqrights?page_num=' +
      length +
      '&page_size=' +
      pageSize +
      '&sort_by=' +
      sortBy +
      '&sort_order=' +
      sortOrder +
      '&scopes=' +
      localStorage.getItem('scope');
    return this.http.get(url);
  }

  filteredDataAcqRights(
    aquiredRightsIndividualParams: AcquiredRightsIndividualParams
  ): Observable<AcquiredRightsResponse | ErrorResponse> {
    let params = new HttpParams();
    for (let key in aquiredRightsIndividualParams)
      params = params.set(key, aquiredRightsIndividualParams[key]);

    return this.http
      .get<AcquiredRightsResponse | ErrorResponse>(this.URLs.AcquiredRights, {
        params,
      })
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getAggregationAcquiredRights(
    query: any
  ): Observable<AggregatedAcquiredRights | ErrorResponse> {
    let params = new HttpParams();
    for (let key of Object.keys(query)) {
      params = params.set(key, query[key]);
    }
    return this.http.get<AggregatedAcquiredRights | ErrorResponse>(
      this.URLs.AggregationAcquiredRights,
      {
        params,
      }
    );
  }

  createAcquiredRight(body): Observable<any> {
    const url = this.apiUrl + '/product/acqright';
    // return this.http.post(url, body, formData:FormData);

    return this.http
      .post<any>(url, body, { headers: this.defaultHeaders })
      .pipe(catchError((error) => throwError(error.error)));
  }
  deleteAcqRights(sku: string) {
    const url =
      this.apiUrl +
      '/product/acqright/' +
      sku +
      '?scope=' +
      localStorage.getItem('scope');
    return this.http.delete<any>(url);
  }

  updateAcqRights(body): Observable<any> {
    const url = this.apiUrl + '/product/acqright/' + body.sku;
    return this.http.put<any>(url, body, { headers: this.defaultHeaders });
  }

  getProductsByAggrID(aggname, metric) {
    const url =
      this.apiUrl +
      '/product/expand/aggregation_acqrights' +
      '?scope=' +
      localStorage.getItem('scope') +
      '&aggregation_name=' +
      aggname +
      '&metric=' +
      metric;
    return this.http.get<any>(url);
  }
  // Dashboard
  getDashboardUpdateInfo(scope, timezone) {
    const url =
      this.apiUrl + '/product/banner?scope=' + scope + '&time_zone=' + timezone;
    return this.http.get<any>(url);
  }
  // Dashboard- Overview
  getProductsOverview(scope) {
    const url = this.apiUrl + '/product/dashboard/overview?scope=' + scope;
    return this.http.get<any>(url);
  }

  getProductsPerEditor(scope) {
    const url =
      this.apiUrl + '/product/dashboard/editors/products?scope=' + scope;
    return this.http.get<any>(url);
  }

  getSwLicComposition(scope) {
    const url =
      this.apiUrl + '/product/dashboard/metrics/products?scope=' + scope;
    return this.http.get<any>(url);
  }

  getComplianceAlert(scope) {
    const url =
      this.apiUrl + '/product/dashboard/alert/compliance?scope=' + scope;
    return this.http.get<any>(url);
  }

  // getQualityAlert(scope) {
  //   const url = this.apiUrl + '/dashboard/alert/dataquality?scope=' + scope;
  //   return this.http.get<any>(url);
  // }

  // Dashboard- Compliance
  getProductsComplianceCounterfeiting(scope, editor): Observable<any> {
    const url =
      this.apiUrl +
      '/product/dashboard/compliance/counterfeiting?scope=' +
      scope +
      '&editor=' +
      editor;
    return this.http.get<any>(url);
  }
  getProductsComplianceOverdeployment(scope, editor): Observable<any> {
    const url =
      this.apiUrl +
      '/product/dashboard/compliance/overdeployment?scope=' +
      scope +
      '&editor=' +
      editor;
    return this.http.get<any>(url);
  }

  // Dashboard- Quality
  getProductsQualityInfo(scope): Observable<any> {
    const url =
      this.apiUrl + '/product/dashboard/product/quality?scope=' + scope;
    return this.http.get<any>(url);
  }
  getProductsQualityProducts(scope): Observable<any> {
    const url =
      this.apiUrl + '/product/dashboard/quality/products?scope=' + scope;
    return this.http.get<any>(url);
  }

  createAcquiredRightAggregation(
    data: AcquiredRightAggregationBody
  ): Observable<any> {
    console.log('data', JSON.stringify(data));
    const url = `${this.apiUrl}/product/aggregatedrights`;
    return this.http.post<any>(url, data, { headers: this.defaultHeaders });
  }

  updateAcquiredRightAggregation(
    sku: string,
    data: AcquiredRightAggregationBody
  ): Observable<any> {
    return this.http.put<any>(
      `${this.URLs.aggregatedAcquiredRights}/${sku}`,
      data,
      { headers: this.defaultHeaders }
    );
  }

  // getAggregationListNew(): Observable<any> {
  // return this.http.get<any>(this.URLs.aggregationList, { headers: this.defaultHeaders })
  // return of([
  //   { id: 1, name: 'Aggregation 1' },
  //   { id: 2, name: 'Aggregation 2' },
  // ]).pipe(delay(5000));

  //   const url =
  //   this.apiUrl +
  //   '/product/aggregations' +
  //   '?scope=' +
  //   localStorage.getItem('scope');
  // return this.http.get<any>(url);
  // }

  getAggregationListNew(
    paramsObj: GetAggregationParams
  ): Observable<ErrorResponse | AggregationGetResponse> {
    let params = new HttpParams();
    for (const key in paramsObj) params = params.set(key, paramsObj[key]);

    return this.http
      .get<ErrorResponse | AggregationGetResponse>(this.URLs.aggregation, {
        params,
      })
      .pipe(
        /*********** 
        Below line code is a fallback for if we are getting the 
        HttpErrorResponse instead of custom "ErrorResponse" 
        ***********/
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }
}
