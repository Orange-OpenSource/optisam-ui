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

@Injectable()
export class EquipmentTypeManagementService {
  apiUrl = environment.API_URL;
  token = localStorage.getItem('access_token');
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dialogData: any;

  constructor(private httpClient: HttpClient) { }

  // get data(): any[] {
  //   return this.dataChange.value;
  // }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllTypes(): Observable<EquipmentType[]> {
    const url = this.apiUrl + '/equipments/types';
    return this.httpClient.get<EquipmentType[]>(url);
  }
  createEquipments(equipmentData): Observable<any> {
    return this.httpClient.post<any>(this.apiUrl + '/equipments/types', equipmentData)
      .pipe(
        map(res => {
          this.dialogData = equipmentData;
          return res;
        }));
  }
  getMetaData(): Observable<Equipments[]> {
    const url = this.apiUrl + '/equipments/metadata';
    return this.httpClient.get<Equipments[]>(url);
  }
  getMappedSource(id): Observable<Equipments[]> {
    const url = this.apiUrl + '/equipments/metadata/' + id ;
    return this.httpClient.get<Equipments[]>(url);
  }
  getTypes(): Observable<Equipments[]> {
    const url = this.apiUrl + '/equipments/types';
    return this.httpClient.get<Equipments[]>(url);
  }
  addType(type: Type): void {
    this.dialogData = type;
  }
  updateAttribute(id, attributeData): Observable<any> {
    const url = this.apiUrl + '/equipments/types/' + id ;
    return this.httpClient.patch<any>(url, attributeData);
  }

  getEquipmentsdata(key, name, pageSize, length) {
    const url =  this.apiUrl + '/equipments/' + key  +
    '?' + 'page_num=' + length + '&page_size=' + pageSize + '&sort_by=' + name + '&sort_order=ASC';
    return this.httpClient.get<Equipments[]>(url);
  }
  getProdWithEquipments(swigTag, key, name, pageSize, length, searchFilter?: any) {
    let url =  this.apiUrl + '/products/' + swigTag + '/equipments/' + key  +
    '?' + 'page_num=' + length + '&page_size=' + pageSize + '&sort_by=' + name + '&sort_order=ASC';
    if (searchFilter) {
      url += '&' + searchFilter;
    }
    return this.httpClient.get<Equipments[]>(url);
  }

  getPaginatedData(key, name, length, pageSize, searchFilter?: any) {
    let url =  this.apiUrl + '/equipments/' + key  +
    '?' + 'page_num=' + length + '&page_size=' + pageSize + '&sort_by=' + name + '&sort_order=ASC';

    if (searchFilter) {
      url += '&' + searchFilter;
   }
    return this.httpClient.get<Equipments[]>(url);
  }
  sortEquipments(key, length, pageSize, sort_by, sort_order, searchFilter?: any ) {
    if (sort_order === '') {
      sort_order = 'asc';
    }
    let url =  this.apiUrl + '/equipments/' + key  +
    '?' + 'page_num=' + length + '&page_size=' + pageSize + '&sort_by=' + sort_by + '&sort_order=' + sort_order;

    if (searchFilter) {
       url += '&' + searchFilter;
    }
    return this.httpClient.get<Equipments[]>(url);
  }
  filteredData(key, length, pageSize, sort_by, sort_order, searchFilter) {
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url = this.apiUrl + '/equipments/'  + key  +
    '?' + 'page_num=' + length + '&page_size=' + pageSize +
      '&sort_by=' + sort_by + '&sort_order=' + sort_order + '&' + searchFilter;
      return this.httpClient.get<Equipments[]>(url);
    }
    getProdWithEquipmentSearch(swigTag, key, length, pageSize, sort_by, sort_order, searchFilter) {
      if (sort_order === '') {
        sort_order = 'asc';
      }
      const url =  this.apiUrl + '/products/' + swigTag + '/equipments/'  + key  +
      '?' + 'page_num=' + length + '&page_size=' + pageSize +
        '&sort_by=' + sort_by + '&sort_order=' + sort_order + '&' + searchFilter;
        return this.httpClient.get<Equipments[]>(url);
    }
  getEquipmentDetail(typeID, equiId) {
    const url =  this.apiUrl + '/equipments/' + typeID  + '/' + equiId;
    console.log(url);
    return this.httpClient.get<Equipments[]>(url);
  }
  getParentDetail(typeID, equiId) {
    const url =  this.apiUrl + '/equipments/' + typeID  + '/' + equiId + '/' + 'parents';
    console.log(url);
    return this.httpClient.get<Equipments[]>(url);
  }
  getChildDetail(typeID, equiId, childTypeId, length, pageSize, sort_by, sort_order) {
    const url =  this.apiUrl + '/equipments/' + typeID  + '/' + equiId + '/childs' + '/' + childTypeId +
    '?' + 'page_num=' + length + '&page_size=' + pageSize + '&sort_by=' + sort_by + '&sort_order=' + sort_order;
    console.log(url);
    return this.httpClient.get<Equipments[]>(url);
  }
  getProductDetail(typeID, equiId, length, pageSize, sort_by) {
    const url =  this.apiUrl + '/equipments/' + typeID  + '/' + equiId + '/' + 'products' +
    '?' + 'page_num=' + length + '&page_size=' + pageSize + '&sort_by=' + sort_by + '&sort_order=ASC';
    console.log(url);
    return this.httpClient.get<Equipments[]>(url);
  }
  getChildPaginatedData(typeID, equiId, childTypeId, length, pageSize, sort_by) {
    const url =  this.apiUrl + '/equipments/' + typeID  + '/' + equiId + '/childs' + '/' + childTypeId +
    '?' + 'page_num=' + length + '&page_size=' + pageSize + '&sort_by=' + sort_by + '&sort_order=ASC';
    return this.httpClient.get<Equipments[]>(url);
  }
  sortChildEquipments(typeID, equiId, childTypeId, length, pageSize, sort_by, sort_order ) {
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url =  this.apiUrl + '/equipments/' + typeID  + '/' + equiId + '/childs' + '/' + childTypeId +
    '?' + 'page_num=' + length + '&page_size=' + pageSize + '&sort_by=' + sort_by + '&sort_order=' + sort_order;
    return this.httpClient.get<Equipments[]>(url);
  }
  sortFilterChildEquipments(typeID, equiId, childTypeId, length, pageSize, sort_by, sort_order, searchFilter ) {
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url =  this.apiUrl + '/equipments/' + typeID  + '/' + equiId + '/childs' + '/' + childTypeId +
    '?' + 'page_num=' + length + '&page_size=' + pageSize + '&sort_by=' + sort_by + '&sort_order=' + sort_order + '&' + searchFilter;
    return this.httpClient.get<Equipments[]>(url);
  }
  productFilteredData(typeID, equiId, length, pageSize, sort_by, sort_order,
    filteringkey1, filteringkey2, filteringkey3): Observable<Equipments[]> {
      sort_by = sort_by.toUpperCase();
      sort_order = sort_order.toUpperCase();
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
    const url = this.apiUrl + '/equipments/' + typeID  + '/' + equiId + '/' + 'products?page_num=' + length + '&page_size=' + pageSize +
      '&sort_by=' + sort_by + '&sort_order=' + sort_order + filteringCondition;
    return this.httpClient.get<Equipments[]>(url);
  }
  getMetricList() {
    const url = this.apiUrl + '/metric';
    return this.httpClient.get<any>(url);
  }
  getMetricType() {
    const url = this.apiUrl + '/metric/types';
    return this.httpClient.get<any>(url);
  }
  createMetric(metricData, href) {
    return this.httpClient.post<any>(this.apiUrl + href, metricData)
      .pipe(
        map(res => {
          this.dialogData = metricData;
          return res;
        }));
  }
}
