import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AcquiredrightsService {
  apiUrl = environment.API_URL;
  saveSelectedPName: string;
  saveSelectedSWIDTag: string;
  saveSelectedEditor: string;
  saveSelectedEdition: string;
  details: any;
  token = localStorage.getItem('access_token');
  lang = localStorage.getItem('language');
  errorMsg: any;
  constructor(private http: HttpClient) { }

  getAcquiredrights(pageSize, length) {
    const url = this.apiUrl + '/acquiredrights?page_num=' + length + '&page_size=' + pageSize + '&sort_by=ENTITY&sort_order=asc';
    return this.http.get(url)
    .pipe(
      map(res => {
        return res;
      }),
      catchError(this.errorHandler));
    }
    private errorHandler(error) {
      // this.errorMsg = error.error.error_description;
      this.errorMsg = error.error;
       return throwError(this.errorMsg);
  }

  filteredData(length, pageSize, sort_by, sort_order, filteringkey1, filteringkey2,
    filteringkey3, filteringkey4 , filteringkey5) {
    let filteringCondition = '';
    if (filteringkey1 !== '' && filteringkey1 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.swidTag.filteringkey=' + filteringkey1;
    }

    if (filteringkey2 !== '' && filteringkey2 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.SKU.filteringkey=' + filteringkey2;
    }
    if (filteringkey3 !== '' && filteringkey3 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.editor.filteringkey=' + filteringkey3;
    }
    if (filteringkey4 !== '' && filteringkey4 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.productName.filteringkey=' + filteringkey4;
    }
    if (filteringkey5 !== '' && filteringkey5 !== undefined) {
      filteringCondition = filteringCondition + '&search_params.metric.filteringkey=' + filteringkey5;
    }
    if (sort_order === '') {
      sort_order = 'asc';
    }
    const url = this.apiUrl + '/acquiredrights?page_num=' + length + '&page_size=' + pageSize +
      '&sort_by=' + sort_by + '&sort_order=' + sort_order + filteringCondition;
    return this.http.get(url);
  }

  getAggregationAcquiredRights(query: string): Observable<any> {
    const url = this.apiUrl + '/products/aggregations/acqrightsview' + query;
    return this.http.get<any>(url);
  }
}
