import { CommonService } from '@core/services/common.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Equipments } from './equipments';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { DeleteAttributeParams, ErrorResponse } from '@core/modals';
import { fixErrorResponse } from '@core/util/common.functions';

@Injectable({
  providedIn: 'root',
})
export class EquipmentsService {
  apiConfigUrl = environment.API_CONFIG_URL;
  apiEquipUrl = environment.API_EQUIPMENT_URL;
  token = localStorage.getItem('access_token');
  lang = localStorage.getItem('language');
  defaultHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  public errorMsg: string;
  constructor(private http: HttpClient, private cs: CommonService) {}

  getTypes(scope?: string): Observable<Equipments[]> {
    let url;
    if (scope) {
      url = this.apiEquipUrl + '/equipment/types?scopes=' + scope;
    } else {
      url =
        this.apiEquipUrl +
        '/equipment/types?scopes=' +
        localStorage.getItem('scope');
    }
    return this.http.get<Equipments[]>(url, { headers: this.defaultHeaders });
  }

  getEquipmentTypeWithIdentifier(
    equipmentID: string,
    identifier: string,
    query: string
  ) {
    const url =
      this.apiEquipUrl +
      '/equipment/' +
      equipmentID +
      '/equipments/' +
      identifier +
      query;
    return this.http.get<any>(url);
  }

  getEquipmentTypesAttributes(configID: any, attrID: any) {
    let params = new HttpParams().set(
      'scope',
      this.cs.getLocalData(LOCAL_KEYS.SCOPE)
    );
    const url =
      this.apiConfigUrl + '/simulation/config/' + configID + '/' + attrID;
    return this.http.get<any>(url, { params });
  }

  equipmentHardwareSimulation(body: any) {
    const url = this.apiConfigUrl + '/simulation/hardware';
    return this.http.post<any>(url, body);
  }

  // Dasboard- Overview
  getEquipmentsOverview(scope) {
    const url =
      this.apiEquipUrl + '/equipment/dashboard/types/equipments?scope=' + scope;
    return this.http.get<any>(url);
  }
}
