import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  apiUrl = environment.API_ACCOUNT_URL;
  public errorMsg: string;
  constructor(private http: HttpClient) {}
  getGroups(): Observable<any> {
    const url = this.apiUrl + '/account/admin/groups';
    return this.http.get<any>(url);
  }
  getDirectGroups(): Observable<any> {
    const url = this.apiUrl + '/account/admin/direct_groups';
    return this.http.get<any>(url);
  }
  getChildGroups(id): Observable<any> {
    const url = this.apiUrl + '/account/admin/groups/' + id + '/groups';
    return this.http.get<any>(url);
  }
  deleteGroups(id): Observable<any> {
    const url = this.apiUrl + '/account/admin/groups/' + id;
    return this.http.delete<any>(url);
  }
  updateGroup(id, data): Observable<any> {
    const url = this.apiUrl + '/account/admin/groups/' + id;
    return this.http.put<any>(url, data);
  }
  getGrpUserList(grpId): Observable<any> {
    const url = this.apiUrl + '/account/admin/groups/' + grpId + '/users';
    return this.http.get<any>(url);
  }
  deleteGrpUser(grpId, data): Observable<any> {
    const url =
      this.apiUrl + '/account/admin/groups/' + grpId + '/users/delete';
    return this.http.put<any>(url, data);
  }
  addGrpUser(grpId, data): Observable<any> {
    const url = this.apiUrl + '/account/admin/groups/' + grpId + '/users/add';
    return this.http.put<any>(url, data);
  }
  getAllUserList(allUsersFlag): Observable<any> {
    const url = `${this.apiUrl}/account/users`;
    const params = new HttpParams().set('user_filter.all_users', allUsersFlag);
    return this.http.get<any>(url, { params });
  }
  changePassword(data): Observable<any> {
    return this.http.put<any>(this.apiUrl + '/account/changepassword', data);
  }
  createGroup(groupData): Observable<any> {
    return this.http.post<any>(
      this.apiUrl + '/account/admin/groups',
      groupData
    );
  }
  createUser(groupData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/account/user`, groupData);
  }

  updateUser(groupData): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/account/${groupData.user_id}`,
      groupData
    );
  }

  deleteUser(userId): Observable<any> {
    const url = `${this.apiUrl}/account/${userId}`;
    return this.http.delete<any>(url);
  }
}
