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

  constructor(private http: HttpClient) { }
  // Data Management
  getUploadedData(query):Observable<any> {
    const url = environment.API_DPS_URL + '/uploads/data' + query + '&scope=' + localStorage.getItem('scope');
    return this.http.get(url);
  }
  getUploadedMetadata(query):Observable<any> {
    const url = environment.API_DPS_URL + '/uploads/metadata' + query + '&scope=' + localStorage.getItem('scope');
    return this.http.get(url);
  }

  uploadDataManagementFiles(data: any, type): Observable<any> {
    const url = environment.API_IMPORT_URL + '/import/' + type;
    return this.http.post(url, data, {responseType: 'text'});
  }

  getFailedRecordsInfo(upload_id, pageIndex, pageSize): Observable<any> {
    let url = environment.API_DPS_URL + '/failed/data?scope=' + localStorage.getItem('scope') + 
    '&upload_id=' + upload_id + '&page_num=' + pageIndex + '&page_size=' + pageSize;
    return this.http.get(url);
  }

  deleteInventory():Observable<any> {
    let url = environment.API_DPS_URL + '/data/' + localStorage.getItem('scope');
    return this.http.delete(url);
  }
  
  getUploadedGlobalData(query):Observable<any> {
    const url = environment.API_DPS_URL + '/uploads/globaldata' + query + '&scope=' + localStorage.getItem('scope');
    return this.http.get(url);
  }

  // Dashboard- Quality
  getDevelopmentRates(scope, frequency, noOfDataPoints) {
    const url = environment.API_DPS_URL + '/dashboard/quality?scope=' + scope + '&frequency=' + frequency + '&noOfDataPoints=' + noOfDataPoints;
    return this.http.get<any>(url);
  }

  getFailureRate(scope) {
    const url = environment.API_DPS_URL + '/dashboard/quality/datafailurerate?scope=' + scope;
    return this.http.get<any>(url);
  }

  getFailureReason(scope) {
    const url = environment.API_DPS_URL + '/dashboard/quality/failurereasonsratio?scope=' + scope;
    return this.http.get<any>(url);
  }
}
