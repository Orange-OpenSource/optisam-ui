import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Type } from '../../modules/home/pages/equipmenttypemanagement/model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, last, map } from 'rxjs/operators';
import {
  RequiredJSONFormat,
  EquipmentTypes,
  EquipmentType,
} from 'src/app/modules/home/pages/equipmenttypemanagement/dialogs/model';
import { Equipments } from './equipments';
import {
  DeleteAllocatedMetricParams,
  DeleteAllocatedMetricResponse,
  DeleteAttributeParams,
  ErrorResponse,
} from '@core/modals';
import { fixErrorResponse } from '@core/util/common.functions';

type Urls = {
  allocatedMetric: string;
  equipmentTypeAttribute: string;
};

@Injectable()
export class EquipmentTypeManagementService {
  apiProductUrl = environment.API_PRODUCT_URL;
  apiEquipUrl = environment.API_EQUIPMENT_URL;
  URLs: Urls = {
    allocatedMetric: `${this.apiEquipUrl}/equipment/allocatedmetric`,
    equipmentTypeAttribute: `${this.apiEquipUrl}/equipment/types/attribute`,
  };
  token = localStorage.getItem('access_token');
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dialogData: any;

  constructor(private httpClient: HttpClient) {}

  getDialogData() {
    return this.dialogData;
  }

