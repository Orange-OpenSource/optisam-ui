// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  apiUrl = environment.API_ACCOUNT_URL;
  token = localStorage.getItem('access_token');
  lang = localStorage.getItem('language');
  public errorMsg: string;
  constructor(private http: HttpClient) { }
  getGroups(): Observable<any> {
  const url = this.apiUrl + '/admin/groups';
  // const url = 'http://localhost:3002/groups';
    return this.http.get<any>(url);
  }
  updateAttribute(id, attributeData): Observable<any> {
    const url = this.apiUrl + '/equipments/types/' + id ;
    return this.http.patch<any>(url, attributeData);
  }
  getDirectGroups(): Observable<any> {
    const url = this.apiUrl + '/admin/direct_groups';
    // const url = 'http://localhost:3002/direct_groups';
    return this.http.get<any>(url);
  }
  getChildGroups(id): Observable<any> {
   const url = this.apiUrl + '/admin/groups/' + id + '/groups';
   //  const url = 'http://localhost:3002/groupsByID';
     return this.http.get<any>(url);

  }

  deleteGroups(id): Observable<any> {
 //   const url = this.apiUrl + 'admin/direct_groups admin/groups/{group_id}';
    const url = this.apiUrl + '/admin/groups/' + id ;
    return this.http.delete<any>(url);
  }
  editName(id, data): Observable<any> {
   // const url = this.apiUrl + 'admin/direct_groups';
     const url = this.apiUrl + '/admin/groups/' + id ;
    return this.http.put<any>(url, data);
  }
  getGrpUserList(grpId): Observable<any> {
    // const url = this.apiUrl + 'admin/direct_groups';
      const url = this.apiUrl + '/admin/groups/' + grpId + '/users' ;
     return this.http.get<any>(url);
   }
   deleteGrpUser(grpId, data): Observable<any> {
    // const url = this.apiUrl + 'admin/direct_groups';
      const url = this.apiUrl + '/admin/groups/' + grpId + '/users/delete' ;
     return this.http.put<any>(url, data);
   }
   addGrpUser(grpId, data): Observable<any> {
    // const url = this.apiUrl + 'admin/direct_groups';
      const url = this.apiUrl + '/admin/groups/' + grpId + '/users/add' ;
     return this.http.put<any>(url, data);
   }
   getAllUserList(): Observable<any> {
    // const url = this.apiUrl + 'admin/direct_groups';
      const url = this.apiUrl + '/accounts' ;
     return this.http.get<any>(url);
   }
   changePassword(data): Observable<any> {
    return this.http.put<any>(this.apiUrl + '/account/changepassword', data)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.errorHandler));
  }
  createGroup(groupData): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/admin/groups', groupData)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.errorHandler));
  }
  createUser(groupData): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/accounts', groupData)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.errorHandler));
  }
  private errorHandler(error) {
    this.errorMsg = error.error;
    return throwError(this.errorMsg);
  }
}
