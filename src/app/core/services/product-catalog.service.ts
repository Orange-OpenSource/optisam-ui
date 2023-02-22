import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Editor,
  EditorNamesResponse,
  ErrorResponse,
  LandingEditorParams,
  OpenSourceType,
  ProductCatalogEditorListParams,
  ProductCatalogEditorListResponse,
  ProductCatalogManagementEditorListParams,
  ProductCatalogProduct,
  ProductCatalogProductsListResponse,
} from '@core/modals';
import { BehaviorSubject, Observable, Subject, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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
  URLs: URL = {
    productList: `${BASE_URL}/catalog/products`,
    addProduct: `${BASE_URL}/api/v1/catalog/product`,
    editorList: `${BASE_URL}/catalog/editor`,
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

  constructor(private http: HttpClient) {}

  getProductsList(
    input: any
  ): Observable<ProductCatalogProductsListResponse | ErrorResponse> {
    let params = new HttpParams();
    for (let key in input) params = params.set(key, input[key]);
    return this.http
      .get<ProductCatalogProductsListResponse | ErrorResponse>(
        this.URLs.productList,
        {
          params,
        }
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  addProduct(
    body: ProductCatalogProduct
  ): Observable<ProductCatalogProduct | ErrorResponse> {
    return this.http
      .post<ProductCatalogProduct>(this.URLs.addProduct, body, {
        headers: this.defaultHeaders,
      })
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getEditorList(
    input: ProductCatalogEditorListParams
  ): Observable<ProductCatalogEditorListResponse | ErrorResponse> {
    let params = new HttpParams();
    for (const key in input) params = params.set(key, input[key]);
    return this.http
      .get<ProductCatalogEditorListResponse>(this.URLs.editorList, { params })
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getEditors(
    inputs: ProductCatalogManagementEditorListParams
  ): Observable<ProductCatalogEditorListResponse | ErrorResponse> {
    let params = new HttpParams();
    for (let key in inputs) params = params.set(key, inputs[key]);

    return this.http
      .get<ProductCatalogEditorListResponse | ErrorResponse>(
        this.URLs.editorsList,
        { params }
      )
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getEditorsLanding(
    inputs: LandingEditorParams
  ): Observable<ErrorResponse | ProductCatalogEditorListResponse> {
    const url = this.URLs.editorsList;
    let params: HttpParams = new HttpParams();

    for (let key in inputs) params = params.set(key, inputs[key]);
    return this.http
      .get<ErrorResponse | ProductCatalogEditorListResponse>(url, { params })
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  filterEditors(input: any) {
    let params = new HttpParams();
    for (const key in input) params = params.set(key, input[key]);
    return this.http
      .get<any>(this.URLs.editorsList, { params })
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getEditorById(id: any) {
    const url = `${this.URLs.editorByIdList}?id=${id}`;
    return this.http
      .get<any>(url)
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  createEditor(editor: Editor) {
    console.log(JSON.stringify(editor));
    const url = this.URLs.createEditor;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      Authorization: token,
    });
    return this.http
      .post<any>(url, editor, { headers })
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  updateProduct(data: any) {
    const url = this.URLs.addProduct;
    return this.http
      .put<any>(url, data)
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
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
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  deleteEditor(id: any) {
    const url = `${this.URLs.deleteEditor}/${id}`;
    return this.http
      .delete<any>(url)
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
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
    return this.http
      .delete<any>(url)
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }

  getProductById(id: any): Observable<ProductCatalogProduct | ErrorResponse> {
    const url = `${this.URLs.addProduct}/${id}`;
    return this.http
      .get<ProductCatalogProduct>(url)
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
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
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
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
      .pipe(
        catchError((e) => (e?.error ? throwError(e.error) : throwError(e)))
      );
  }
}
