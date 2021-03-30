// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Type } from '../../modules/home/pages/equipmenttypemanagement/model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { RequiredJSONFormat, EquipmentTypes, EquipmentType } from 'src/app/modules/home/pages/equipmenttypemanagement/dialogs/model';
import { Equipments } from './equipments';

@Injectable()
export class EquipmentTypeManagementService {
  apiProductUrl = environment.API_PRODUCT_URL;
  apiEquipUrl = environment.API_EQUIPMENT_URL;
  token = localStorage.getItem('access_token');
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dialogData: any;

  constructor(private httpClient: HttpClient) { }

  getDialogData() {
    return this.dialogData;
  }

  createEquipments(equipmentData): Observable<any> {
    return this.httpClient.post<any>(this.apiEquipUrl + '/equipments/types', equipmentData)
      .pipe(
        map(res => {
          this.dialogData = equipmentData;
          return res;
        }));
  }
  getMetaData(scope): Observable<Equipments[]> {
    const url = this.apiEquipUrl + '/equipments/metadata?scopes=' + scope;
    return this.httpClient.get<Equipments[]>(url);
  }
  getMappedSource(id): Observable<Equipments[]> {
    const url = this.apiEquipUrl + '/equipments/metadata/' + id + '?scopes=' + localStorage.getItem('scope');
    return this.httpClient.get<Equipments[]>(url);
  }
  getTypes(scope?:string): Observable<Equipments[]> {
    let url;
    if(scope) {
      url = this.apiEquipUrl + '/equipments/types?scopes=' + scope;
    }
    else {
      url = this.apiEquipUrl + '/equipments/types?scopes=' + localStorage.getItem('scope');
    }    
    return this.httpClient.get<Equipments[]>(url);
  }
  addType(type: Type): void {
    this.dialogData = type;
  }
  updateAttribute(id, attributeData): Observable<any> {
    const url = this.apiEquipUrl + '/equipments/types/' + id ;
    return this.httpClient.patch<any>(url, attributeData);
  }

  getEquipmentsdata(key, name, pageSize, length) {
    const url =  this.apiEquipUrl + '/equipments/' + key  +
    '/equipments?' + 'page_num=' + length + '&page_size=' + pageSize + '&sort_by=' + name + '&sort_order=ASC&scopes=' + localStorage.getItem('scope');
    return this.httpClient.get<Equipments[]>(url);
  }
// Equip for Applications
  getEquipmentDataWithFilters(key, pageSize, length, sort_order, sort_by, filteringkey1, filteringkey2, filteringkey3, searchFilter?: any) {
    let filteringCondition = '';
    if (filteringkey1 !== '' && filteringkey1 !== undefined) {
      filteringCondition = filteringCondition + '&filter.product_id.filteringkey=' + filteringkey1;
    }
    if (filteringkey2 !== '' && filteringkey2 !== undefined) {
      filteringCondition = filteringCondition + '&filter.application_id.filteringkey=' + filteringkey2;
    }
    if (filteringkey3 !== '' && filteringkey3 !== undefined) {
      filteringCondition = filteringCondition + '&filter.instance_id.filteringkey=' + filteringkey3;
    }
    if (searchFilter) {
      filteringCondition += '&' + searchFilter;
    }
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url =  this.apiEquipUrl + '/equipments/' + key  +
    '/equipments?' + 'page_num=' + length + '&page_size=' + pageSize + '&sort_by=' + sort_by + '&sort_order=' + sort_order + '&scopes=' + localStorage.getItem('scope') + filteringCondition;
    return this.httpClient.get<Equipments[]>(url);
    
  }

  filteredData(key, length, pageSize, sort_by, sort_order, searchFilter) {
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url = this.apiEquipUrl + '/equipments/'  + key  +
    '/equipments?' + 'page_num=' + length + '&page_size=' + pageSize +
      '&sort_by=' + sort_by + '&sort_order=' + sort_order + '&scopes=' + localStorage.getItem('scope') + '&' + searchFilter;
      return this.httpClient.get<Equipments[]>(url);
  }

  getEquipmentDetail(equiId,typeName) {
    const url =  this.apiEquipUrl + '/equipments/' + equiId  + '/' + typeName + '?scopes=' + localStorage.getItem('scope');
    return this.httpClient.get<Equipments[]>(url);
  }

