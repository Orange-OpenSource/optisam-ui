// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Equipments } from './equipments';

@Injectable({
  providedIn: 'root'
})
export class EquipmentsService {
  apiConfigUrl = environment.API_CONFIG_URL;
  apiEquipUrl = environment.API_EQUIPMENT_URL;
  token = localStorage.getItem('access_token');
  lang = localStorage.getItem('language');
  
  public errorMsg: string;
  constructor(private http: HttpClient) { }

  getTypes(scope?:string): Observable<Equipments[]> {
    let url;
    if(scope) {
      url = this.apiEquipUrl + '/equipments/types?scopes=' + scope;
    }
    else {
      url = this.apiEquipUrl + '/equipments/types?scopes=' + localStorage.getItem('scope');
    }   
    return this.http.get<Equipments[]>(url);
  }

getEquipmentTypeWithIdentifier(equipmentID: string, identifier: string, query: string) {
  const url = this.apiEquipUrl + '/equipments/' + equipmentID + '/equipments/' + identifier + query;
  return this.http.get<any>(url);
}

getEquipmentTypesAttributes(configID: any, attrID: any) {
  const url = this.apiConfigUrl +'/config/' + configID + '/' + attrID ;
  return this.http.get<any>(url);
}

equipmentHardwareSimulation(body: any) {
  const url = this.apiConfigUrl + '/simulation/hardware';
  return this.http.post<any>(url, body);
}

    // Dasboard- Overview
    getEquipmentsOverview(scope) {
      const url = this.apiEquipUrl + '/dashboard/types/equipments?scope=' + scope;
      return this.http.get<any>(url);
    }
}
