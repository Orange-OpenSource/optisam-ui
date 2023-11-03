import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  MetricDetailsParams,
  MetricUpdateError,
  MetricUpdateSuccess,
  OracleProcessorStandardParams,
  OracleNupStandardParams,
  IbmPvuStandardParams,
  SagProcessorStandardParams,
  AttributeSumStandardParams,
  AttributeCounterStandardParams,
  InstanceNumberStandardParams,
  StaticStandardParams,
  EquipmentAttributeParams,
  UserStandardParams,
  ErrorResponse,
  MetricTypeResponse,
  DefaultResponse,
  ImportMetricsParams,
} from '@core/modals';
import { fixedErrorResponse } from '@core/util/common.functions';

interface CommonUrls {
  oracleNupStandard: string;
  oracleProcessorStandard: string;
  IbmPvuStandard: string;
  SagProcessorStandard: string;
  AttributeSumStandard: string;
  AttributeCounterStandard: string;
  IntanceNumberStandard: string;
  StaticStandard: string;
  EquipmentStandard: string;
  concurrentUserStandard: string;
  nominativeUserStandard: string;
  metricType: string;
  importMetrics: string;
}


@Injectable({
  providedIn: 'root',
})
export class MetricService {
  apiMetricUrl = environment.API_METRIC_URL;
  common: CommonUrls = {
    oracleNupStandard: `${this.apiMetricUrl}/metric/oracle_nup`,
    oracleProcessorStandard: `${this.apiMetricUrl}/metric/ops`,
    IbmPvuStandard: `${this.apiMetricUrl}/metric/ips`,
    SagProcessorStandard: `${this.apiMetricUrl}/metric/sps`,
    AttributeSumStandard: `${this.apiMetricUrl}/metric/attr_sum`,
    AttributeCounterStandard: `${this.apiMetricUrl}/metric/acs`,
    IntanceNumberStandard: `${this.apiMetricUrl}/metric/inm`,
    StaticStandard: `${this.apiMetricUrl}/metric/ss`,
    EquipmentStandard: `${this.apiMetricUrl}/metric/equip_attr`,
    concurrentUserStandard: `${this.apiMetricUrl}/metric/user_conc`,
    nominativeUserStandard: `${this.apiMetricUrl}/metric/uns`,
    metricType: `${this.apiMetricUrl}/metric/types`,
    importMetrics: `${this.apiMetricUrl}/metric/import_metric`,
  };
  defaultHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private httpClient: HttpClient) { }

  getMetricList(scope?: string) {
    const url = `${this.apiMetricUrl}/metrics`;
    let httpParams = new HttpParams().set(
      'scopes',
      scope ? scope : localStorage.getItem('scope')
    );
    return this.httpClient.get<any>(url, { params: httpParams });
  }
  getMetricType(scopes: string | string[], isImport: boolean = false): Observable<MetricTypeResponse | ErrorResponse> {
    let params = new HttpParams();
    if (Array.isArray(scopes)) {
      for (let scope of scopes) params = params.set('scopes', scope);
    } else {
      params = params.set('scopes', scopes);
    }
    params = params.set('is_import', String(isImport));
    return this.httpClient.get<MetricTypeResponse | ErrorResponse>(this.common.metricType, { params });
  }
  createMetric(metricData, href) {
    return this.httpClient.post<any>(this.apiMetricUrl + href, metricData).pipe(
      map((res) => {
        return res;
      })
    );
  }
  getMetricDetails(params: MetricDetailsParams): Observable<any> {
    let httpParams = new HttpParams();
    for (let key of Object.keys(params)) {
      httpParams = httpParams.set(key, params[key]);
    }
    const url = `${this.apiMetricUrl}/metric/config`;
    return this.httpClient.get<any>(url, {
      params: httpParams,
      headers: this.defaultHeaders,
    });
  }

  deleteMetric(metricName) {
    const url =
      this.apiMetricUrl +
      '/metric/' +
      metricName +
      '?scope=' +
      localStorage.getItem('scope');
    return this.httpClient.delete<any>(url);
  }

  updateOracleNupStandard(
    params: OracleNupStandardParams
  ): Observable<MetricUpdateError | MetricUpdateSuccess> {
    return this.httpClient
      .patch<MetricUpdateError | MetricUpdateSuccess>(
        this.common.oracleNupStandard,
        params,
        { headers: this.defaultHeaders }
      )
      .pipe(catchError((e) => throwError(e.error)));
  }

  updateOracleProcessorStandard(
    params: OracleProcessorStandardParams
  ): Observable<MetricUpdateError | MetricUpdateSuccess> {
    return this.httpClient
      .patch<MetricUpdateError | MetricUpdateSuccess>(
        this.common.oracleProcessorStandard,
        params,
        { headers: this.defaultHeaders }
      )
      .pipe(catchError((e) => throwError(e.error as MetricUpdateError)));
  }

  updateIbmPvuStandard(
    params: IbmPvuStandardParams
  ): Observable<MetricUpdateError | MetricUpdateSuccess> {
    return this.httpClient
      .patch<MetricUpdateError | MetricUpdateSuccess>(
        this.common.IbmPvuStandard,
        params,
        { headers: this.defaultHeaders }
      )
      .pipe(catchError((e) => throwError(e.error)));
  }

  updateSagProcessorStandard(
    params: SagProcessorStandardParams
  ): Observable<MetricUpdateError | MetricUpdateSuccess> {
    return this.httpClient
      .patch<MetricUpdateError | MetricUpdateSuccess>(
        this.common.SagProcessorStandard,
        params,
        { headers: this.defaultHeaders }
      )
      .pipe(catchError((e) => throwError(e.error)));
  }

  updateAttributeSumStandard(
    params: AttributeSumStandardParams
  ): Observable<MetricUpdateError | MetricUpdateSuccess> {
    return this.httpClient
      .patch<MetricUpdateError | MetricUpdateSuccess>(
        this.common.AttributeSumStandard,
        params,
        { headers: this.defaultHeaders }
      )
      .pipe(catchError((e) => throwError(e.error)));
  }

  updateAttributeCounterStandard(
    params: AttributeCounterStandardParams
  ): Observable<MetricUpdateError | MetricUpdateSuccess> {
    return this.httpClient
      .patch<MetricUpdateError | MetricUpdateSuccess>(
        this.common.AttributeCounterStandard,
        params,
        { headers: this.defaultHeaders }
      )
      .pipe(catchError((e) => throwError(e.error)));
  }

  updateStaticStandard(
    params: StaticStandardParams
  ): Observable<MetricUpdateError | MetricUpdateSuccess> {
    return this.httpClient
      .patch<MetricUpdateError | MetricUpdateSuccess>(
        this.common.StaticStandard,
        params,
        { headers: this.defaultHeaders }
      )
      .pipe(catchError((e) => throwError(e.error)));
  }

  equipmentAttributeStandard(
    params: EquipmentAttributeParams
  ): Observable<MetricUpdateError | MetricUpdateSuccess> {
    return this.httpClient
      .patch<MetricUpdateError | MetricUpdateSuccess>(
        this.common.EquipmentStandard,
        params,
        { headers: this.defaultHeaders }
      )
      .pipe(catchError((e) => throwError(e.error)));
  }

  updateInstanceNumberStandard(
    params: InstanceNumberStandardParams
  ): Observable<MetricUpdateError | MetricUpdateSuccess> {
    return this.httpClient
      .patch<MetricUpdateError | MetricUpdateSuccess>(
        this.common.IntanceNumberStandard,
        params,
        { headers: this.defaultHeaders }
      )
      .pipe(catchError((e) => throwError(e.error)));
  }

  updateConcurrentUserStandard(
    params: UserStandardParams
  ): Observable<MetricUpdateSuccess | ErrorResponse> {
    return this.httpClient
      .patch<MetricUpdateSuccess | ErrorResponse>(
        this.common.concurrentUserStandard,
        params,
        { headers: this.defaultHeaders }
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }
  updateNominativeUserStandard(
    params: UserStandardParams
  ): Observable<MetricUpdateSuccess | ErrorResponse> {
    return this.httpClient
      .patch<MetricUpdateSuccess | ErrorResponse>(
        this.common.nominativeUserStandard,
        params,
        { headers: this.defaultHeaders }
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  importMetrics(body: ImportMetricsParams): Observable<ErrorResponse | DefaultResponse> {
    return this.httpClient.post<ErrorResponse | DefaultResponse>(this.common.importMetrics, body).pipe(
      catchError(fixedErrorResponse)
    )
  }
}