  getParentDetail(typeID, equiId) {
    const url =  this.apiEquipUrl + '/equipments/' + typeID  + '/' + equiId + '/' + 'parents?scopes=' + localStorage.getItem('scope');
    return this.httpClient.get<Equipments[]>(url);
  }

  getChildDetail(typeID, equiId, childTypeId, length, pageSize, sort_by, sort_order) {
    const url =  this.apiEquipUrl + '/equipments/' + typeID  + '/' + equiId + '/childs' + '/' + childTypeId +
    '?' + 'page_num=' + length + '&page_size=' + pageSize + '&sort_by=' + sort_by + '&sort_order=' + sort_order + '&scopes=' + localStorage.getItem('scope');
    return this.httpClient.get<Equipments[]>(url);
  }

  getProductDetail(equiId, typeName, length, pageSize, sort_by) {
    const url =  this.apiProductUrl + '/products' +
    '?' + 'page_num=' + length + '&page_size=' + pageSize + '&sort_by=' + sort_by + '&sort_order=asc' + '&scopes=' + localStorage.getItem('scope') + '&search_params.equipment_id.filter_type=1&search_params.equipment_id.filteringkey='+typeName;
    return this.httpClient.get<Equipments[]>(url);
  }

  getChildPaginatedData(typeID, equiId, childTypeId, length, pageSize, sort_by) {
    const url =  this.apiEquipUrl + '/equipments/' + typeID  + '/' + equiId + '/childs' + '/' + childTypeId +
    '?' + 'page_num=' + length + '&page_size=' + pageSize + '&sort_by=' + sort_by + '&sort_order=ASC&scopes=' + localStorage.getItem('scope');
    return this.httpClient.get<Equipments[]>(url);
  }

  sortChildEquipments(typeID, equiId, childTypeId, length, pageSize, sort_by, sort_order ) {
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url =  this.apiEquipUrl + '/equipments/' + typeID  + '/' + equiId + '/childs' + '/' + childTypeId +
    '?' + 'page_num=' + length + '&page_size=' + pageSize + '&sort_by=' + sort_by + '&sort_order=' + sort_order + '&scopes=' + localStorage.getItem('scope');
    return this.httpClient.get<Equipments[]>(url);
  }

  sortFilterChildEquipments(typeID, equiId, childTypeId, length, pageSize, sort_by, sort_order, searchFilter ) {
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url =  this.apiEquipUrl + '/equipments/' + typeID  + '/' + equiId + '/childs' + '/' + childTypeId +
    '?' + 'page_num=' + length + '&page_size=' + pageSize + '&sort_by=' + sort_by + '&sort_order=' + sort_order + '&scopes=' + localStorage.getItem('scope') + '&' + searchFilter;
    return this.httpClient.get<Equipments[]>(url);
  }

  productFilteredData(equiId, typeName, length, pageSize, sort_by, sort_order,
    filteringkey1, filteringkey2, filteringkey3): Observable<Equipments[]> {
      sort_by = sort_by;
      sort_order = sort_order;
    let filteringCondition = '';
    if (filteringkey1 !== '' && filteringkey1 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.swidTag.filteringkey=' + filteringkey1;
    }

    if (filteringkey2 !== '' && filteringkey2 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.name.filteringkey=' + filteringkey2;
    }
    if (filteringkey3 !== '' && filteringkey3 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.editor.filteringkey=' + filteringkey3;
    }
    if (sort_order === '') {
      sort_order = 'ASC';
    }
    const url =  this.apiProductUrl + '/products' +
                '?' + 'page_num=' + length + '&page_size=' + pageSize + '&sort_by=' + sort_by + '&sort_order=asc' + 
                '&scopes=' + localStorage.getItem('scope') + '&search_params.equipment_id.filter_type=1&search_params.equipment_id.filteringkey=' + typeName + filteringCondition;
    return this.httpClient.get<Equipments[]>(url);
  }

  getAggregationEquipments(query: string, aggregateName: string, equipmentId: string) {
    const url = this.apiEquipUrl + '/products/aggregations/' + aggregateName + '/equipments/' + equipmentId + query + '&scopes=' + localStorage.getItem('scope');
    return this.httpClient.get<any>(url);
  }

  deleteEquipmentType(type):Observable<any> {
    const url = this.apiEquipUrl + '/equipments/types/'+ type +'?scope=' + localStorage.getItem('scope');
    return this.httpClient.delete<any>(url);
  }
}
