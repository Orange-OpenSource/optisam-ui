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

@Injectable({
  providedIn: 'root'
})
export class EquipmentsService {
  apiUrl = environment.API_URL;
  apiConfigUrl = environment.API_CONFIG_URL;
  apiEquipUrl = environment.API_EQUIPMENT_URL;
  token = localStorage.getItem('access_token');
  lang = localStorage.getItem('language');
  
  public errorMsg: string;
  constructor(private http: HttpClient) { }

getMetaData(): Observable<Equipments[]> {
  const url = this.apiEquipUrl + '/equipments/metadata';
  return this.http.get<Equipments[]>(url);
}
getTypes(): Observable<Equipments[]> {
  const url = this.apiEquipUrl + '/equipments/types';
  return this.http.get<Equipments[]>(url);
}
getDirectGroups(): Observable<any> {
  //  const url = this.apiUrl + 'admin/direct_groups';
  const url = 'http://localhost:3002/direct_groups';
  return this.http.get<any>(url);
}
postAccount(): Observable<any> {
  //  const url = this.apiUrl + 'admin/accounts';
  const url = 'http://localhost:3002/accounts';
  return this.http.get<any>(url);
}

getEquipmentTypeWithIdentifier(equipmentID: string, identifier: string, query: string) {
  const url = this.apiEquipUrl + '/equipments/' + equipmentID + '/' + identifier + query;
  return this.http.get<any>(url);
}

getEquipmentTypeMetrics(type: string) {
  const url = this.apiEquipUrl + '/equipments/types/' + type + '/metric';
  return this.http.get<any>(url);
}

getEquipmentTypesMetadata(type: string) {
  const url = this.apiConfigUrl +'/config/metadata/' + type;
  return this.http.get<any>(url);
}

getEquipmentTypesAttributes(configID: any, attrID: any) {
  const url = this.apiConfigUrl +'/config/' + configID + '/' + attrID ;
  return this.http.get<any>(url);
}

equipmentHardwareSimulation(body: any) {
  // const url = this.apiUrl + '/equipments/types/' + body.equip_type + '/' + body.equip_id + '/metric/types/' + body.metric_type + '/' + body.metric_name;
  const url = this.apiConfigUrl + '/simulation/hardware';
  return this.http.post<any>(url, body);
}
// createEquipments(equipmentData): Observable<any> {
//   const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token });
//   return this.http.post<any>(this.apiUrl + '/equipments/types' , equipmentData,  { headers: headers })
//     .pipe(
//       map(res => {
//         this.dialogData = equipmentData;
//         this.toasterService.showToaster('Successfully added', 3000);
//         return res;
//       }),
//       catchError(this.errorHandler));
//     }
//     private errorHandler(error) {
//       this.errorMsg = error.error;
//        return throwError(this.errorMsg);
//   }

    // ADD, POST METHOD
    // addItem(kanbanItem: KanbanItem): void {
    //   this.httpClient.post(this.API_URL, kanbanItem).subscribe(data => {
    //     this.dialogData = kanbanItem;
    //     this.toasterService.showToaster('Successfully added', 3000);
    //     },
    //     (err: HttpErrorResponse) => {
    //     this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
    //   });
    //  }
}
