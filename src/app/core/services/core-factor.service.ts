import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap, delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  CoreFactorListData,
  CoreFactorListResponse,
  ActivityLogResponse,
} from '@home/pages/core-factor-management/core-factor.modal';
import { CommonService } from '@core/services/common.service';
import { LOCAL_KEYS, UPLOAD_TYPES } from '@core/util/constants/constants';

const ELEMENT_DATA: CoreFactorListData[] = [
  { corefactor: '1', model: 'Hydrogen', manufacturer: 'H' },
  { corefactor: '2', model: 'Helium', manufacturer: 'He' },
  { corefactor: '3', model: 'Lithium', manufacturer: 'Li' },
  { corefactor: '4', model: 'Beryllium', manufacturer: 'Be' },
  { corefactor: '5', model: 'Boron', manufacturer: 'B' },
  { corefactor: '6', model: 'Carbon', manufacturer: 'C' },
  { corefactor: '7', model: 'Nitrogen', manufacturer: 'N' },
  { corefactor: '8', model: 'Oxygen', manufacturer: 'O' },
  { corefactor: '9', model: 'Fluorine', manufacturer: 'F' },
  { corefactor: '10', model: 'Neon', manufacturer: 'Ne' },
];

@Injectable({
  providedIn: 'root',
})
export class CoreFactorService {
  apiDpsUrl: string = environment.API_DPS_URL;
  apiImportUrl: string = environment.API_IMPORT_URL;
  private activityLogError: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  private activityLogVisibility: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  common: any = {
    coreFactorList: `${this.apiDpsUrl}/dps/corefactor`, //`http://10.238.142.108:10001/api/v1/dps/corefactor`,
    coreFactorUpload: `${this.apiImportUrl}/import/upload`, //`http://10.238.142.108:9093/api/v1/import/upload`
    coreFactorLogs: `${this.apiDpsUrl}/dps/corefactorlogs`, //,'http://10.238.142.108:10001/api/v1/dps/corefactorlogs'
  };

  constructor(private http: HttpClient, private CommonService: CommonService) {}

  setActivityLogError(string: string): void {
    this.activityLogError.next(string);
  }

  getActivityLogError(): Observable<string> {
    return this.activityLogError.asObservable();
  }

  setActivityLogVisibility(status: boolean): void {
    this.activityLogVisibility.next(status);
  }

  getActivityLogVisibility(): Observable<boolean> {
    return this.activityLogVisibility.asObservable();
  }

  getCoreFactorList(param: any): Observable<any> {
    let httpParams = new HttpParams();
    for (let key of Object.keys(param)) {
      httpParams = httpParams.set(key, param[key]);
    }
    return this.http
      .get(this.common.coreFactorList, {
        params: httpParams,
      })
      .pipe(catchError((data) => throwError(data.error)));
  }

  uploadFile(formData: FormData): Observable<any> {
    formData.append('scope', this.CommonService.getLocalData(LOCAL_KEYS.SCOPE));
    formData.append('uploadType', UPLOAD_TYPES.CORE_FACTOR);
    return this.http
      .post<any>(this.common.coreFactorUpload, formData)
      .pipe(catchError((error) => throwError(error.error)));
  }

  getCoreFactorLogs(): Observable<ActivityLogResponse> {
    return this.http
      .get<ActivityLogResponse>(this.common.coreFactorLogs)
      .pipe(catchError((error) => throwError(error.error)));
  }
}
