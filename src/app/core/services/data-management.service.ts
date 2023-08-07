import { fixErrorResponse } from '@core/util/common.functions';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEvent,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { NominativeUserDownloadParams } from '@core/modals';

type URL = {
  nominativeUser: string;
  importUrl: string;
  nominativeUserImport: string;
  nominativeUserDownload: string;
};

@Injectable({
  providedIn: 'root',
})
export class DataManagementService {
  URLs: URL = {
    nominativeUser: `${environment.API_PRODUCT_URL}/product/nominative/users`,
    importUrl: `${environment.API_IMPORT_URL}/import/upload`,
    nominativeUserImport: `${environment.API_IMPORT_URL}/import/nominative/user`,
    nominativeUserDownload: `${environment.API_IMPORT_URL}/import/download/nominative`,
  };
  private removeUser: Subject<number> = new Subject<number>();
  private triggerUpdateUserDetails: Subject<boolean> = new Subject<boolean>();
  private navigateToLog: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  triggerRemoveUser(index: number): void {
    this.removeUser.next(index);
  }

  isRemoveUserTriggered(): Observable<number> {
    return this.removeUser.asObservable();
  }

  updateUserDetailsValidity(): void {
    this.triggerUpdateUserDetails.next(true);
  }

  isUserDetailsUpdated(): Observable<boolean> {
    return this.triggerUpdateUserDetails.asObservable();
  }

  triggerNavToLog(value: boolean): void {
    this.navigateToLog.next(value);
  }

  isTriggeredNavToLog(): Observable<boolean> {
    return this.navigateToLog.asObservable();
  }

  // Data Management
  getUploadedData(query, filteringkey): Observable<any> {
    let url =
      environment.API_DPS_URL +
      '/dps/uploads/data' +
      query +
      '&scope=' +
      localStorage.getItem('scope');
    if (filteringkey) {
      url += '&global_file_id=' + filteringkey;
    }
    return this.http.get(url);
  }
  getUploadedMetadata(query): Observable<any> {
    const url =
      environment.API_DPS_URL +
      '/dps/uploads/metadata' +
      query +
      '&scope=' +
      localStorage.getItem('scope');
    return this.http.get(url);
  }

  uploadDataManagementFiles(data: any, type): Observable<any> {
    const url = environment.API_IMPORT_URL + '/import/' + type;
    // const url = 'http://10.238.143.137:9093/api/v1/import/' + type;
    return this.http.post(url, data, { responseType: 'text' });
  }

  uploadDataManagementFilesNew(data: any): Observable<any> {
    const url = environment.API_IMPORT_URL + '/import/upload';
    // const url = 'http://10.238.143.137:9093/api/v1/import/upload';
    return this.http
      .post(url, data, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(map((event) => this.getEventMessage(event, data)));
  }

  private getEventMessage(event: HttpEvent<any>, data: FormData) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        return this.fileUploadProgress(event);

      case HttpEventType.Response:
        return this.apiResponse(event);

      case HttpEventType.Sent:
        return {
          status: 'sent',
          description: `Resquest Sent`,
        };
        break;

      default:
        // throw new Error(
        //   `File "${(data.get('file') as File).name}" has an error`
        // );
        const res = {
          status: 'DEFAULT',
          description: `File "${(data.get('file') as File).name}" has an error`,
        };
        return res;
        break;
    }
  }

  private fileUploadProgress(event: any) {
    const progress = Math.round((100 * event?.loaded) / event?.total);
    return { status: 'progress', message: progress };
  }
  private apiResponse(event) {
    return event.body;
  }

  downloadAnalysisFile(api: string): Observable<any> {
    api = api.slice(7);
    const url = `${environment.API_IMPORT_URL}/${api}`;
    // const url = `http://10.238.143.137:9093/${api}`;
    // console.log(url);
    // const newurl = new URL(url);
    // const fileName = newurl.searchParams.get('fileName');
    // console.log('fileName', fileName);
    return this.http.get(url, { responseType: 'blob' });
  }

  getFailedRecordsInfo(upload_id, pageIndex, pageSize): Observable<any> {
    let url =
      environment.API_DPS_URL +
      '/dps/failed/data?scope=' +
      localStorage.getItem('scope') +
      '&upload_id=' +
      upload_id +
      '&page_num=' +
      pageIndex +
      '&page_size=' +
      pageSize;
    return this.http.get(url);
  }

  deleteInventory(deletionType?: string): Observable<any> {
    let url =
      environment.API_DPS_URL + '/dps/data/' + localStorage.getItem('scope');
    if (deletionType) {
      url += '?deletion_type=' + deletionType;
    } else {
      url += '?deletion_type=FULL';
    }
    return this.http.delete(url);
  }

  getDeletionLogs(sortBy, sortOrder, pageIndex, pageSize): Observable<any> {
    let url =
      environment.API_DPS_URL +
      '/dps/deletions?scope=' +
      localStorage.getItem('scope') +
      '&sort_by=' +
      sortBy +
      '&sort_order=' +
      sortOrder +
      '&page_num=' +
      pageIndex +
      '&page_size=' +
      pageSize;
    return this.http.get(url);
  }

  getUploadedGlobalData(query): Observable<any> {
    const url =
      environment.API_DPS_URL +
      '/dps/uploads/globaldata' +
      query +
      '&scope=' +
      localStorage.getItem('scope');
    return this.http.get(url);
  }

  getGlobalDataFailedRecords(api): Observable<any> {
    const url = environment.API_IMPORT_URL + '/' + api;
    return this.http.get(url, { responseType: 'blob' });
  }

  getGlobalDataPastInjection(upload_id): Observable<any> {
    const url =
      environment.API_IMPORT_URL +
      '/' +
      'import/download' +
      '?scope=' +
      localStorage.getItem('scope') +
      '&uploadId=' +
      upload_id +
      '&downloadType=source';
    return this.http.get(url, { responseType: 'blob' });
  }

  // Dashboard- Quality
  getDevelopmentRates(scope, frequency, noOfDataPoints) {
    const url =
      environment.API_DPS_URL +
      '/dps/dashboard/quality?scope=' +
      scope +
      '&frequency=' +
      frequency +
      '&noOfDataPoints=' +
      noOfDataPoints;
    return this.http.get<any>(url);
  }

  getFailureRate(scope) {
    const url =
      environment.API_DPS_URL +
      '/dps/dashboard/quality/datafailurerate?scope=' +
      scope;
    return this.http.get<any>(url);
  }

  getFailureReason(scope) {
    const url =
      environment.API_DPS_URL +
      '/dps/dashboard/quality/failurereasonsratio?scope=' +
      scope;
    return this.http.get<any>(url);
  }

  uploadNominativeUserData(data: FormData): Observable<any> {
    return this.http
      .post(this.URLs.nominativeUserImport, data, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        catchError(fixErrorResponse),
        map((event) => this.getEventMessage(event, data))
      );
  }

  getNominativeUserFileData(
    inputs: NominativeUserDownloadParams
  ): Observable<any> {
    let formData = new FormData();
    for (let key in inputs) formData.append(key, inputs[key]);
    return this.http.post(this.URLs.nominativeUserDownload, formData, {
      responseType: 'blob',
    });
  }
}
