import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  IntanceNumberStandardParams,
} from '@core/modals';

@Injectable({
  providedIn: 'root',
})
export class MetricService {
  apiMetricUrl = environment.API_METRIC_URL;
  common: any = {
    oracleNupStandard: `${this.apiMetricUrl}/metric/oracle_nup`,
    oracleProcessorStandard: `${this.apiMetricUrl}/metric/ops`,
    IbmPvuStandard: `${this.apiMetricUrl}/metric/ips`,
    SagProcessorStandard: `${this.apiMetricUrl}/metric/sps`,
    AttributeSumStandard: `${this.apiMetricUrl}/metric/attr_sum`,
    AttributeCounterStandard: `${this.apiMetricUrl}/metric/acs`,
    IntanceNumberStandard: `${this.apiMetricUrl}/metric/inm`,
  };
  defaultHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private httpClient: HttpClient) {}

  getMetricList(scope?: string) {
    const url = `${this.apiMetricUrl}/metrics`;
    let httpParams = new HttpParams().set(
      'scopes',
      scope ? scope : localStorage.getItem('scope')
    );
    return this.httpClient.get<any>(url, { params: httpParams });
  }
  getMetricType(scopes: string) {
    const url = this.apiMetricUrl + '/metric/types?scopes=' + scopes;
    return this.httpClient.get<any>(url);
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
    return this.httpClient.patch<MetricUpdateError | MetricUpdateSuccess>(
      this.common.oracleNupStandard,
      params,
      { headers: this.defaultHeaders }
    );
  }

  updateOracleProcessorStandard(
    params: OracleProcessorStandardParams
  ): Observable<MetricUpdateError | MetricUpdateSuccess> {
    return this.httpClient.patch<MetricUpdateError | MetricUpdateSuccess>(
      this.common.oracleProcessorStandard,
      params,
      { headers: this.defaultHeaders }
    );
  }

  updateIbmPvuStandard(
    params: IbmPvuStandardParams
  ): Observable<MetricUpdateError | MetricUpdateSuccess> {
    return this.httpClient.patch<MetricUpdateError | MetricUpdateSuccess>(
      this.common.IbmPvuStandard,
      params,
      { headers: this.defaultHeaders }
    );
  }

  updateSagProcessorStandard(
    params: SagProcessorStandardParams
  ): Observable<MetricUpdateError | MetricUpdateSuccess> {
    return this.httpClient.patch<MetricUpdateError | MetricUpdateSuccess>(
      this.common.SagProcessorStandard,
      params,
      { headers: this.defaultHeaders }
    );
  }

  updateAttributeSumStandard(
    params: AttributeSumStandardParams
  ): Observable<MetricUpdateError | MetricUpdateSuccess> {
    return this.httpClient.patch<MetricUpdateError | MetricUpdateSuccess>(
      this.common.AttributeSumStandard,
      params,
      { headers: this.defaultHeaders }
    );
  }

  updateAttributeCounterStandard(
    params: AttributeCounterStandardParams
  ): Observable<MetricUpdateError | MetricUpdateSuccess> {
    return this.httpClient.patch<MetricUpdateError | MetricUpdateSuccess>(
      this.common.AttributeCounterStandard,
      params,
      { headers: this.defaultHeaders }
    );
  }

  updateInstanceNumberStandard(
    params: IntanceNumberStandardParams
  ): Observable<MetricUpdateError | MetricUpdateSuccess> {
    return this.httpClient.patch<MetricUpdateError | MetricUpdateSuccess>(
      this.common.IntanceNumberStandard,
      params,
      { headers: this.defaultHeaders }
    );
  }
}
