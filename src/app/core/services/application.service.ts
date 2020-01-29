// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApplicationService {
  apiUrl = environment.API_URL;
  details: any;
  token = localStorage.getItem('access_token');
  lang = localStorage.getItem('language');

  constructor(private http: HttpClient) { }

  getApplications(pageSize, length): Observable<Applications[]> {
    const url = this.apiUrl + '/applications?page_num=' + length + '&page_size=' + pageSize + '&sort_by=name&sort_order=asc';
    return this.http.get<Applications[]>(url);
  }
  getApplicationsbySort(pageSize, length, sort_by, sort_order): Observable<Applications[]> {
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url = this.apiUrl + '/applications?page_num=' + length + '&page_size=' + pageSize +
      '&sort_by=' + sort_by + '&sort_order=' + sort_order;
    return this.http.get<Applications[]>(url);
  }
  getproductdetails(key): Observable<Applications[]> {
    const url = this.apiUrl + '/applications/' + key + '/products';
    return this.http.get<Applications[]>(url);
  }
  filteredData(length, pageSize, sort_by, sort_order, filteringkey1, filteringkey2): Observable<Applications[]> {
    let filteringCondition = '';

    if (filteringkey1 !== '' && filteringkey1 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.name.filteringkey=' + filteringkey1;
    }

    if (filteringkey2 !== '' && filteringkey2 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.application_owner.filteringkey=' + filteringkey2;
    }
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url = this.apiUrl + '/applications?page_num=' + length + '&page_size=' + pageSize +
      '&sort_by=' + sort_by + '&sort_order=' + sort_order + filteringCondition;
    return this.http.get<Applications[]>(url);
  }
}
