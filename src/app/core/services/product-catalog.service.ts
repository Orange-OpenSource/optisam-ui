import { PRODUCT_CATALOG_TABS } from '@core/util/constants/constants';
import { fixedErrorResponse, getParams } from '@core/util/common.functions';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Editor,
  EditorFiltersResponse,
  EditorNamesResponse,
  ErrorResponse,
  LandingEditorParams,
  LandingProductParams,
  OpenSourceType,
  ProductCatalogEditor,
  ProductCatalogEditorListParams,
  ProductCatalogEditorListResponse,
  ProductCatalogManagementEditorListParams,
  ProductCatalogProduct,
  ProductCatalogProductListResponse,
  ProductCatalogProductSet,
  ProductCatalogProductsListResponse,
  ProductFilters,
  ProductFiltersResponse,
  TabsFlow,
} from '@core/modals';
import { BehaviorSubject, Subject, throwError, of } from 'rxjs';
import { catchError, debounceTime } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as EDITOR_FILTER_MOCK from '@core/util/mock-data/editor-filters.json';
import { NoEncodingHttpParameterCodec } from '@core/util/NoEncodingHttpParameterCodec';

interface URL {
  productList: string;
  addProduct: string;
  editorList: string;
  editorsList: string;
  editorByIdList: string;
  createEditor: string;
  updateEditor: string;
  deleteEditor: string;
  getProduct: string;
  uploadFile: string;
  uploadData: string;
  editorNames: string;
  editorFilter: string;
  productFilter: string;
}

const BASE_URL: string = environment.API_PRODUCT_CATALOG;
const IMPORT_URL: string = environment.API_IMPORT_URL;

@Injectable({
  providedIn: 'root',
})
export class ProductCatalogService {
  sendMessage = new Subject();
  private activityLogError: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  private activityLogVisibility: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  public newTab: Subject<TabsFlow> = new Subject<TabsFlow>();
  private productListingData: Subject<number> = new Subject<number>();
  productListingCacheData: {
    productList: ProductCatalogProductSet[];
    currentPage: number;
    totalProducts: number;
    productFilters: ProductFilters;
  } = null;

  URLs: URL = {
    productList: `${BASE_URL}/catalog/products`,
    addProduct: `${BASE_URL}/api/v1/catalog/product`,
    editorList: `${BASE_URL}/catalog/editor`,
    editorFilter: `${BASE_URL}/catalog/editorfilters`,
    productFilter: `${BASE_URL}/catalog/productfilters`,
    editorNames: `${BASE_URL}/catalog/editornames`,
    editorsList: `${BASE_URL}/catalog/editors`,
    editorByIdList: `${BASE_URL}/catalog/editor`,
    createEditor: `${BASE_URL}/api/v1/catalog/editor`,
    updateEditor: `${BASE_URL}/api/v1/catalog/editor`,
    deleteEditor: `${BASE_URL}/api/v1/catalog/editor`,
    getProduct: `${BASE_URL}/catalog/product`,
    uploadFile: `${BASE_URL}/api/v1/catalog/bulkfileuploadlogs`,
    uploadData: `${IMPORT_URL}/import/uploadcatalogdata`,
  };

  defaultHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) { }

  addNewTab(data: TabsFlow): void {
    this.newTab.next(data);
  }

  getNewTab(): Observable<TabsFlow> {
    return this.newTab.asObservable();
  }

  setProductListingData(number): void {
    this.productListingData.next(number);
  }

  getPrevProductListingData(): Observable<number> {
    return this.productListingData.asObservable();
  }

  getProductsList(
    input: any
  ): Observable<ProductCatalogProductsListResponse | ErrorResponse> {
    return this.http
      .get<ProductCatalogProductsListResponse | ErrorResponse>(
        this.URLs.productList,
        {
          params: getParams(input, false)
        }
      )
      .pipe(catchError(fixedErrorResponse));
  }

  addProduct(
    body: ProductCatalogProduct
  ): Observable<ProductCatalogProduct | ErrorResponse> {
    return this.http
      .post<ProductCatalogProduct>(this.URLs.addProduct, body, {
        headers: this.defaultHeaders,
      })
      .pipe(catchError(fixedErrorResponse));
  }

  getEditorList(
    input: ProductCatalogEditorListParams
  ): Observable<ProductCatalogEditorListResponse | ErrorResponse> {
    let params = new HttpParams();
    for (const key in input) params = params.set(key, input[key]);
    return this.http
      .get<ProductCatalogEditorListResponse>(this.URLs.editorList, { params })
      .pipe(catchError(fixedErrorResponse));
  }

  getEditors(
    inputs: ProductCatalogManagementEditorListParams
  ): Observable<ProductCatalogEditorListResponse | ErrorResponse> {
    return this.http
      .get<ProductCatalogEditorListResponse | ErrorResponse>(
        this.URLs.editorsList,
        { params: getParams(inputs, false) }
      )
      .pipe(catchError(fixedErrorResponse));
  }

  getEditorsLanding(
    inputs: LandingEditorParams
  ): Observable<ErrorResponse | ProductCatalogEditorListResponse> {
    return this.http
      .get<ErrorResponse | ProductCatalogEditorListResponse>(
        this.URLs.editorsList,
        { params: getParams(inputs, false) }
      )
      .pipe(catchError(fixedErrorResponse));  
  }

  getProductLanding(
    inputs: LandingProductParams
  ): Observable<ErrorResponse | ProductCatalogProductListResponse> {
    return this.http
      .get<ErrorResponse | ProductCatalogProductListResponse>(
        this.URLs.productList,
        { params: getParams(inputs, false) }
      )
      .pipe(catchError(fixedErrorResponse));
  }

  filterEditors(input: any) {
    let params = new HttpParams();
    for (const key in input) params = params.set(key, input[key]);

    return this.http
      .get<any>(this.URLs.editorsList, { params })
      .pipe(catchError(fixedErrorResponse));
  }

  getEditorById(id: any) {
    const url = `${this.URLs.editorByIdList}?id=${id}`;
    return this.http.get<any>(url).pipe(catchError(fixedErrorResponse));
  }

  createEditor(editor: Editor) {
    const url = this.URLs.createEditor;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      Authorization: token,
    });
    return this.http
      .post<any>(url, editor, { headers })
      .pipe(catchError(fixedErrorResponse));
  }

  updateProduct(data: any) {
    const url = this.URLs.addProduct;
    return this.http.put<any>(url, data).pipe(catchError(fixedErrorResponse));
  }

  updateEditor(editor: Editor) {
    const url = this.URLs.updateEditor;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      Authorization: token,
    });

    return this.http
      .put<any>(url, editor, { headers })
      .pipe(catchError(fixedErrorResponse));
  }

  deleteEditor(id: any) {
    const url = `${this.URLs.deleteEditor}/${id}`;
    return this.http.delete<any>(url).pipe(catchError(fixedErrorResponse));
  }

  uploadFile(formData: any): Observable<any> {
    console.log(formData);
    return this.http
      .post<any>(this.URLs.uploadData, formData)
      .pipe(catchError((error) => throwError(error.error)));
  }
  deleteProduct(id: any) {
    console.log(id);
    const url = `${this.URLs.addProduct}/${id}`;
    return this.http.delete<any>(url).pipe(catchError(fixedErrorResponse));
  }

  getProductById(id: any): Observable<ProductCatalogProduct | ErrorResponse> {
    const url = `${this.URLs.addProduct}/${id}`;
    return this.http
      .get<ProductCatalogProduct>(url)
      .pipe(catchError(fixedErrorResponse));
  }

  getProductByIdV2(id: string): Observable<ProductCatalogProduct> {
    // if (id === 'test')
    //   return of<ProductCatalogProduct>({
    //     id: 'abs',
    //     editorID: '23',
    //     name: 'string',
    //     metrics: ['abc'],
    //     genearlInformation: 'string',
    //     contracttTips: 'string',
    //     locationType: 'string',
    //     openSource: {
    //       isOpenSource: true,
    //       openLicences: 'string',
    //       openSourceType: OpenSourceType.commercial,
    //     },
    //     closeSource: {
    //       isCloseSource: true,
    //       closeLicences: ['string'],
    //     },
    //     version: [
    //       {
    //         id: 'string',
    //         swidTagVersion: 'string',
    //         name: 'string',
    //         recommendation: 'string',
    //         endOfLife: 'string',
    //         endOfSupport: 'string',
    //       },
    //     ],
    //     recommendation: 'string',
    //     usefulLinks: ['string'],
    //     supportVendors: ['string'],
    //     createdOn: 'string',
    //     UpdatedOn: 'string',
    //     swidtagProduct: 'string',
    //   });

    const params: HttpParams = new HttpParams().set('id', id);
    return this.http
      .get<ProductCatalogProduct>(this.URLs.getProduct, { params })
      .pipe(catchError(fixedErrorResponse));
  }

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

  getUploadFileLogs(): Observable<any> {
    return this.http
      .get<any>(this.URLs.uploadFile)
      .pipe(catchError((error) => throwError(error.error)));
  }

  communicateMessageEditor(msg: any) {
    console.log(msg);
    this.sendMessage.next(msg);
  }

  getEditorNames(): Observable<EditorNamesResponse | ErrorResponse> {
    return this.http
      .get<EditorNamesResponse | ErrorResponse>(this.URLs.editorNames)
      .pipe(catchError(fixedErrorResponse));
  }

  getEditorFilters(): Observable<ErrorResponse | EditorFiltersResponse> {
    return this.http
      .get<EditorFiltersResponse | ErrorResponse>(this.URLs.editorFilter)
      .pipe(catchError(fixedErrorResponse));
  }

  getProductFilters(): Observable<ErrorResponse | ProductFiltersResponse> {
    return this.http
      .get<ProductFiltersResponse | ErrorResponse>(this.URLs.productFilter)
      .pipe(catchError(fixedErrorResponse));
  }
}
