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
  token = localStorage.getItem('access_token');
  lang = localStorage.getItem('language');
  public errorMsg: string;
  constructor(private http: HttpClient) { }

getMetaData(): Observable<Equipments[]> {
  const url = this.apiUrl + '/equipments/metadata';
  return this.http.get<Equipments[]>(url);
}
getTypes(): Observable<Equipments[]> {
  const url = this.apiUrl + '/equipments/types';
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
