import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private _navigationLoading: Subject<Boolean>;
  private _httpLoading: Subject<Boolean>;
  private _clearAdvSearch: BehaviorSubject<any>;

  constructor() {
    this._navigationLoading = new Subject<Boolean>();
    this._httpLoading = new Subject<Boolean>();
    this._clearAdvSearch = new BehaviorSubject<any>('1');
  }

  startLoading() {
    this._navigationLoading.next(true);
  }

  endLoading() {
    this._navigationLoading.next(false);
  }

  navigationLoading(): Observable<Boolean> {
    return this._navigationLoading.asObservable();
  }

  startHttpLoading() {
    this._httpLoading.next(true);
  }

  endHttpLoading() {
    this._httpLoading.next(false);
  }

  httpLoading(): Observable<Boolean> {
    return this._httpLoading.asObservable();
  }

  clearSearch(): Observable<any> {
    return this._clearAdvSearch.asObservable();
  }

  triggerClearSeach() {
    this._clearAdvSearch.next('1');
  }
}
