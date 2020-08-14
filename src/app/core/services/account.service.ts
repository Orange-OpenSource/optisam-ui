// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  apiAccount = environment.API_ACCOUNT_URL;
  public name: string;
  public email: string;
  public userName;
  private token: string;
  private lang: string;
  constructor(private http: HttpClient) { }

  updateLang(res: any) {
    this.token = localStorage.getItem('access_token');
    this.lang = localStorage.getItem('language');
    const emailId = localStorage.getItem('email');
    const param = { 'locale': res};
    const body = JSON.stringify(param);
    const url = this.apiAccount + '/accounts/' + emailId;
    return this.http.patch(url, body);
  }

  getUserInfo(email): Observable<any> {
    const url = this.apiAccount + '/accounts/' + email; 
    return this.http.get(url);
   }

   updateProfileDetails(body, userID) {
     const url = this.apiAccount + '/accounts/' + userID;
     return this.http.put(url, body);
   }

  getScopesList(): Observable<any> {
    const url = this.apiAccount + '/scopes';
    return this.http.get(url);

  }

  createScope(body) {
    const url = this.apiAccount + '/scopes';
    return this.http.post(url, body);
  }
}
