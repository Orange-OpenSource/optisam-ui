// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MetricService {
  apiMetricUrl = environment.API_METRIC_URL;
  constructor(private httpClient: HttpClient) { }
  
  getMetricList(scope?:string) {
    let url;
    if(scope) {
      url = this.apiMetricUrl + '/metric?scopes='+ scope;
    }
    else {
      url = this.apiMetricUrl + '/metric?scopes='+localStorage.getItem('scope');
    }
    return this.httpClient.get<any>(url);
  }
  getMetricType(scopes:string) {
    const url = this.apiMetricUrl + '/metric/types?scopes='+scopes;
    return this.httpClient.get<any>(url);
  }
  createMetric(metricData, href) {
      return this.httpClient.post<any>(this.apiMetricUrl + href, metricData)
        .pipe(
          map(res => {
            return res;
          }));
  }
  getMetricDetails(metricType, metricName) {
    const url = this.apiMetricUrl + '/metric/config?metric_info.type=' + metricType 
                + '&metric_info.name=' + metricName +'&scopes='+localStorage.getItem('scope');
    return this.httpClient.get<any>(url);
  }
}
