import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {
  apiAuth = environment.API_AUTH_URL;
  apiUrl = environment.API_URL;
  access_token: string;
  public errorMsg: string;
  loggedIn: boolean = false;
  private loginToken: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  currentMessage = this.loginToken.asObservable();
  constructor(private http: HttpClient) {
    if (localStorage.getItem('access_token')) {
      const token = JSON.parse(
        atob(localStorage.getItem('access_token').split('.')[1])
      );
      token.exp * 1000 > Date.now()
        ? this.setLoginToken(true)
        : this.setLoginToken(false);
    } else {
      this.setLoginToken(false);
    }
  }

  setLoginToken(status: boolean): void {
    this.loginToken.next(status);
  }

  getLoginToken(): Observable<boolean> {
    return this.loginToken.asObservable();
  }

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

  sendMessage(data: boolean) {
    return this.loginToken.next(data);
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
