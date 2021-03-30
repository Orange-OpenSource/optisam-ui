// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {
    apiAuth = environment.API_AUTH_URL;
    apiUrl = environment.API_URL;
    access_token: string;
    public errorMsg: string;

constructor(private http: HttpClient) { }
  login(email: string, password: string): Observable<any> {
    const model = 'username=' + email + '&password=' + encodeURIComponent(password) + '&grant_type=password';
    return this.http.post<any>(this.apiAuth + '/token' , model )
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
  getAceessRigthypes(): Observable<any> {
   const token = localStorage.getItem('access_token');
    const url = this.apiUrl + '/accounts/admin@test.com';
    return this.http.get<any>(url);
  }
    }
