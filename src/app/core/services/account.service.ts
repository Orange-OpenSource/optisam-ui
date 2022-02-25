import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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
  constructor(private http: HttpClient) {}

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
    return this.http.get(url);
  }
}
