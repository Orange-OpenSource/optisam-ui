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
    return this.http
        .patch(this.apiAccount + '/accounts/' + emailId, body);
  }
  getUpdatedLang (): Observable<any> {
    this.token = localStorage.getItem('access_token');
    this.lang = localStorage.getItem('language');
    const emailId = localStorage.getItem('email');
     return this.http.get(this.apiAccount + '/accounts/' + emailId)
     .pipe(
       (value => {
         return value;
       }),
     );
   }
}
