import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  apiConfigUrl = environment.API_CONFIG_URL;
  apiImportUrl = environment.API_IMPORT_URL;

  constructor(private http: HttpClient) {}

  listConfiguration(EqpType): Observable<any> {
    const url =
      this.apiConfigUrl + '/simulation/config?equipment_type=' + EqpType;
    return this.http.get(url);
  }

  deleteConfiguration(ConfigID): Observable<any> {
    const url = this.apiConfigUrl + '/simulation/config/' + ConfigID;
    return this.http.delete(url);
  }
  // Import service
  uploadConfiguration(data: any): Observable<any> {
    const url = this.apiImportUrl + '/import/config';
    return this.http.post(url, data);
  }

  updateConfiguration(data: any, ConfigID): Observable<any> {
    const url = this.apiImportUrl + '/import/config/' + ConfigID;
    return this.http.put(url, data);
  }
}
