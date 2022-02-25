import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {
  apiAuth = environment.API_AUTH_URL;
  apiUrl = environment.API_URL;
  access_token: string;
  public errorMsg: string;

  constructor(private http: HttpClient) {}
  login(email: string, password: string): Observable<any> {
    const model =
      'username=' +
      email +
      '&password=' +
      encodeURIComponent(password) +
      '&grant_type=password';
    return this.http.post<any>(this.apiAuth + '/token', model).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.errorHandler)
    );
  }
  private errorHandler(error) {
    this.errorMsg = error.error;
    return throwError(this.errorMsg);
  }
  getAceessRigthypes(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const url = this.apiUrl + '/account/admin@test.com';
    return this.http.get<any>(url);
  }
}
