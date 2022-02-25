import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
} from './product';
import { Applications } from './application';
import {
  AcquiredRightsAggregation,
  AggregationEditorParams,
  AggregationProductsParams,
  AcquiredRightAggregationBody,
  AcquiredRightAggregationUpdateParams,
} from '../../modules/home/pages/acquiredrights/acquired-rights.modal';

@Injectable()
export class ProductService {
  apiUrl = environment.API_PRODUCT_URL;
  apiLicenseUrl = environment.API_URL;
  apiApplicationUrl = environment.API_APPLICATION_URL;
  apiSimulationUrl = environment.API_CONFIG_URL;
  defaultHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  common: any = {
    updateAcquiredRightAggregation: `${this.apiUrl}/product/aggregations`,
  };

  constructor(private http: HttpClient) {}

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
      '/product/aggregations/productview/' +
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
      '/license/product/' +
      swidTag +
      '/computationdetails' +
      '?sku=' +
      sku +
      '&scope=' +
      localStorage.getItem('scope');
    return this.http.get<MetricComputationDetails>(url);
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
    const url = this.apiUrl + '/product/editors' + query;
    return this.http.get<any>(url);
  }

  getProductList(query: any) {
    const url = this.apiUrl + '/product/editors/products' + query;
    return this.http.get<any>(url);
  }

  // Aggregation APIs
  getEditorListAggr(scope: any) {
    const url = this.apiUrl + '/product/aggregations/editors?scope=' + scope;
    return this.http.get<any>(url, { headers: this.defaultHeaders });
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

  saveAggregation(data: any) {
    const url = this.apiUrl + '/product/aggregations';
    return this.http.post<any>(url, data, { headers: this.defaultHeaders });
  }

  getAggregations() {
    const url =
      this.apiUrl +
      '/product/aggregations?scope=' +
      localStorage.getItem('scope');
    return this.http.get<AcquiredRightsAggregation>(url, {
      headers: this.defaultHeaders,
    });
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
    length,
    pageSize,
    sort_by,
    sort_order,
    filteringkey1,
    filteringkey2,
    filteringkey3,
    filteringkey4,
    filteringkey5
  ) {
    let filteringCondition = '';
    if (filteringkey1 !== '' && filteringkey1 !== undefined) {
      filteringCondition =
        filteringCondition +
        '&search_params.swidTag.filteringkey=' +
        encodeURIComponent(filteringkey1);
    }

    if (filteringkey2 !== '' && filteringkey2 !== undefined) {
      filteringCondition =
        filteringCondition + '&search_params.SKU.filteringkey=' + filteringkey2;
    }
    if (filteringkey3 !== '' && filteringkey3 !== undefined) {
      filteringCondition =
        filteringCondition +
        '&search_params.editor.filteringkey=' +
        filteringkey3;
    }
    if (filteringkey4 !== '' && filteringkey4 !== undefined) {
      filteringCondition =
        filteringCondition +
        '&search_params.productName.filteringkey=' +
        encodeURIComponent(filteringkey4);
    }
    if (filteringkey5 !== '' && filteringkey5 !== undefined) {
      filteringCondition =
        filteringCondition +
        '&search_params.metric.filteringkey=' +
        filteringkey5;
    }
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url =
      this.apiUrl +
      '/product/acqrights?page_num=' +
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
    return this.http.get(url);
  }

  getAggregationAcquiredRights(query: string): Observable<any> {
    const url =
      this.apiUrl +
      '/product/aggregated_acqrights' +
      query +
      '&scopes=' +
      localStorage.getItem('scope');
    return this.http.get<any>(url);
  }

  createAcquiredRight(body): Observable<any> {
    const url = this.apiUrl + '/product/acqright';
    return this.http.post(url, body);
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
    return this.http.put<any>(url, body);
  }

  getProductsByAggrID(aggname) {
    const url =
      this.apiUrl +
      '/product/expand/aggregation_acqrights' +
      '?scope=' +
      localStorage.getItem('scope') +
      '&aggregation_name=' +
      aggname;
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
    const url = `${this.apiUrl}/product/aggregations`;
    return this.http.post<any>(url, data, { headers: this.defaultHeaders });
  }

  updateAcquiredRightAggregation(
    ID: number,
    data: AcquiredRightAggregationBody
  ): Observable<any> {
    return this.http.put<any>(
      `${this.common.updateAcquiredRightAggregation}/${ID}`,
      data,
      { headers: this.defaultHeaders }
    );
  }
}
