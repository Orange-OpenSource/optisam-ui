// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Products, AggregationDetailsAquiredRights, AggregationDetailsInformation, AggregationDetailsOptions, ProductAggregationApplications, MetricSimulationResponse, MetricSimulationRequest, AggregationProductsInformation} from './product';

@Injectable()
export class ProductService {
  apiUrl = environment.API_PRODUCT_URL;
  apiLicenseUrl = environment.API_URL;
  apiApplicationUrl = environment.API_APPLICATION_URL;
  apiProductUrl = environment.API_PRODUCT_URL;
  apiSimulationUrl = environment.API_CONFIG_URL;
  saveSelectedPName: string;
  saveSelectedSWIDTag: string;
  saveSelectedEditor: string;
  saveSelectedEdition: string;
  details: any;
  token = localStorage.getItem('access_token');
  lang = localStorage.getItem('language');

  constructor(private http: HttpClient) { }

  getProducts(pageSize, length): Observable<Products[]> {
    const url = this.apiUrl + '/products?page_num=' + length + '&page_size=' + pageSize + '&sort_by=name&sort_order=asc';
    return this.http.get<Products[]>(url);
  }
  getMoreDetails(swidTag): Observable<Products[]> {
    return this.http.get<Products[]>(this.apiUrl + '/product/' + swidTag);
  }
  getOptionsDetails(swidTag): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/product/' + swidTag + '/options');
  }
  getAcquiredRightDetails(swidTag): Observable<any> {
    return this.http.get<any>(this.apiLicenseUrl + '/product/' + swidTag + '/acquiredrights');
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
      '&sort_by=' + sort_by + '&sort_order=' + sort_order + filteringCondition;
    return this.http.get<Products[]>(url);
  }
  getprodApplications(swidTag, pageSize, length, sort_order, sort_by): Observable<Applications[]> {
    const url = this.apiApplicationUrl + '/applications?page_num=' +
    length + '&page_size=' + pageSize + '&sort_by='+sort_by+'&sort_order='+sort_order+'&search_params.product_id.filteringkey='+swidTag;
    // const url = this.apiUrl + '/products/' + swidTag + '/applications?page_num=' +
    //   length + '&page_size=' + pageSize + '&sort_by=name&sort_order=asc';
    return this.http.get<Applications[]>(url);
  }
  getprodInstances(swidTag, app_id, pageSize, length): Observable<Applications[]> {
    const url = this.apiApplicationUrl + '/instances' + '?page_num=' +
    length + '&page_size=' + pageSize + '&sort_by=instance_id&sort_order=asc&search_params.product_id.filter_type=1&search_params.product_id.filteringkey='
    + swidTag + '&search_params.application_id.filter_type=1&search_params.application_id.filteringkey='+app_id;
    // const url = this.apiUrl + '/products/' + swidTag + '/applications/' + app_id + '/instances' + '?page_num=' +
    //   length + '&page_size=' + pageSize + '&sort_by=NUM_PRODUCTS&sort_order=ASC';
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
    '&sort_by=' + sort_by + '&sort_order=' + sort_order + filteringCondition + '&search_params.product_id.filteringkey='+swidTag;
    // const url = this.apiUrl + '/products/' + swidTag + '/applications?page_num=' + length + '&page_size=' + pageSize +
    //   '&sort_by=' + sort_by + '&sort_order=' + sort_order + filteringCondition;
    return this.http.get<Applications[]>(url);
  }
  getInstancesSort(swidTag, key, pageSize, length, sort_by, sort_order): Observable<Applications[]> {
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url = this.apiApplicationUrl + '/instances' + '?page_num=' +
    length + '&page_size=' + pageSize +  '&sort_by=' + sort_by + '&sort_order=' + sort_order;
    // const url = this.apiUrl + '/products/' + swidTag + '/applications/' + key + '/instances' + '?page_num=' +
    //   length + '&page_size=' + pageSize +  '&sort_by=' + sort_by + '&sort_order=' + sort_order;
    return this.http.get<Applications[]>(url);
  }

  getAggregationProducts(query: string): Observable<any> {
    // const url = this.apiUrl + '/products/aggregations/productview' + query;
    const url = this.apiUrl + '/products/aggregations' + query;
    return this.http.get<any>(url);
  }

  getAggregationOptions(aggregationID: string): Observable<AggregationDetailsOptions> {
    const url = this.apiUrl + '/products/aggregations/productview/' + aggregationID + '/options';
    return this.http.get<AggregationDetailsOptions>(url);
  }

  getAggregationAquiredRights(aggregationName: string): Observable<AggregationDetailsAquiredRights> {
    const url = this.apiLicenseUrl + '/products/aggregations/productview/' + aggregationName + '/acquiredrights';
    return this.http.get<AggregationDetailsAquiredRights>(url);
  }

  getAggregationInfoDetails(aggregationID: string): Observable<AggregationDetailsInformation> {
    const url = this.apiUrl + '/products/aggregations/productview/' + aggregationID + '/details';
    return this.http.get<AggregationDetailsInformation>(url);
  }

  getAggregationProductDetails(aggregationID: string): Observable<AggregationProductsInformation> {
    const url = this.apiUrl + '/products/aggregations/' + aggregationID + '/products';
    return this.http.get<AggregationProductsInformation>(url);
  }

  getProductAggregationApplications(aggregationName: string, query: string): Observable<ProductAggregationApplications> {
    const url = this.apiUrl + '/products/aggregations/' + aggregationName + '/applications' + query;
    return this.http.get<ProductAggregationApplications>(url);
  }

  metricSimulation(body: MetricSimulationRequest): Observable<MetricSimulationResponse> {
    const url = this.apiSimulationUrl + '/simulation/metric';
    return this.http.post<MetricSimulationResponse>(url, body);
  }

  getEditorList(query:any) {
    const url =  this.apiProductUrl + '/editors' + query;
    return this.http.get<any>(url);
  }

  getProductList(query:any) {
    const url = this.apiProductUrl + '/editors/products' + query;
    return this.http.get<any>(url);
  }
}
