import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonPopupSetting, DownloadFileInput } from '@core/modals';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { CommonPopupComponent } from './dialog/common-popup/common-popup.component';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private _navigationLoading: Subject<Boolean>;
  private _httpLoading: Subject<Boolean>;
  private _clearAdvSearch: BehaviorSubject<any>;
  private _emitProfileChange: Subject<any>;
  public _emitScopeChange: Subject<any>;

  constructor(private dialog: MatDialog) {
    this._navigationLoading = new Subject<Boolean>();
    this._httpLoading = new BehaviorSubject<Boolean>(true);
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

  commonPopup(data: CommonPopupSetting): MatDialogRef<CommonPopupComponent> {
    return this.dialog.open(CommonPopupComponent, {
      disableClose: true,
      minWidth: '300px',
      maxWidth: '70vw',
      width: 'max-content',
      data,
    });
  }

  downloadFile({ data, prefix, filename }: DownloadFileInput): void {
    prefix ||= '';
    const url = URL.createObjectURL(data);
    const link: HTMLAnchorElement = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', prefix + filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
