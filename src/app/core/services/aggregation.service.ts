// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AggregationService {
  token = localStorage.getItem('access_token');
  lang = localStorage.getItem('language');
  defaultHeaders: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }

  getEditorList() {
    const url = environment.API_URL + '/editors';
    return this.http.get<any>(url, {headers: this.defaultHeaders});
  }

  getMetricList() {
    const url = environment.API_URL + '/metric';
    return this.http.get<any>(url, {headers: this.defaultHeaders});
  }

  getProductList(query: string) {
    const url = environment.API_URL + '/products' + query;
    return this.http.get<any>(url, {headers: this.defaultHeaders});
  }

  saveAggregation(data: any) {
    const url = environment.API_URL + '/products/aggregations';
    return this.http.post<any>(url, data, {headers: this.defaultHeaders});
  }

  getAggregations(query: any) {
    const url = environment.API_URL + '/products/aggregations' + query;
    return this.http.get<any>(url, {headers: this.defaultHeaders});
  }
}
