import { CommonService } from '@core/services/common.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LOCAL_KEYS } from '@core/util/constants/constants';

type URLS = {
  config: string;
};

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  apiConfigUrl = environment.API_CONFIG_URL;
  apiImportUrl = environment.API_IMPORT_URL;
  URLS: URLS = {
    config: `${this.apiConfigUrl}/simulation/config`,
  };

  constructor(private http: HttpClient, private cs: CommonService) {}

  listConfiguration(EqpType): Observable<any> {
    let params = new HttpParams()
      .set('equipment_type', EqpType)
      .set('scope', this.cs.getLocalData(LOCAL_KEYS.SCOPE));
    return this.http.get(this.URLS.config, { params });
  }

  deleteConfiguration(ConfigID): Observable<any> {
    let params = new HttpParams().set(
      'scope',
      this.cs.getLocalData(LOCAL_KEYS.SCOPE)
    );
    const url = this.URLS.config + '/' + ConfigID;
    return this.http.delete(url, { params });
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
