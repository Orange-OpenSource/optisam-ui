import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Products, AggregationDetailsAquiredRights, AggregationDetailsInformation, AggregationDetailsOptions} from './product';

@Injectable()
export class ProductService {
  apiUrl = environment.API_URL;
  saveSelectedPName: string;
  saveSelectedSWIDTag: string;
  saveSelectedEditor: string;
  saveSelectedEdition: string;
  details: any;
  token = localStorage.getItem('access_token');
  lang = localStorage.getItem('language');

  constructor(private http: HttpClient) { }

  getProducts(pageSize, length): Observable<Products[]> {
    const url = this.apiUrl + '/products?page_num=' + length + '&page_size=' + pageSize + '&sort_by=name&sort_order=asc';
    return this.http.get<Products[]>(url);
  }
  getMoreDetails(data): Observable<Products[]> {
    return this.http.get<Products[]>(this.apiUrl + '/product/' + data);
  }
  getAcquiredRigthDetail(data): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/product/' + data + '/acquiredrights');
  }
  filteredData(length, pageSize, sort_by, sort_order, filteringkey1, filteringkey2, filteringkey3): Observable<Products[]> {
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
      sort_order = 'asc';
    }
    const url = this.apiUrl + '/products?page_num=' + length + '&page_size=' + pageSize +
      '&sort_by=' + sort_by + '&sort_order=' + sort_order + filteringCondition;
    return this.http.get<Products[]>(url);
  }
  getprodApplications(swidTag, pageSize, length): Observable<Applications[]> {
    const url = this.apiUrl + '/products/' + swidTag + '/applications?page_num=' +
      length + '&page_size=' + pageSize + '&sort_by=name&sort_order=asc';
    return this.http.get<Applications[]>(url);
  }
  getprodInstances(swidTag, app_id, pageSize, length): Observable<Applications[]> {
    const url = this.apiUrl + '/products/' + swidTag + '/applications/' + app_id + '/instances' + '?page_num=' +
      length + '&page_size=' + pageSize + '&sort_by=NUM_PRODUCTS&sort_order=ASC';
    return this.http.get<Applications[]>(url);
  }
  prodAplfilteredData(swidTag, length, pageSize, sort_by, sort_order, filteringkey1, filteringkey2): Observable<Applications[]> {
    let filteringCondition = '';

    if (filteringkey1 !== '' && filteringkey1 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.name.filteringkey=' + filteringkey1;
    }

    if (filteringkey2 !== '' && filteringkey2 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.application_owner.filteringkey=' + filteringkey2;
    }
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url = this.apiUrl + '/products/' + swidTag + '/applications?page_num=' + length + '&page_size=' + pageSize +
      '&sort_by=' + sort_by + '&sort_order=' + sort_order + filteringCondition;
    return this.http.get<Applications[]>(url);
  }
  getInstancesSort(swidTag, key, pageSize, length, sort_by, sort_order): Observable<Applications[]> {
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url = this.apiUrl + '/products/' + swidTag + '/applications/' + key + '/instances' + '?page_num=' +
      length + '&page_size=' + pageSize +  '&sort_by=' + sort_by + '&sort_order=' + sort_order;
    return this.http.get<Applications[]>(url);
  }

  getAggregationProducts(query: string): Observable<any> {
    const url = this.apiUrl + '/products/aggregations/productview' + query;
    return this.http.get<any>(url);
  }

  getAggregationOptions(aggregationName: string): Observable<AggregationDetailsOptions> {
    const url = this.apiUrl + '/products/aggregations/productview/' + aggregationName + '/options';
    return this.http.get<AggregationDetailsOptions>(url);
  }

  getAggregationAquiredRights(aggregationName: string): Observable<AggregationDetailsAquiredRights> {
    const url = this.apiUrl + '/products/aggregations/productview/' + aggregationName + '/acquiredrights';
    return this.http.get<AggregationDetailsAquiredRights>(url);
  }

  getAggregationInfoDetails(aggregationName: string): Observable<AggregationDetailsInformation> {
    const url = this.apiUrl + '/products/aggregations/productview/' + aggregationName + '/details';
    return this.http.get<AggregationDetailsInformation>(url);
  }
}
