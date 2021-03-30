// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private _navigationLoading: Subject<Boolean>;
  private _httpLoading: Subject<Boolean>;
  private _clearAdvSearch: BehaviorSubject<any>;
  private _emitProfileChange: Subject<any>;
  public _emitScopeChange: Subject<any>;

  constructor() {
    this._navigationLoading = new Subject<Boolean>();
    this._httpLoading = new Subject<Boolean>();
    this._clearAdvSearch = new BehaviorSubject<any>('1');
    this._emitProfileChange = new Subject<any>();
    this._emitScopeChange = new Subject<any>();
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

  emitProfileChange(change: any) {
    this._emitProfileChange.next(change);
  }

  getChangedProfile() {
    return this._emitProfileChange.asObservable();
  }

  emitScopeChange(scope) {
    this._emitScopeChange.next(scope);
  }
}
