// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Products, AggregationDetailsAquiredRights, AggregationDetailsInformation, AggregationDetailsOptions, ProductAggregationApplications, MetricSimulationResponse, MetricSimulationRequest, AggregationProductsInformation} from './product';
import { Applications } from './application';

@Injectable()
export class ProductService {
  apiUrl = environment.API_PRODUCT_URL;
  apiLicenseUrl = environment.API_URL;
  apiApplicationUrl = environment.API_APPLICATION_URL;
  apiSimulationUrl = environment.API_CONFIG_URL;
  defaultHeaders: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  getProducts(pageSize, length): Observable<Products[]> {
    const url = this.apiUrl + '/products?page_num=' + length + '&page_size=' + pageSize + '&sort_by=name&sort_order=asc' + '&scopes=' + localStorage.getItem('scope');
    return this.http.get<Products[]>(url);
  }
  getMoreDetails(swidTag): Observable<Products[]> {
    return this.http.get<Products[]>(this.apiUrl + '/product/' + swidTag + '?scopes=' + localStorage.getItem('scope'));
  }
  getOptionsDetails(swidTag): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/product/' + swidTag + '/options?scopes=' + localStorage.getItem('scope'));
  }
  getAcquiredRightDetails(swidTag, scope:string ,appID?:string): Observable<any> {
    if(appID && appID != null) {
      return this.http.get<any>(this.apiLicenseUrl + '/licenses/applications/' + appID + '/products/' + swidTag + '?scope=' + localStorage.getItem('scope'));
    }
    else {
      return this.http.get<any>(this.apiLicenseUrl + '/product/' + swidTag + '/acquiredrights?scope=' + (scope?scope:localStorage.getItem('scope')));
    }
  }
  filteredData(length, pageSize, sort_by, sort_order, filteringkey1, filteringkey2, filteringkey3): Observable<Products[]> {
    let filteringCondition = '';
    if (filteringkey1 !== '' && filteringkey1 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.swidTag.filteringkey=' + filteringkey1;
    }

    if (filteringkey2 !== '' && filteringkey2 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.name.filteringkey=' + filteringkey2;
    }
    if (filteringkey3 !== '' && filteringkey3 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.editor.filteringkey=' + filteringkey3;
    }
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url = this.apiUrl + '/products?page_num=' + length + '&page_size=' + pageSize +
      '&sort_by=' + sort_by + '&sort_order=' + sort_order + '&scopes=' + localStorage.getItem('scope') + filteringCondition;
    return this.http.get<Products[]>(url);
  }
  getprodApplications(swidTag, pageSize, length, sort_order, sort_by): Observable<Applications[]> {
    const url = this.apiApplicationUrl + '/applications?page_num=' +
    length + '&page_size=' + pageSize + '&sort_by='+sort_by+'&sort_order='+sort_order + '&scopes=' + localStorage.getItem('scope') +'&search_params.product_id.filteringkey='+swidTag;
    return this.http.get<Applications[]>(url);
  }
  getprodInstances(swidTag, app_id, pageSize, length): Observable<Applications[]> {
    let url;
    // For Products->Application->Instance
    if(swidTag && swidTag != null) {
      url = this.apiApplicationUrl + '/instances' + '?page_num=' +
      length + '&page_size=' + pageSize + '&sort_by=instance_id&sort_order=asc'+ '&scopes=' + localStorage.getItem('scope') +'&search_params.product_id.filter_type=1&search_params.product_id.filteringkey='
      + swidTag + '&search_params.application_id.filter_type=1&search_params.application_id.filteringkey='+app_id;
    } 
    // For Application->Instances
    else {
      url = this.apiApplicationUrl + '/instances' + '?page_num=' +
      length + '&page_size=' + pageSize + '&sort_by=instance_id&sort_order=asc'+ '&scopes=' + localStorage.getItem('scope')+'&search_params.application_id.filter_type=1&search_params.application_id.filteringkey='+app_id;
    }
    return this.http.get<Applications[]>(url);
  }
  prodAplfilteredData(swidTag, length, pageSize, sort_by, sort_order, filteringkey1, filteringkey2): Observable<Applications[]> {
    let filteringCondition = '';

    if (filteringkey1 !== '' && filteringkey1 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.name.filteringkey=' + filteringkey1;
    }

    if (filteringkey2 !== '' && filteringkey2 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.owner.filteringkey=' + filteringkey2;
    }
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url = this.apiApplicationUrl + '/applications?page_num=' + length + '&page_size=' + pageSize +
    '&sort_by=' + sort_by + '&sort_order=' + sort_order + '&scopes=' + localStorage.getItem('scope') + filteringCondition + '&search_params.product_id.filteringkey='+swidTag;
    return this.http.get<Applications[]>(url);
  }
  getInstancesSort(swidTag, app_id, pageSize, length, sort_by, sort_order): Observable<Applications[]> {
    if (sort_order === '') {
      sort_order = 'asc';
    }
    let url;
    // For Products->Application->Instance
    if(swidTag && swidTag != null) {
      url = this.apiApplicationUrl + '/instances' + '?page_num=' +
      length + '&page_size=' + pageSize + '&sort_by=' + sort_by + '&sort_order=' + sort_order + '&scopes=' + localStorage.getItem('scope') + '&search_params.product_id.filter_type=1&search_params.product_id.filteringkey='
      + swidTag + '&search_params.application_id.filter_type=1&search_params.application_id.filteringkey='+app_id;
    } 
    // For Application->Instances
    else {
      url = this.apiApplicationUrl + '/instances' + '?page_num=' +
      length + '&page_size=' + pageSize + '&sort_by=' + sort_by + '&sort_order=' + sort_order + '&scopes=' + localStorage.getItem('scope') + '&search_params.application_id.filter_type=1&search_params.application_id.filteringkey='+app_id;
    }
    return this.http.get<Applications[]>(url);
  }

  getAggregationProducts(query: string): Observable<any> {
    const url = this.apiUrl + '/products/aggregations' + query + '&scopes=' + localStorage.getItem('scope');
    return this.http.get<any>(url);
  }

  getAggregationOptions(aggregationID: string): Observable<AggregationDetailsOptions> {
    const url = this.apiUrl + '/products/aggregations/productview/' + aggregationID + '/options' + '?scopes=' + localStorage.getItem('scope');
    return this.http.get<AggregationDetailsOptions>(url);
  }

  getAggregationAquiredRights(aggregationName: string): Observable<AggregationDetailsAquiredRights> {
    const url = this.apiLicenseUrl + '/products/aggregations/productview/' + aggregationName + '/acquiredrights?scope=' + localStorage.getItem('scope');
    return this.http.get<AggregationDetailsAquiredRights>(url);
  }

  getAggregationInfoDetails(aggregationID: string): Observable<AggregationDetailsInformation> {
    const url = this.apiUrl + '/products/aggregations/productview/' + aggregationID + '/details' + '?scopes=' + localStorage.getItem('scope');
    return this.http.get<AggregationDetailsInformation>(url);
  }

  getAggregationProductDetails(aggregationID: string): Observable<AggregationProductsInformation> {
    const url = this.apiUrl + '/products/aggregations/' + aggregationID + '/products' + '?scopes=' + localStorage.getItem('scope');
    return this.http.get<AggregationProductsInformation>(url);
  }

  getProductAggregationApplications(swidTags: string[], query: string): Observable<ProductAggregationApplications> {
    let url = this.apiApplicationUrl + '/applications' + query + '&scopes=' + localStorage.getItem('scope');
    for(let i=0; i<swidTags.length; i++){
      url += ('&search_params.product_id.filteringkey_multiple=' + swidTags[i]);
    }
    return this.http.get<ProductAggregationApplications>(url);
  }

  metricSimulation(body: MetricSimulationRequest): Observable<MetricSimulationResponse> {
    const url = this.apiSimulationUrl + '/simulation/metric';
    return this.http.post<MetricSimulationResponse>(url, body);
  }

  getEditorList(query:any) {
    const url =  this.apiUrl + '/editors' + query;
    return this.http.get<any>(url);
  }

  getProductList(query:any) {
    const url = this.apiUrl + '/editors/products' + query;
    return this.http.get<any>(url);
  }

  // Aggregation APIs
  getEditorListAggr(scope:any) {
    const url = this.apiUrl + '/aggregations/editors?scope='+scope;
    return this.http.get<any>(url, {headers: this.defaultHeaders});
  }

  getMetricListAggr(scope:any) {
    const url = this.apiUrl + '/aggregations/metrics?scope='+scope;
    return this.http.get<any>(url, {headers: this.defaultHeaders});
  }

  getProductListAggr(query: string) {
    const url = this.apiUrl + '/aggregations/products' + query;
    return this.http.get<any>(url, {headers: this.defaultHeaders});
  }

  saveAggregation(data: any) {
    const url = this.apiUrl + '/aggregations';
    return this.http.post<any>(url, data, {headers: this.defaultHeaders});
  }

  getAggregations() {
    const url = this.apiUrl + '/aggregations?scopes=' + localStorage.getItem('scope');
    return this.http.get<any>(url, {headers: this.defaultHeaders});
  }

  deleteAggregation(id: string) {
    const url = this.apiUrl + '/aggregations/' + id;
    return this.http.delete<any>(url, {headers: this.defaultHeaders});
  }

  updateAggregation(name: string, data: any) {
    const url = this.apiUrl + '/aggregations/' + name;
    return this.http.put<any>(url, data, {headers: this.defaultHeaders});
  }

  // Acquired Rights

  getAcquiredrights(pageSize, length) {
    const url = this.apiUrl + '/acqrights?page_num=' + length + '&page_size=' + pageSize + '&sort_by=ENTITY&sort_order=asc' + '&scopes=' + localStorage.getItem('scope');
    return this.http.get(url);
    }

  filteredDataAcqRights(length, pageSize, sort_by, sort_order, filteringkey1, filteringkey2,
    filteringkey3, filteringkey4 , filteringkey5) {
    let filteringCondition = '';
    if (filteringkey1 !== '' && filteringkey1 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.swidTag.filteringkey=' + filteringkey1;
    }

    if (filteringkey2 !== '' && filteringkey2 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.SKU.filteringkey=' + filteringkey2;
    }
    if (filteringkey3 !== '' && filteringkey3 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.editor.filteringkey=' + filteringkey3;
    }
    if (filteringkey4 !== '' && filteringkey4 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.productName.filteringkey=' + filteringkey4;
    }
    if (filteringkey5 !== '' && filteringkey5 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.metric.filteringkey=' + filteringkey5;
    }
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url = this.apiUrl + '/acqrights?page_num=' + length + '&page_size=' + pageSize +
      '&sort_by=' + sort_by + '&sort_order=' + sort_order + '&scopes=' + localStorage.getItem('scope') + filteringCondition;
    return this.http.get(url);
  }

  getAggregationAcquiredRights(query: string): Observable<any> {
    const url = this.apiUrl + '/acqrights/aggregations' + query + '&scopes=' + localStorage.getItem('scope');
    return this.http.get<any>(url);
  }

  getProductsByAggrID(ID) {
    const url = this.apiUrl + '/acqrights/aggregations/' + ID + '/records?scopes=' + localStorage.getItem('scope');
    return this.http.get<any>(url);
  }
  
  // Dashboard- Overview
  getProductsOverview(scope) {
    const url = this.apiUrl + '/dashboard/overview?scope=' + scope;
    return this.http.get<any>(url);
  }

  getProductsPerEditor(scope) {
    const url = this.apiUrl + '/dashboard/editors/products?scope=' + scope;
    return this.http.get<any>(url);
  }

  getSwLicComposition(scope) {
    const url = this.apiUrl + '/dashboard/metrics/products?scope=' + scope;
    return this.http.get<any>(url);
  }

  getComplianceAlert(scope) {
    const url = this.apiUrl + '/dashboard/alert/compliance?scope=' + scope;
    return this.http.get<any>(url);
  }
  
  // getQualityAlert(scope) {
  //   const url = this.apiUrl + '/dashboard/alert/dataquality?scope=' + scope;
  //   return this.http.get<any>(url);
  // }
  
  // Dashboard- Compliance
  getProductsComplianceCounterfeiting(scope, editor): Observable<any> {
    const url = this.apiUrl + '/dashboard/compliance/counterfeiting?scope=' + scope + '&editor=' + editor;
    return this.http.get<any>(url);
  }
  getProductsComplianceOverdeployment(scope, editor): Observable<any> {
    const url = this.apiUrl + '/dashboard/compliance/overdeployment?scope=' + scope + '&editor=' + editor;
    return this.http.get<any>(url);
  }

  // Dashboard- Quality
  getProductsQualityInfo(scope):Observable<any> {
    const url = this.apiUrl + '/dashboard/product/quality?scope=' + scope;
    return this.http.get<any>(url);
  }
  getProductsQualityProducts(scope):Observable<any> {
    const url = this.apiUrl + '/dashboard/quality/products?scope=' + scope;
    return this.http.get<any>(url);
  }
}
