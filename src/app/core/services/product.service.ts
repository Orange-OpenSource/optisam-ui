import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Products,
  AggregationDetailsAquiredRights,
  AggregationDetailsInformation,
  AggregationDetailsOptions,
  ProductAggregationApplications,
  MetricSimulationResponse,
  MetricSimulationRequest,
  CostSimulationResponse,
  CostSimulationRequest,
  AggregationProductsInformation,
  MetricComputationDetails,
  AggregationComputationDetails,
  UserCountDetailData,
  ConcurrentUserHistoryParams,
  ConcurrentUserHistoryResponse,
  UploadedFilesParams,
  UploadedFiles,
  EntitySoftExpenseResponse,
  ProductCatalogOverview,
  DashboardOverviewResponse,
  TrueUpDashboardResponse,
  TrueUpDashboardParams,
  WasteDashboardParams,
  WasteDashboardResponse,
  SoftwareWithNoMaintenance,
  DeploymentType,
  SoftwareExpenditure,
  SoftwareExpenditureProduct,
  SoftwareMaintenance,
  DashboardLocationResponse,
  SoftwareExpenditureByProductParams,
  PCDashboardOverviewResponse
} from '@core/modals';
import { Applications } from './application';
import {
  AcquiredRightsAggregation,
  AggregationEditorParams,
  AggregationProductsParams,
  AcquiredRightAggregationBody,
} from '../../modules/home/pages/acquiredrights/acquired-rights.modal';
import {
  AcquiredRightsAggregationParams,
  AggregatedAcquiredRights,
  AggregationGetResponse,
  CreateAggregationPlayload,
  EditorsListParams,
  EditorsListResponse,
  ErrorResponse,
  GetAggregationParams,
  SuccessResponse,
  AcquiredRightsIndividualParams,
  AcquiredRightsResponse,
  DashboardEditorListParams,
  DashboardEditorListResponse,
  ListProductQueryParams,
  ProductListResponse,
  NominativeUserProductBody,
  NominativeUserListResponse,
  NominativeUserListParams,
  ConcurrentUserBody,
  ConcurrentUserListResponse,
  ConcurrentUserListParams,
  SharedDataLicences,
  SharedLicencesParams,
  SharedLicencesUpdateParams,
  SharedLicencesUpdateResponse,
  SharedAggregationUpdateParams,
  SharedAmountParams,
  SharedAmount,
  NominativeUsersExportParams,
  ConcurrentUsersExportParams,
} from '@core/modals';
import { CommonService } from './common.service';
import {
  delay,
  catchError,
  debounceTime,
  debounce,
  takeLast,
  throttleTime,
} from 'rxjs/operators';
import { LOCAL_KEYS, METRIC_SELECTION_ALLOWED_LIMIT, TYPES_DISABLED_LIST } from '@core/util/constants/constants';
import { fixedErrorResponse, getParams } from '@core/util/common.functions';
import { Expenditure } from './expenditure';
import { GroupComplianceEditors } from './group-compliance-editor';
import { GroupComplianceProducts } from './group-compliance-product';
import {
  ComplianceUnderUsage,
  UnderUsageComplianceParams,
} from './underusage-compliance';
import { MatOptionSelectionChange } from '@angular/material/core';

import { Metric } from '@core/modals'

export interface CommonURL {
  acquiredRightAggregationAdmin: string;
  AggregationAcquiredRights: string;
  AcquiredRights: string;
  aggregation: string;
  aggregationEditors: string;
  aggregatedAcquiredRights: string;
  productEditorList: string;
  productEditorProducts: string;
  nominativeUsers: string;
  concurrentUsers: string;
  acquiredRightsLicenses: string;
  aggregationLicenses: string;
  sharedAmount: string;
  putAcquiredRightsLicenses: string;
  nominativeUsersExport: string;
  concurrentUsersExport: string;
  concurrentUsersHistory: string;
  acquiredRightsEditors: string;
  complianceSoftwareExpenditure: string;
  groupComplianceEditors: string;
  complianceProductList: string;
  groupComplianceProducts: string;
  getProductsWithMaintenance: string;
  getProductsWithNoMaintenance: string;
  getProductsWithDeploymentType: string;
  getProductsWithLocationType: string;
  getEditorExpenses: string;
  getProductExpenses: string;
  uploadedNominativeFiles: string;
  pcDashboardOverview: string;
  productOverview: string;
  trueUpDashboard: string;
  wasteDashboard: string
}

@Injectable()
export class ProductService {
  apiUrl = environment.API_PRODUCT_URL;
  importUrl = environment.API_IMPORT_URL;
  apiLicenseUrl = environment.API_URL;
  apiApplicationUrl = environment.API_APPLICATION_URL;
  apiSimulationUrl = environment.API_CONFIG_URL;
  catalogUrl = environment.API_PRODUCT_CATALOG;
  defaultHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  private aggregationData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private costOptimization: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private userCountDetailData: BehaviorSubject<UserCountDetailData | null> =
    new BehaviorSubject<UserCountDetailData | null>(null);

  private groupComplianceSelectedEditor$: Subject<string> = new Subject();

  private overviewDashboardData: ReplaySubject<DashboardOverviewResponse | ErrorResponse> = new ReplaySubject<DashboardOverviewResponse | ErrorResponse>()

  public overviewDashboardData$: Observable<DashboardOverviewResponse | ErrorResponse> = this.overviewDashboardData.asObservable();

