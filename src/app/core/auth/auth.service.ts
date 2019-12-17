import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpHeaderResponse, HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {
    apiAuth = environment.API_AUTH_URL;
    apiUrl = environment.API_URL;
    access_token: string;
    grant_type = 'password';
    public Token_key: string;
    public errorMsg: string;

constructor(private http: HttpClient, private router: Router) { }
  login(email: string, pass: string): Observable<any> {
    // const headers = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     'Cache-Control': 'no-cache',
    //   })
    // };
    const data = {email: email, password: pass};
    const model = 'username=' + data.email + '&password=' + data.password + '&grant_type=' + 'password';
    return this.http.post<any>(this.apiAuth + '/token' , model )
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.errorHandler));
      }
    private errorHandler(error) {
      // this.errorMsg = error.error.error_description;
      this.errorMsg = error.error;
       return throwError(this.errorMsg);
  }
  getAceessRigthypes(): Observable<any> {
   const token = localStorage.getItem('access_token');
    const url = this.apiUrl + '/accounts/admin@test.com';
    return this.http.get<any>(url);
  }
    }