  createEquipments(equipmentData): Observable<any> {
    return this.httpClient
      .post<any>(this.apiEquipUrl + '/equipment/types', equipmentData)
      .pipe(
        map((res) => {
          this.dialogData = equipmentData;
          return res;
        })
      );
  }
  getMetaData(scope): Observable<Equipments[]> {
    const url = this.apiEquipUrl + '/equipment/metadata?scopes=' + scope;
    return this.httpClient.get<Equipments[]>(url);
  }
  getMappedSource(id): Observable<Equipments[]> {
    const url =
      this.apiEquipUrl +
      '/equipment/metadata/' +
      id +
      '?scopes=' +
      localStorage.getItem('scope');
    return this.httpClient.get<Equipments[]>(url);
  }
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
    return this.httpClient.get<Equipments[]>(url);
  }
  addType(type: Type): void {
    this.dialogData = type;
  }
  updateAttribute(id, attributeData): Observable<any> {
    const url = this.apiEquipUrl + '/equipment/types/' + id;
    return this.httpClient.patch<any>(url, attributeData);
  }
  updateMetricAllocated(body): Observable<any | ErrorResponse> {
    const url = this.apiEquipUrl + '/equipment/allocatedmetric';
    return this.httpClient
      .put<any | ErrorResponse>(url, body)
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }
  getEquipmentsdata(key, name, pageSize, length) {
    const url =
      this.apiEquipUrl +
      '/equipment/' +
      key +
      '/equipments?' +
      'page_num=' +
      length +
      '&page_size=' +
      pageSize +
      '&sort_by=' +
      name +
      '&sort_order=asc&scopes=' +
      localStorage.getItem('scope');
    return this.httpClient.get<Equipments[]>(url);
  }
  // Equip for Applications
  getEquipmentDataWithFilters(
    key,
    pageSize,
    length,
    sort_order,
    sort_by,
    filteringkey1,
    filteringkey2,
    filteringkey3,
    searchFilter?: any
  ) {
    let filteringCondition = '';
    if (filteringkey1 !== '' && filteringkey1 !== undefined) {
      filteringCondition =
        filteringCondition +
        '&filter.product_id.filteringkey=' +
        encodeURIComponent(filteringkey1);
    }
    if (filteringkey2 !== '' && filteringkey2 !== undefined) {
      filteringCondition =
        filteringCondition +
        '&filter.application_id.filteringkey=' +
        filteringkey2;
    }
    if (filteringkey3 !== '' && filteringkey3 !== undefined) {
      filteringCondition =
        filteringCondition +
        '&filter.instance_id.filteringkey=' +
        filteringkey3;
    }
    if (searchFilter) {
      filteringCondition += '&' + searchFilter;
    }
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url =
      this.apiEquipUrl +
      '/equipment/' +
      key +
      '/equipments?' +
      'page_num=' +
      length +
      '&page_size=' +
      pageSize +
      '&sort_by=' +
      sort_by +
      '&sort_order=' +
      sort_order +
      '&scopes=' +
      localStorage.getItem('scope') +
      filteringCondition;
    return this.httpClient.get<Equipments[]>(url).pipe(last());
  }

  filteredData(key, length, pageSize, sort_by, sort_order, searchFilter) {
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url =
      this.apiEquipUrl +
      '/equipment/' +
      key +
      '/equipments?' +
      'page_num=' +
      length +
      '&page_size=' +
      pageSize +
      '&sort_by=' +
      sort_by +
      '&sort_order=' +
      sort_order +
      '&scopes=' +
      localStorage.getItem('scope') +
      '&' +
      searchFilter;
    return this.httpClient.get<Equipments[]>(url);
  }

  getEquipmentDetail(equiId, typeName) {
    const url =
      this.apiEquipUrl +
      '/equipment/' +
      equiId +
      '/equipments/' +
      typeName +
      '?scopes=' +
      localStorage.getItem('scope');
    return this.httpClient.get<Equipments[]>(url);
  }

  getParentDetail(typeID, equiId) {
    const url =
      this.apiEquipUrl +
      '/equipment/' +
      typeID +
      '/' +
      equiId +
      '/' +
      'parents?scopes=' +
      localStorage.getItem('scope');
    return this.httpClient.get<Equipments[]>(url);
  }

  getChildDetail(
    typeID,
    equiId,
    childTypeId,
    length,
    pageSize,
    sort_by,
    sort_order
  ) {
    const url =
      this.apiEquipUrl +
      '/equipment/' +
      typeID +
      '/' +
      equiId +
      '/childs' +
      '/' +
      childTypeId +
      '?' +
      'page_num=' +
      length +
      '&page_size=' +
      pageSize +
      '&sort_by=' +
      sort_by +
      '&sort_order=' +
      sort_order +
      '&scopes=' +
      localStorage.getItem('scope');
    return this.httpClient.get<Equipments[]>(url);
  }

  getProductDetail(equiId, typeName, length, pageSize, sort_by) {
    const url =
      this.apiProductUrl +
      '/products' +
      '?' +
      'page_num=' +
      length +
      '&page_size=' +
      pageSize +
      '&sort_by=' +
      sort_by +
      '&sort_order=asc' +
      '&scopes=' +
      localStorage.getItem('scope') +
      '&search_params.equipment_id.filter_type=1&search_params.equipment_id.filteringkey=' +
      typeName;
    return this.httpClient.get<Equipments[]>(url);
  }

  getChildPaginatedData(
    typeID,
    equiId,
    childTypeId,
    length,
    pageSize,
    sort_by
  ) {
    const url =
      this.apiEquipUrl +
      '/equipment/' +
      typeID +
      '/' +
      equiId +
      '/childs' +
      '/' +
      childTypeId +
      '?' +
      'page_num=' +
      length +
      '&page_size=' +
      pageSize +
      '&sort_by=' +
      sort_by +
      '&sort_order=asc&scopes=' +
      localStorage.getItem('scope');
    return this.httpClient.get<Equipments[]>(url);
  }

  sortChildEquipments(
    typeID,
    equiId,
    childTypeId,
    length,
    pageSize,
    sort_by,
    sort_order
  ) {
    if (sort_order === '') {
      sort_order = 'asc';
    }

    const url =
      this.apiEquipUrl +
      '/equipment/' +
      typeID +
      '/' +
      equiId +
      '/childs' +
      '/' +
      childTypeId +
      '?' +
      'page_num=' +
      length +
      '&page_size=' +
      pageSize +
      '&sort_by=' +
      sort_by +
      '&sort_order=' +
      sort_order +
      '&scopes=' +
      localStorage.getItem('scope');
    return this.httpClient.get<Equipments[]>(url);
  }

  sortFilterChildEquipments(
    typeID,
    equiId,
    childTypeId,
    length,
    pageSize,
    sort_by,
    sort_order,
    searchFilter
  ) {
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url =
      this.apiEquipUrl +
      '/equipment/' +
      typeID +
      '/' +
      equiId +
      '/childs' +
      '/' +
      childTypeId +
      '?' +
      'page_num=' +
      length +
      '&page_size=' +
      pageSize +
      '&sort_by=' +
      sort_by +
      '&sort_order=' +
      sort_order +
      '&scopes=' +
      localStorage.getItem('scope') +
      '&' +
      searchFilter;
    return this.httpClient.get<Equipments[]>(url);
  }

  productFilteredData(
    equiId,
    typeName,
    length,
    pageSize,
    sort_by,
    sort_order,
    filteringkey1,
    filteringkey2,
    filteringkey3
  ): Observable<Equipments[]> {
    sort_by = sort_by;
    sort_order = sort_order;
    let filteringCondition = '';
    if (filteringkey1 !== '' && filteringkey1 !== undefined) {
      filteringCondition =
        filteringCondition +
        '&search_params.swidTag.filteringkey=' +
        encodeURIComponent(filteringkey1);
    }

    if (filteringkey2 !== '' && filteringkey2 !== undefined) {
      filteringCondition =
        filteringCondition +
        '&search_params.name.filteringkey=' +
        encodeURIComponent(filteringkey2);
    }
    if (filteringkey3 !== '' && filteringkey3 !== undefined) {
      filteringCondition =
        filteringCondition +
        '&search_params.editor.filteringkey=' +
        filteringkey3;
    }
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url =
      this.apiProductUrl +
      '/products' +
      '?' +
      'page_num=' +
      length +
      '&page_size=' +
      pageSize +
      '&sort_by=' +
      sort_by +
      '&sort_order=asc' +
      '&scopes=' +
      localStorage.getItem('scope') +
      '&search_params.equipment_id.filter_type=1&search_params.equipment_id.filteringkey=' +
      typeName +
      filteringCondition;
    return this.httpClient.get<Equipments[]>(url);
  }

  getAggregationEquipments(
    query: string,
    aggregateName: string,
    equipmentId: string
  ) {
    const url =
      this.apiEquipUrl +
      '/equipment/products/aggregations/' +
      aggregateName +
      '/equipments/' +
      equipmentId +
      query +
      '&scopes=' +
      localStorage.getItem('scope');
    return this.httpClient.get<any>(url);
  }

  deleteEquipmentType(type): Observable<any> {
    const url =
      this.apiEquipUrl +
      '/equipment/types/' +
      type +
      '?scope=' +
      localStorage.getItem('scope');
    return this.httpClient.delete<any>(url);
  }

  deleteAllocatedMetric(
    inputs: DeleteAllocatedMetricParams
  ): Observable<DeleteAllocatedMetricResponse | ErrorResponse> {
    let params = new HttpParams();
    for (const key in inputs)
      key !== 'eqTypeId' && (params = params.set(key, inputs[key]));
    return this.httpClient
      .delete<DeleteAllocatedMetricResponse | ErrorResponse>(
        `${this.URLs.allocatedMetric}/${inputs.equipment_id}`,
        { params }
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  deleteAttribute(
    input: DeleteAttributeParams
  ): Observable<{ success: boolean } | ErrorResponse> {
    let params = new HttpParams();
    for (let key in input) params = params.set(key, input[key]);
    return this.httpClient
      .delete<{ success: boolean }>(`${this.URLs.equipmentTypeAttribute}`, {
        params,
      })
      .pipe(catchError(fixErrorResponse));
  }
}
