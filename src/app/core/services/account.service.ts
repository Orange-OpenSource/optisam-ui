import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, delay, map } from 'rxjs/operators';
import {
  ErrorResponse,
  ExpenseBodyParams,
  ScopeExpenseResponse,
} from '@core/modals';
import { GroupCompliance } from './group-compliance';
import { fixErrorResponse } from '@core/util/common.functions';

interface URL {
  expenses: string;
  groups: string;
}
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  apiAccount = environment.API_ACCOUNT_URL;
  apiMeta = environment.API_META_URL;
  public name: string;
  public email: string;
  public userName;
  private token: string;
  private lang: string;
  defaultHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  URLs: URL = {
    expenses: `${this.apiAccount}/account/scopes/expenses`,
    groups: `${this.apiAccount}/account/complience/groups`,
  };

  updateLang(res: any) {
    this.token = localStorage.getItem('access_token');
    this.lang = localStorage.getItem('language');
    const emailId = localStorage.getItem('email');
    const param = { locale: res };
    const body = JSON.stringify(param);
    const url = this.apiAccount + '/account/' + emailId;
    return this.http.patch(url, body);
  }

  getUserInfo(email): Observable<any> {
    const url = this.apiAccount + '/account/' + email;
    return this.http.get(url);
  }

  updateProfileDetails(body, userID) {
    const url = this.apiAccount + '/account/' + userID;
    return this.http.put(url, body);
  }

  getScopesList(): Observable<any> {
    const url = this.apiAccount + '/account' + '/scopes';
    return this.http.get(url);
  }

  createScope(body): Observable<any> {
    const url = this.apiAccount + '/account/scopes';
    return this.http.post(url, body);
  }

  deleteScope(scope_id): Observable<any> {
    const url = this.apiAccount + '/account/scope/' + scope_id;
    return this.http.delete(url);
  }

  getVersion(): Observable<any> {
    const url = this.apiMeta + '/version.html';
    return this.http.get(url);
  }

  getAbout(): Observable<any> {
    const url = this.apiMeta + '/about.json';
    return this.http.get(url, { headers: this.defaultHeaders });
  }

  updateExpenditure(
    expenseBody: ExpenseBodyParams
  ): Observable<ErrorResponse | { success: boolean }> {
    if (isNaN(Number(expenseBody.expenses))) {
      return throwError('Not a valid number');
    }
    return this.http
      .post<ErrorResponse | { success: boolean }>(
        this.URLs.expenses,
        expenseBody,
        { headers: this.defaultHeaders }
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getScopeExpense(
    scope: string
  ): Observable<ErrorResponse | ScopeExpenseResponse> {
    return this.http
      .get<ErrorResponse | ScopeExpenseResponse>(
        `${this.URLs.expenses}/${scope}`
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getGroups(): Observable<ErrorResponse | GroupCompliance> {
    // return of<GroupCompliance>({
    //   complience_groups: [
    //     {
    //       group_id: '12',
    //       name: 'test',
    //       scope_code: ['AAK','OFR','BUG'],
    //       scope_name: ['AAKName','OFRName','BUGName']
    //     },
    //     {
    //       group_id: '34',
    //       name: 'test2',
    //       scope_code: ['BAK','OJO'],
    //       scope_name: ['BAKName','OJOName']
    //     }
    //   ]
    // });
    return this.http
      .get<ErrorResponse | GroupCompliance>(this.URLs.groups)
      .pipe(catchError(fixErrorResponse));
  }
}