  private URLs: CommonURL = {
    acquiredRightAggregationAdmin: `${this.apiUrl}/product/aggregated_acqrights`,
    AggregationAcquiredRights: `${this.apiUrl}/product/aggregated_acqrights`,
    aggregatedAcquiredRights: `${this.apiUrl}/product/aggregatedrights`,
    AcquiredRights: `${this.apiUrl}/product/acqrights`,
    aggregation: `${this.apiUrl}/product/aggregations`,
    productEditorList: `${this.apiUrl}/product/editors`,
    productEditorProducts: `${this.apiUrl}/product/editors/products`,
    nominativeUsers: `${this.apiUrl}/product/nominative/users`,
    concurrentUsers: `${this.apiUrl}/product/concurrent`,
    nominativeUsersExport: `${this.apiUrl}/product/nominative/users/export`,
    acquiredRightsLicenses: `${this.apiUrl}/product/acqrights/licenses`,
    putAcquiredRightsLicenses: `${this.apiUrl}/product/licenses`,
    aggregationLicenses: `${this.apiUrl}/product/aggrights/licenses`,
    sharedAmount: `${this.apiUrl}/product/sharedamount`,
    concurrentUsersExport: `${this.apiUrl}/product/concurrent/users/export`,
    concurrentUsersHistory: `${this.apiUrl}/product/concurrent`,
    aggregationEditors: `${this.apiUrl}/product/aggregations/editors`,
    acquiredRightsEditors: `${this.apiUrl}/product/editors`,
    complianceSoftwareExpenditure: `${this.apiUrl}/product/dashboard/compliance/soft_exp`,
    groupComplianceEditors: `${this.apiUrl}/product/dashboard/groupcompliance/editor`,
    complianceProductList: `${this.apiUrl}/product/dashboard/groupcompliance/editor/product`,
    groupComplianceProducts: `${this.apiUrl}/product/dashboard/groupcompliance/product`,
    getProductsWithNoMaintenance: `${this.apiUrl}/product/dashboard/product/no_maintenance`,
    getProductsWithMaintenance: `${this.apiUrl}/product/dashboard/product/maintenance`,
    getProductsWithDeploymentType: `${this.apiUrl}/product/dashboard/product/deployment_type`,
    getProductsWithLocationType: `${this.apiUrl}/product/dashboard/product/open_close_source`,
    getEditorExpenses: `${this.apiUrl}/product/dashboard/editor_expenses`,
    getProductExpenses: `${this.apiUrl}/product/dashboard/product_expenses`,
    uploadedNominativeFiles: `${this.importUrl}/import/nominative/users/fileupload`,
    pcDashboardOverview: `${this.catalogUrl}/catalog/dashboard`,
    productOverview: `${this.apiUrl}/product/dashboard/overview`,
    trueUpDashboard: `${this.apiUrl}/product/dashboard/trueup`,
    wasteDashboard: `${this.apiUrl}/product/dashboard/wasteup`,
  };

  constructor(private http: HttpClient, private cs: CommonService) { }

  getAggregationData(): Observable<any> {
    return this.aggregationData.asObservable();
  }

  setAggregationData(data: any): void {
    this.aggregationData.next(data);
  }

  getUserCountDetailData(): Observable<UserCountDetailData> {
    return this.userCountDetailData.asObservable();
  }

  setUserCountDetailsData(data: UserCountDetailData): void {
    this.userCountDetailData.next(data);
  }

  setGroupComplianceSelectedEditor(editor: string): void {
    this.groupComplianceSelectedEditor$.next(editor);
  }

