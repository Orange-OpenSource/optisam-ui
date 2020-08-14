// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  apiConfigUrl = environment.API_CONFIG_URL;

  constructor(private http: HttpClient) { }

  listConfiguration(EqpType): Observable<any> {
    const url = this.apiConfigUrl + '/config?equipment_type=' + EqpType;
    return this.http.get(url);
  }

  uploadConfiguration(data: any): Observable<any> {
    const url = this.apiConfigUrl +'/config';
    return this.http.post(url, data);
  }

  updateConfiguration(data:any, ConfigID): Observable<any> {
    const url = this.apiConfigUrl + '/config/' + ConfigID;
    return this.http.put(url, data);
  }

  deleteConfiguration(ConfigID): Observable<any> {
    const url = this.apiConfigUrl +'/config/' + ConfigID;
    return this.http.delete(url);
  }
}
