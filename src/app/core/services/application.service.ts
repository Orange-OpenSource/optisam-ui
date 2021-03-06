// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Applications } from './application';

@Injectable()
export class ApplicationService {
  apiUrl = environment.API_APPLICATION_URL;
  apiUrlProduct = environment.API_PRODUCT_URL;
  details: any;
  token = localStorage.getItem('access_token');
  lang = localStorage.getItem('language');

  constructor(private http: HttpClient) { }

  getApplications(pageSize, length): Observable<Applications[]> {
    const url = this.apiUrl + '/applications?page_num=' + length + '&page_size=' + pageSize + '&sort_by=name&sort_order=asc&scopes=' + localStorage.getItem('scope');
    return this.http.get<Applications[]>(url);
  }
  getApplicationsbySort(pageSize, length, sort_by, sort_order): Observable<Applications[]> {
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url = this.apiUrl + '/applications?page_num=' + length + '&page_size=' + pageSize +
      '&sort_by=' + sort_by + '&sort_order=' + sort_order + '&scopes=' + localStorage.getItem('scope');
    return this.http.get<Applications[]>(url);
  }
  getproductdetails(key,pageSize, length, sort_by, sort_order): Observable<Applications[]> {
    let filteringCondition = '';
    if (key !== '' && key !== undefined) {
      filteringCondition = filteringCondition + '&search_params.application_id.filter_type=1&search_params.application_id.filteringkey=' + key;
    }
    const url = this.apiUrlProduct + '/products?page_num=' + length + '&page_size=' + pageSize +
      '&sort_by=' + sort_by + '&sort_order=' + sort_order + '&scopes=' + localStorage.getItem('scope') + filteringCondition;
    return this.http.get<Applications[]>(url);
  }
  filteredData(length, pageSize, sort_by, sort_order, filteringkey1, filteringkey2, filteringkey3, filteringkey4): Observable<Applications[]> {
    let filteringCondition = '';

    if (filteringkey1 !== '' && filteringkey1 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.name.filteringkey=' + filteringkey1;
    }

    if (filteringkey2 !== '' && filteringkey2 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.owner.filteringkey=' + filteringkey2;
    }

    if (filteringkey3 !== '' && filteringkey3 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.domain.filteringkey=' + filteringkey3;
    }

    if (filteringkey4 !== '' && filteringkey4 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.obsolescence_risk.filteringkey=' + filteringkey4;
    }
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url = this.apiUrl + '/applications?page_num=' + length + '&page_size=' + pageSize +
      '&sort_by=' + sort_by + '&sort_order=' + sort_order + '&scopes=' + localStorage.getItem('scope') + filteringCondition;
    return this.http.get<Applications[]>(url);
  }
  // Obsolescence APIs
  getDomainsMeta(): Observable<any> {
    const url = this.apiUrl + '/applications/domains?scope=' + localStorage.getItem('scope');
    return this.http.get(url);
  }

  getCriticityMeta(): Observable<any> {
    const url = this.apiUrl + '/Obsolescence/meta/domaincriticity';
    return this.http.get(url);
  }

  getMaintenanceCriticityMeta(): Observable<any> {
    const url = this.apiUrl + '/Obsolescence/meta/maintenancecriticity';
    return this.http.get(url);
  }

  getRisksMeta(): Observable<any> {
    const url = this.apiUrl + '/Obsolescence/meta/risks';
    return this.http.get(url);
  }

  getDomainsPerCriticity(): Observable<any> {
    const url = this.apiUrl + '/obsolescence/domains?scope=' + localStorage.getItem('scope');
    return this.http.get(url);
  }

  getMaintenanceCriticity(): Observable<any> {
    const url = this.apiUrl + '/obsolescence/maintenance?scope=' + localStorage.getItem('scope');
    return this.http.get(url);
  }

  getRiskMatrix(): Observable<any> {
    const url = this.apiUrl + '/obsolescence/matrix?scope=' + localStorage.getItem('scope');
    return this.http.get(url);
  }

  saveDomainCriticity(body): Observable<any> {
    const url = this.apiUrl + '/obsolescence/domains';
    return this.http.post(url, body);
  }

  saveMaintenanceCriticity(body): Observable<any> {
    const url = this.apiUrl + '/obsolescence/maintenance';
    return this.http.post(url, body);
  }

  saveRiskMatrix(body): Observable<any> {
    const url = this.apiUrl + '/obsolescence/matrix';
    return this.http.post(url, body);
  }
}