  getGroupComplianceSelectedEditor(): Observable<string> {
    return this.groupComplianceSelectedEditor$.asObservable();
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

  isCostOptimizationVisible(): Observable<boolean> {
    return this.costOptimization.asObservable();
  }

  showCostOptimization(): void {
    this.costOptimization.next(true);
  }

  hideCostOptimization(): void {
    this.costOptimization.next(false);
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
    filteringkey3,
    filteringkey4
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
        encodeURIComponent(filteringkey3);
    }
    if (filteringkey4 !== '' && filteringkey4 !== undefined) {
      filteringCondition =
        filteringCondition +
        '&search_params.location.filteringkey=' +
        filteringkey4;
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

  costSimulation(
    body: CostSimulationRequest
  ): Observable<CostSimulationResponse> {
    const url = this.apiSimulationUrl + '/simulation/cost';
    return this.http.post<CostSimulationResponse>(url, body);
  }

  getEditorList(query: any) {
    const url = this.apiUrl + '/product/aggregations/editors' + query;
    return this.http.get<any>(url);
  }

  getDashboardEditorList(
    query: DashboardEditorListParams
  ): Observable<DashboardEditorListResponse | ErrorResponse> {
    let params = new HttpParams();
    for (let key in query) params = params.set(key, query[key]);
    return this.http
      .get<ErrorResponse | DashboardEditorListResponse>(
        this.URLs.productEditorList,
        { params }
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getEditorsList(
    input: EditorsListParams
  ): Observable<EditorsListResponse | ErrorResponse> {
    let params = new HttpParams();
    for (const key in input) params = params.set(key, input[key]);
    return this.http
      .get<EditorsListResponse | ErrorResponse>(
        `${this.URLs.acquiredRightsEditors}`,
        { params }
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
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

  getProductList(
    query: ListProductQueryParams
  ): Observable<ProductListResponse | ErrorResponse> {
    let params = new HttpParams();
    for (const key in query) params = params.set(key, query[key]);
    return this.http
      .get<ErrorResponse | ProductListResponse>(
        this.URLs.productEditorProducts,
        { params }
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
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
    scopes: any
  ): Observable<{ editor: string[] } | ErrorResponse> {
    let params = new HttpParams();
    params = params.set('scope', scopes);

    return this.http
      .get<{ editor: string[] } | ErrorResponse>(this.URLs.aggregationEditors, {
        headers: this.defaultHeaders,
        params,
      })
      .pipe(
        catchError((e) => {
          return e?.error ? throwError(e.error) : throwError(e);
        })
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
    console.log(httpParams);
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

  getSimulationAggregations(query): Observable<Products[]> {
    const url = this.apiUrl + '/product/aggregations' + query;
    return this.http.get<Products[]>(url);
  }

  getAcqRightsAggregations(
    inputs: AcquiredRightsAggregationParams
  ): Observable<ErrorResponse | AggregationGetResponse> {

    return this.http
      .get<ErrorResponse | AggregationGetResponse>(
        this.URLs.AggregationAcquiredRights,
        {
          params: getParams(inputs, false)
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
    inputs: AcquiredRightsIndividualParams
  ): Observable<AcquiredRightsResponse | ErrorResponse> {
    return this.http
      .get<AcquiredRightsResponse | ErrorResponse>(this.URLs.AcquiredRights, {
        params: getParams(inputs, false)
      })
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getAggregationAcquiredRights(
    query: AcquiredRightsAggregationParams
  ): Observable<AggregatedAcquiredRights | ErrorResponse> {
    let params = new HttpParams();

    for (let key in query) params = params.set(key, query[key]);
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
  getProductsOverview(scope): Observable<DashboardOverviewResponse | ErrorResponse> {
    const params = (new HttpParams()).set('scope', scope);
    return this.http.get<DashboardOverviewResponse | ErrorResponse>(this.URLs.productOverview, { params }).pipe(catchError(fixedErrorResponse));
  }

  fetchDashboardOverviewData(scope: string): void{
    this.getProductsOverview(scope).subscribe((res: DashboardOverviewResponse)=>{
      this.overviewDashboardData.next(res)
    })
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

  createNominativeUser(
    body: NominativeUserProductBody
  ): Observable<{ status: boolean } | ErrorResponse> {
    return this.http
      .post<{ status: boolean } | ErrorResponse>(
        this.URLs.nominativeUsers,
        body,
        { headers: this.defaultHeaders }
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  createConcurrentUer(body: ConcurrentUserBody): Observable<
    | {
      success: boolean;
    }
    | ErrorResponse
  > {
    return this.http
      .post<
        | {
          success: boolean;
        }
        | ErrorResponse
      >(this.URLs.concurrentUsers, body, { headers: this.defaultHeaders })
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  updateNominativeUser(
    body: NominativeUserProductBody
  ): Observable<{ status: boolean } | ErrorResponse> {
    return this.http
      .post<{ status: boolean } | ErrorResponse>(
        this.URLs.nominativeUsers,
        body,
        { headers: this.defaultHeaders }
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  updateConcurrentUer(body: ConcurrentUserBody): Observable<
    | ErrorResponse
    | {
      success: boolean;
    }
  > {
    return this.http
      .put<
        | ErrorResponse
        | {
          success: boolean;
        }
      >(`${this.URLs.concurrentUsers}/${body.id}`, body)
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getNominativeUserList(
    input: NominativeUserListParams
  ): Observable<NominativeUserListResponse | ErrorResponse> {
    let params = new HttpParams();
    for (let key in input) params = params.set(key, input[key]);
    return this.http
      .get<ErrorResponse | NominativeUserListResponse>(
        `${this.URLs.nominativeUsers}`,
        {
          params,
        }
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getSharedAccquiredLicences(
    input: SharedLicencesParams
  ): Observable<SharedDataLicences | ErrorResponse> {
    // return of<SharedDataLicences>({
    //   "available_licenses": 80,
    //   "shared_data": [
    //     {
    //       "scope": "AAK",
    //       "shared_licenses": 10,
    //       "recieved_licenses": 0
    //     },
    //   {
    //       "scope": "AKA",
    //       "shared_licenses": 20,
    //       "recieved_licenses": 0
    //     }
    //   ],
    //   "total_shared_licenses": 30,
    //   "total_recieved_licenses": 0
    // }).pipe(delay(3000))
    console.log(input);
    let params = new HttpParams();
    for (let key in input) params = params.set(key, input[key]);
    return this.http
      .get<SharedDataLicences | ErrorResponse>(
        `${this.URLs.acquiredRightsLicenses}`,
        { params }
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  putSharedAccquiredLicences(
    input: SharedLicencesUpdateParams
  ): Observable<SharedLicencesUpdateResponse | ErrorResponse> {
    // return of<SharedLicencesUpdateResponse>({
    //   success:true
    // }).pipe(delay(2000))
    return this.http
      .put<SharedLicencesUpdateResponse | ErrorResponse>(
        `${this.URLs.putAcquiredRightsLicenses}`,
        input,
        { headers: this.defaultHeaders }
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  putSharedAggregationLicences(
    input: SharedAggregationUpdateParams
  ): Observable<SharedLicencesUpdateResponse | ErrorResponse> {
    // return of<SharedLicencesUpdateResponse>({
    //   success:true
    // }).pipe(delay(2000))
    return this.http
      .put<SharedLicencesUpdateResponse | ErrorResponse>(
        `${this.URLs.aggregationLicenses}`,
        input,
        { headers: this.defaultHeaders }
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getSharedAmount(
    input: SharedAmountParams
  ): Observable<SharedAmount | ErrorResponse> {
    let params = new HttpParams();
    for (let key in input) params = params.set(key, input[key]);
    return this.http
      .get<SharedAmount | ErrorResponse>(`${this.URLs.sharedAmount}`, {
        params,
      })
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  deleteNominativeUser(
    id: number
  ): Observable<{ success: boolean } | ErrorResponse> {
    let params = new HttpParams().set(
      'scope',
      this.cs.getLocalData(LOCAL_KEYS.SCOPE)
    );
    return this.http
      .delete<{ success: boolean } | ErrorResponse>(
        `${this.URLs.nominativeUsers}/${id}`,
        { params }
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getConcurrentUserList(
    body: ConcurrentUserListParams
  ): Observable<ConcurrentUserListResponse | ErrorResponse> {
    let params = new HttpParams();
    for (const key in body) params = params.set(key, body[key]);
    // return of<ConcurrentUserListResponse>({
    //   totalRecords: 1,
    //   concurrent_user: [
    //     {
    //       product_name: 'testing',
    //       aggregation_name: 'testing',
    //       product_version: 'testing',
    //       team: 'testing',
    //       profile_user: 'testing',
    //       number_of_users: 3,
    //       purchase_date: '2022-11-29T05:16:00.168Z',
    //       aggregation_id: 0,
    //       id: 0,
    //       is_aggregation: false,
    //     },
    //     {
    //       product_name: 'testing',
    //       aggregation_name: 'testing',
    //       product_version: 'testing',
    //       team: 'testing',
    //       profile_user: 'testing',
    //       number_of_users: 3,
    //       purchase_date: '2022-11-29T05:16:00.168Z',
    //       aggregation_id: 0,
    //       id: 0,
    //       is_aggregation: true,
    //     },
    //   ],
    // });
    return this.http
      .get<ConcurrentUserListResponse>(this.URLs.concurrentUsers, { params })
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  deleteConcurrentUserProduct(
    id: number,
    scope: string
  ): Observable<{ success: boolean } | ErrorResponse> {
    let params: HttpParams = new HttpParams().set('scope', scope);
    return this.http
      .delete<{ success: boolean }>(`${this.URLs.concurrentUsers}/${id}`, {
        params,
      })
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getNominativeUserExport(
    inputs: NominativeUsersExportParams
  ): Observable<NominativeUserListResponse | ErrorResponse> {
    let params = new HttpParams();
    for (let key in inputs) params = params.set(key, inputs[key]);

    // return of<NominativeUserListResponse>({
    //   totalRecords: 2,
    //   nominative_user: [
    //     {
    //       product_name: 'product 1',
    //       aggregation_name: '',
    //       product_version: '1.2.12',
    //       user_name: 'test username',
    //       first_name: 'test user',
    //       user_email: 'test@emial.com',
    //       profile: 'test profile',
    //       activation_date: '2022-10-18T23:21:50.660Z',
    //       aggregation_id: 0,
    //       id: 23,
    //     },
    //     {
    //       product_name: '',
    //       aggregation_name: 'test',
    //       product_version: '2.3',
    //       user_name: 'vivek',
    //       first_name: 'vivek',
    //       user_email: 'viv@email.com',
    //       profile: 'test profile',
    //       activation_date: '2022-11-29T02:48:28.782Z',
    //       aggregation_id: 22,
    //       id: 0,
    //     },
    //   ],
    // });

    return this.http
      .get<ErrorResponse | NominativeUserListResponse>(
        this.URLs.nominativeUsersExport,
        { params }
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getConcurrentUserExport(
    inputs: ConcurrentUsersExportParams
  ): Observable<ConcurrentUserListResponse | ErrorResponse> {
    let params = new HttpParams();
    for (let key in inputs) params = params.set(key, inputs[key]);

    return this.http
      .get<ErrorResponse | ConcurrentUserListResponse>(
        this.URLs.concurrentUsersExport,
        { params }
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getConcurrentUsersHistory(
    inputs: ConcurrentUserHistoryParams
  ): Observable<ErrorResponse | ConcurrentUserHistoryResponse> {
    // return of({
    //   concurrentUsersByDays: [],
    //   concurrentUsersByMonths: [
    //     {
    //       purchase_month: 'February 2023',
    //       councurrent_users: 10,
    //     },
    //     {
    //       purchase_month: 'January 2023',
    //       councurrent_users: 34,
    //     },
    //     {
    //       purchase_month: 'December 2022',
    //       councurrent_users: 74,
    //     },
    //     {
    //       purchase_month: 'November 2022',
    //       councurrent_users: 36,
    //     },
    //     {
    //       purchase_month: 'October 2022',
    //       councurrent_users: 44,
    //     },
    //     {
    //       purchase_month: 'September 2022',
    //       councurrent_users: 95,
    //     },
    //     {
    //       purchase_month: 'August 2022',
    //       councurrent_users: 46,
    //     },
    //     {
    //       purchase_month: 'July 2022',
    //       councurrent_users: 56,
    //     },
    //     {
    //       purchase_month: 'June 2022',
    //       councurrent_users: 28,
    //     },
    //     {
    //       purchase_month: 'May 2022',
    //       councurrent_users: 85,
    //     },
    //     {
    //       purchase_month: 'April 2022',
    //       councurrent_users: 74,
    //     },
    //     {
    //       purchase_month: 'March 2022',
    //       councurrent_users: 91,
    //     },
    //   ],
    // });

    let params = new HttpParams();
    for (let key in inputs)
      if (key !== 'scope') params = params.set(key, inputs[key]);
    return this.http
      .get<ErrorResponse | ConcurrentUserHistoryResponse>(
        `${this.URLs.concurrentUsersHistory}/${inputs.scope}`,
        { params }
      )
      .pipe(catchError(fixedErrorResponse));
  }

  getSoftwareExpenditure(
    scopes: string | string[]
  ): Observable<ErrorResponse | EntitySoftExpenseResponse> {
    let params = new HttpParams();
    if (Array.isArray(scopes) && scopes.length) {
      for (let scope of scopes) {
        params = params.append('scope', scope);
      }
    } else {
      params = params.append('scope', scopes as string);
    }

    return this.http
      .get<ErrorResponse | EntitySoftExpenseResponse>(
        this.URLs.complianceSoftwareExpenditure,
        { params }
      )
      .pipe(catchError(fixedErrorResponse));
  }

  //new APIS
  getGroupComplianceByEditors(
    scopes: any,
    editor: string
  ): Observable<ErrorResponse | GroupComplianceEditors> {
    // if(editor == 'Oracle'){
    //   return of<GroupComplianceEditors>({
    //     costs: {
    //       groupCounterFeitingCost: 5000,
    //       groupUnderUsageCost: 8000,
    //       groupTotalCost: 13000,
    //       counterFeiting: [{
    //         scope: 'AAK',
    //         cost: 2500,
    //       }, {
    //         scope: 'BAK',
    //         cost: 1200,
    //       }, {
    //         scope: 'BUG',
    //         cost: 1300,
    //       }],
    //       underUsage: [{
    //         scope: 'AAK',
    //         cost: 3500,
    //       }, {
    //         scope: 'BAK',
    //         cost: 1500,
    //       }, {
    //         scope: 'BUG',
    //         cost: 3000,
    //       }],
    //       total: [{
    //         scope: 'AAK',
    //         cost: 6000,
    //       }, {
    //         scope: 'BAK',
    //         cost: 2700,
    //       }, {
    //         scope: 'BUG',
    //         cost: 4300,
    //       }]
    //     }
    //   })
    // }else{
    //   return of<GroupComplianceEditors>({
    //     costs: {
    //       groupCounterFeitingCost: 2500,
    //       groupUnderUsageCost: 4500,
    //       groupTotalCost: 7000,
    //       counterFeiting: [ {
    //         scope: 'OJO',
    //         cost: 1200,
    //       }, {
    //         scope: 'OFR',
    //         cost: 1300,
    //       }],
    //       underUsage: [ {
    //         scope: 'OJO',
    //         cost: 1500,
    //       }, {
    //         scope: 'OFR',
    //         cost: 3000,
    //       }],
    //       total: [ {
    //         scope: 'OJO',
    //         cost: 2700,
    //       }, {
    //         scope: 'OFR',
    //         cost: 4300,
    //       }]
    //     }
    //   })
    // }

    // const obj: any = {
    //   scopes: scopes,
    //   editor: editor,
    // };

    // let params = new HttpParams();
    // // params.set('scopes', scopes); // can not add array as a value
    // // params.set('editor', editor);
    // for (let key in obj) {
    //   params = params.set(key, obj[key]);
    // }
    let params = new HttpParams();
    for (let scope of scopes) {
      params = params.append('scopes', scope);
    }
    params = params.set('editor', editor);

    return this.http
      .get<ErrorResponse | GroupComplianceEditors>(
        this.URLs.groupComplianceEditors,
        { params }
      )
      .pipe(catchError(fixedErrorResponse));
  }

  getProductsList(
    scopes: any,
    editor: string
  ): Observable<ErrorResponse | { products: string[] }> {
    // if (editor == 'Oracle') {
    //   return of<{ products: string[] }>({
    //     products: ['OracleProduct1', 'OracleProduct2'],
    //   });
    // } else {
    //   return of<{ products: string[] }>({
    //     products: ['MicrosoftProduct1', 'MicrosoftProduct2'],
    //   });
    // }

    // const obj: any = {
    //   scopes: scopes,
    //   editor: editor,
    // };
    // let params = new HttpParams();
    // // params.set('scopes', scopes); // can not add array as a value
    // // params.set('editor', editor);
    // for (let key in obj) {
    //   params = params.set(key, obj[key]);
    // }
    let params = new HttpParams();
    for (let scope of scopes) {
      params = params.append('scopes', scope);
    }
    params = params.set('editor', editor);
    return this.http
      .get<ErrorResponse | { products: string[] }>(
        this.URLs.complianceProductList,
        { params }
      )
      .pipe(catchError(fixedErrorResponse));
  }

  getGroupComplianceByProducts(
    scopes: any,
    editor: string,
    product: string
  ): Observable<ErrorResponse | GroupComplianceProducts> {
    // if (product.includes('1')) {
    //   return of<GroupComplianceProducts>({
    //     licences: [
    //       {
    //         scope: 'AAK',
    //         computed_licences: 500,
    //         acquired_licences: 800,
    //       },
    //       {
    //         scope: 'BUG',
    //         computed_licences: 400,
    //         acquired_licences: 1000,
    //       },
    //       {
    //         scope: 'OFR',
    //         computed_licences: 650,
    //         acquired_licences: 990,
    //       },
    //     ],
    //     cost: [
    //       {
    //         scope: 'AAK',
    //         underusage_cost: 1200,
    //         counterfeiting_cost: 2100,
    //         total_cost: 3300,
    //       },
    //       {
    //         scope: 'BUG',
    //         underusage_cost: 700,
    //         counterfeiting_cost: 1500,
    //         total_cost: 2200,
    //       },
    //       {
    //         scope: 'OFR',
    //         underusage_cost: 1600,
    //         counterfeiting_cost: 2800,
    //         total_cost: 4400,
    //       },
    //     ],
    //   });
    // } else {
    //   return of<GroupComplianceProducts>({
    //     licences: [
    //       {
    //         scope: 'OJO',
    //         computed_licences: 500,
    //         acquired_licences: 800,
    //       },
    //       {
    //         scope: 'BAK',
    //         computed_licences: 800,
    //         acquired_licences: 1100,
    //       },
    //     ],
    //     cost: [
    //       {
    //         scope: 'OJO',
    //         underusage_cost: 2200,
    //         counterfeiting_cost: 2100,
    //         total_cost: 4300,
    //       },
    //       {
    //         scope: 'BAK',
    //         underusage_cost: 1700,
    //         counterfeiting_cost: 1500,
    //         total_cost: 3200,
    //       },
    //     ],
    //   });
    // }
    // let params = new HttpParams();
    // // params.set('scopes', scopes); // can not add array as a value using any
    // // params.set('editor', editor);
    // // params.set('product_name', product);
    // const obj = {
    //   scopes: scopes,
    //   editor: editor,
    //   product_name: product,
    // };
    // for (let key in obj) {
    //   params = params.set(key, obj[key]);
    // }
    let params = new HttpParams();
    for (let scope of scopes) {
      params = params.append('scopes', scope);
    }
    params = params.set('editor', editor);
    params = params.set('product_name', product);
    return this.http
      .get<ErrorResponse | GroupComplianceProducts>(
        this.URLs.groupComplianceProducts,
        { params }
      )
      .pipe(catchError(fixedErrorResponse));
  }

  getUnderUsageCompliance(
    underUsage: UnderUsageComplianceParams
  ): Observable<ErrorResponse | ComplianceUnderUsage> {
    let params = new HttpParams();
    for (const key in underUsage) {
      if (key === 'scopes') {
        if (Array.isArray(underUsage[key])) {
          for (let scope of underUsage[key]) {
            params = params.append(key, scope);
          }
        }
        continue;
      }

      params = params.append(key, underUsage[key]);
    }
    return this.http.get<ErrorResponse | ComplianceUnderUsage>(
      this.apiUrl + '/product/dashboard/underusage',
      { params }
    );
  }

  getUploadedFiles(
    input: UploadedFilesParams
  ): Observable<UploadedFiles | ErrorResponse> {
    let params: HttpParams = new HttpParams();
    for (let key in input) params = params.set(key, input[key]);
    return this.http
      .get<UploadedFiles | ErrorResponse>(this.URLs.uploadedNominativeFiles, {
        params,
      })
      .pipe(catchError(fixedErrorResponse));
  }

  getSoftwareExpenditureByEditor(
    scope: string
  ): Observable<ErrorResponse | SoftwareExpenditure> {
    // return of<ErrorResponse | SoftwareExpenditure>({
    //   editorExpensesByScope: [
    //     {
    //       editor_name: 'Oracle',
    //       total_purchase_cost: 75,
    //       total_maintenance_cost: 30,
    //       total_cost: 40,
    //     },
    //     {
    //       editor_name: 'IBM',
    //       total_purchase_cost: 30,
    //       total_maintenance_cost: 50,
    //       total_cost: 20,
    //     },
    //     {
    //       editor_name: 'Adobe',
    //       total_purchase_cost: 20,
    //       total_maintenance_cost: 50,
    //       total_cost: 70,
    //     },
    //     {
    //       editor_name: 'TCS',
    //       total_purchase_cost: 25,
    //       total_maintenance_cost: 10,
    //       total_cost: 80,
    //     },
    //     {
    //       editor_name: 'Orange',
    //       total_purchase_cost: 70,
    //       total_maintenance_cost: 80,
    //       total_cost: 90,
    //     },
    //   ],
    // }).pipe(delay(2000));

    let params = new HttpParams();
    params = params.set('scope', scope);
    return this.http.get<ErrorResponse | SoftwareExpenditure>(
      this.URLs.getEditorExpenses,
      {
        params,
      }
    )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getUsageCostByProduct(
    input: SoftwareExpenditureByProductParams
  ): Observable<ErrorResponse | SoftwareExpenditureProduct> {
    // return of<ErrorResponse | SoftwareExpenditureProduct>({
    //   editorProductExpensesByScope: [
    //     {
    //       name: 'IBM',
    //       total_purchase_cost: 70,
    //       total_maintenance_cost: 70,
    //       total_cost: 80,
    //       type: 'product',
    //     },
    //     {
    //       name: 'Adobe',
    //       total_purchase_cost: 120,
    //       total_maintenance_cost: 70,
    //       total_cost: 80,
    //       type: 'product',
    //     },
    //   ],
    // }).pipe(delay(2000));

    let params = new HttpParams();
    for (const key in input)
      params = params.set(key, input[key]);


    return this.http
      .get<ErrorResponse | SoftwareExpenditureProduct>(
        this.URLs.getProductExpenses,
        { params }
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getProductsWithNoMaintenance(
    scope: any
  ): Observable<ErrorResponse | SoftwareWithNoMaintenance> {
    let params = new HttpParams();
    params = params.set('scope', scope);

    // return of<ErrorResponse | SoftwareWithNoMaintenance>({
    //   total_products: 25,
    //   product_no_main: [
    //     {
    //       sku: 'Adobe_sku',
    //       product_name: 'Adobe',
    //       version: '1.1',
    //     },
    //     {
    //       sku: 'IBM_sku',
    //       product_name: 'IBM',
    //       version: '2.1',
    //     },
    //     {
    //       sku: 'Oracle_sku',
    //       product_name: 'Oracle',
    //       version: '1.1',
    //     },
    //     {
    //       sku: 'TCS_sku',
    //       product_name: 'TCS',
    //       version: '3.1',
    //     },
    //   ],
    // }).pipe(delay(2000));

    return this.http
      .get<ErrorResponse | SoftwareWithNoMaintenance>(
        this.URLs.getProductsWithNoMaintenance,
        {
          params,
        }
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getProductsWithMaintenance(
    scope: string
  ): Observable<ErrorResponse | SoftwareMaintenance> {
    // let params = new HttpParams();
    // params = params.set('scope', scope);
    // return of<ErrorResponse | SoftwareMaintenance>({
    //   product_with_maintenance_percentage: 60,
    //   product_without_maintenance_percentage: 40,
    //   ProductPerc: [
    //     {
    //       swidtag: 'Oracle_sku',
    //       precentage_covered: 57,
    //     },
    //     {
    //       swidtag: 'Adobe_sku',
    //       precentage_covered: 33,
    //     },
    //   ],
    // }).pipe(delay(2000));

    let params = new HttpParams();
    params = params.set('scope', scope);
    return this.http.get<ErrorResponse | SoftwareMaintenance>(
      this.URLs.getProductsWithMaintenance,
      { params }
    );
  }

  getProductsLocation(
    scope: string
  ): Observable<ErrorResponse | DeploymentType> {
    // return of<ErrorResponse | DeploymentType>({
    //   saas_percentage: 70,
    //   on_premise_percentage: 30,
    // }).pipe(delay(2000));

    let params = new HttpParams();
    params = params.set('scope', scope);
    return this.http.get<ErrorResponse | DeploymentType>(
      this.URLs.getProductsWithDeploymentType,
      { params }
    );
  }

  //swagger not ready //mocked the data
  getProductsLicensing(scope: string): Observable<ErrorResponse | DashboardLocationResponse> {
    // return of<ErrorResponse | Location>({
    //   open_source: 44,
    //   closed_source: 56,
    // }).pipe(delay(2000));

    let params = new HttpParams();
    params = params.set('scope', scope);
    return this.http.get<ErrorResponse | DashboardLocationResponse>(
      this.URLs.getProductsWithLocationType,
      { params }
    );
  }

  getPcDashboardOverview(): Observable<ErrorResponse | PCDashboardOverviewResponse> {
    return this.http.get<PCDashboardOverviewResponse | ErrorResponse>(this.URLs.pcDashboardOverview).pipe(
      catchError(fixedErrorResponse)
    )
  }

  getTrueUpDashboardData(input: TrueUpDashboardParams): Observable<TrueUpDashboardResponse | ErrorResponse> {
    // return of<TrueUpDashboardResponse>({
    //   total_true_up_cost: 4000045,
    //   editors_true_up_cost: [
    //     {
    //       editor_cost: 3434,
    //       editor: 'Oracle',
    //       products_true_up_cost: [
    //         {
    //           product_cost: 450,
    //           product: 'sql',
    //         }
    //       ]
    //     },
    //     {
    //       editor_cost: 2453,
    //       editor: 'IBM',
    //       products_true_up_cost: [
    //         {
    //           product_cost: 450,
    //           product: 'sql',
    //         }
    //       ]
    //     },
    //     {
    //       editor_cost: 34545,
    //       editor: 'Orange',
    //       products_true_up_cost: [
    //         {
    //           product_cost: 450,
    //           product: 'Optisam',
    //         }
    //       ]
    //     },
    //     {
    //       editor_cost: 2653,
    //       editor: 'Adobe',
    //       products_true_up_cost: [
    //         {
    //           product_cost: 450,
    //           product: 'Photoshope',
    //         }
    //       ]
    //     },
    //     {
    //       editor_cost: 2473,
    //       editor: 'Red Hat',
    //       products_true_up_cost: [
    //         {
    //           product_cost: 450,
    //           product: 'wine',
    //         }
    //       ]
    //     },
    //     {
    //       editor_cost: 2459,
    //       editor: 'Microsoft',
    //       products_true_up_cost: [
    //         {
    //           product_cost: 450,
    //           product: 'Windows',
    //         }
    //       ]
    //     },
    //     {
    //       editor_cost: 2453,
    //       editor: 'Apple',
    //       products_true_up_cost: [
    //         {
    //           product_cost: 450,
    //           product: 'PhotoStudio',
    //         }
    //       ]
    //     },
    //     {
    //       editor_cost: 2453,
    //       editor: 'Hewlett-Packarded',
    //       products_true_up_cost: [
    //         {
    //           product_cost: 650,
    //           product: 'aC++',
    //         },
    //         {
    //           product_cost: 850,
    //           product: 'ALM Explorer',
    //         }
    //       ]
    //     },
    //     {
    //       editor_cost: 2453,
    //       editor: 'Open sourceware',
    //       products_true_up_cost: [
    //         {
    //           product_cost: 450,
    //           product: '3CDaemon',
    //         },
    //         {
    //           product_cost: 430,
    //           product: '3 Internet',
    //         }
    //       ]
    //     }
    //   ]
    // })

    let params = new HttpParams();
    for (const key in input) params = params.set(key, input[key]);
    return this.http.get<TrueUpDashboardResponse | ErrorResponse>(this.URLs.trueUpDashboard, { params }).pipe(
      catchError(fixedErrorResponse)
    )
  }


  getWasteDashboardData(input: WasteDashboardParams): Observable<WasteDashboardResponse | ErrorResponse> {
    // return of<WasteDashboardResponse>({
    //   total_waste_up_cost: 4000045,
    //   editors_waste_up_cost: [
    //     {
    //       editor_cost: 3434,
    //       editor: 'Oracle',
    //       products_waste_up_cost: [
    //         {
    //           product_cost: 450,
    //           product: 'sql',
    //         }
    //       ]
    //     },
    //     {
    //       editor_cost: 2453,
    //       editor: 'IBM',
    //       products_waste_up_cost: [
    //         {
    //           product_cost: 450,
    //           product: 'sql',
    //         }
    //       ]
    //     },
    //     {
    //       editor_cost: 34545,
    //       editor: 'Orange',
    //       products_waste_up_cost: [
    //         {
    //           product_cost: 450,
    //           product: 'Optisam',
    //         }
    //       ]
    //     },
    //     {
    //       editor_cost: 2653,
    //       editor: 'Adobe',
    //       products_waste_up_cost: [
    //         {
    //           product_cost: 450,
    //           product: 'Photoshope',
    //         }
    //       ]
    //     },
    //     {
    //       editor_cost: 2473,
    //       editor: 'Red Hat',
    //       products_waste_up_cost: [
    //         {
    //           product_cost: 450,
    //           product: 'wine',
    //         }
    //       ]
    //     },
    //     {
    //       editor_cost: 2459,
    //       editor: 'Microsoft',
    //       products_waste_up_cost: [
    //         {
    //           product_cost: 450,
    //           product: 'Windows',
    //         }
    //       ]
    //     },
    //     {
    //       editor_cost: 2453,
    //       editor: 'Apple',
    //       products_waste_up_cost: [
    //         {
    //           product_cost: 450,
    //           product: 'PhotoStudio',
    //         }
    //       ]
    //     },
    //     {
    //       editor_cost: 2453,
    //       editor: 'Hewlett-Packarded',
    //       products_waste_up_cost: [
    //         {
    //           product_cost: 650,
    //           product: 'aC++',
    //         },
    //         {
    //           product_cost: 850,
    //           product: 'ALM Explorer',
    //         }
    //       ]
    //     },
    //     {
    //       editor_cost: 2453,
    //       editor: 'Open sourceware',
    //       products_waste_up_cost: [
    //         {
    //           product_cost: 450,
    //           product: '3CDaemon',
    //         },
    //         {
    //           product_cost: 430,
    //           product: '3 Internet',
    //         }
    //       ]
    //     }
    //   ]
    // })

    let params = new HttpParams();
    for (const key in input) params = params.set(key, input[key]);
    return this.http.get<WasteDashboardResponse | ErrorResponse>(this.URLs.wasteDashboard, { params }).pipe(
      catchError(fixedErrorResponse)
    )
  }



  checkMapSizeChange(message?: string): boolean {
    if (!this?.['containers']?.length) return false;
    let height: number = 0;
    let width: number = 0;
    this?.['containers'].forEach((chartContainer: ElementRef, index: number) => {
      if (chartContainer) {
        const cHeight: number = chartContainer.nativeElement?.clientHeight || 0;
        const cWidth: number = chartContainer.nativeElement?.clientWidth || 0;
        height = cHeight >= height ? cHeight : height;
        width = cWidth >= width ? cWidth : width;
      }
    })
    if (this?.['containerHeight'] === height && this?.['containerWidth'] === width) return false;
    this['containerHeight'] = this?.['containerHeight'] === height ? this?.['containerHeight'] : height;
    this['containerWidth'] = this?.['containerWidth'] === width ? this?.['containerWidth'] : width;
    this?.['resetHeight']();
    return true;

  }


  metricOptionsChange(option: MatOptionSelectionChange, costOptimization: boolean = true): void {
    let fallbackOption: Metric;
    let metricArray: string[];
    const value = this['metrics']?.value;
    const constructorName = value.constructor.name;
    if (!option) {
      if (value) {
        switch (value.constructor.name) {

          case 'String':
            metricArray = value?.length ? value.split(',') : [];
            fallbackOption = this['metricsList'].filter((metric: Metric) => metricArray.includes(metric.name)).pop();
            break;

          case 'Array':
            fallbackOption = value[value.length - 1];
            break;
        }

      } else {
        fallbackOption = null;
      }
    }

    const selectedMetricName = option?.source?.viewValue || (fallbackOption?.name || '');
    const currentMetricType = option ? option?.source?.value?.type : (fallbackOption?.type || '');
    this['disabledMetricNameList'] = [];
    const isSelected: boolean = option ? option?.source?.selected : true;
    const isDeselected: boolean = !isSelected;

    if (TYPES_DISABLED_LIST.includes(currentMetricType)) {
      this['disabledMetricNameList'] = this['metricsList'].reduce((disabledMetricList: string[], metric: Metric) => {
        if (currentMetricType !== metric.type && (isSelected || (isDeselected && this['metrics'].value.length)))
          disabledMetricList.push(metric.name);
        return disabledMetricList;
      }, [])

      costOptimization && this['enableCostOptimization']();
      return;
    }

    this['disabledMetricNameList'] = this['metricsList'].reduce((disabledMetricList: string[], metric: Metric) => {
      if (TYPES_DISABLED_LIST.includes(metric.type) && (isSelected || (isDeselected && this['metrics'].value.length)))
        disabledMetricList.push(metric.name);
      return disabledMetricList;
    }, [])
    if (this['metrics'].value.length <= METRIC_SELECTION_ALLOWED_LIMIT) {
      this['mySelections'] = this['metrics'].value;
    } else {
      this['metrics'].setValue(this['mySelections']);
    }
    costOptimization && this['enableCostOptimization']();
  }
}