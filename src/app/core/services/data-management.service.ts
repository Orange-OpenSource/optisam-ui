// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataManagementService {
  apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }
  
  getUploadedData(query):Observable<any> {
    const url = environment.API_DPS_URL + '/uploads/data' + query;
    return this.http.get(url);
  }
  getUploadedMetadata(query):Observable<any> {
    const url = environment.API_DPS_URL + '/uploads/metadata' + query;
    return this.http.get(url);
  }

  uploadDataManagementFiles(data: any, type): Observable<any> {
    const url = environment.API_IMPORT_URL + '/import/' + type;
    return this.http.post(url, data, {responseType: 'text'});
  }
}
