import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataManagementService {
  apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  uploadDataManagementFile(data: any): Observable<any> {
    const url = environment.API_IMPORT_URL + '/import';
    return this.http.post(url, data, {responseType: 'text'});
  }
}
