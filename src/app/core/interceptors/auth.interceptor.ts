// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { SharedService } from '../../shared/shared.service';
import { ConfigurationServiceService } from 'src/app/configuration-service/configuration-service.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  config: any;
  constructor(
    private sharedService: SharedService,
    private configurationService: ConfigurationServiceService
    ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.sharedService.startHttpLoading();

    // Replace the ur according to environment
    if (!this.config) {
      this.configurationService.$configurations.subscribe(data => this.config = data);
    }
    const caseValue = request.url.split('/')[0];
    let _url = request.url.substr(caseValue.length);
    switch (caseValue) {
      case 'license':
      case 'account':
      case 'auth':
      case 'simulation':
      case 'application':
      case 'product':
      case 'metric':
      case 'equipment':
      case 'dps':
      case 'report':
      case 'import':
          _url = this.config[caseValue] + _url;
          request = request.clone({url: _url});
          break;

      default:
          break;
    }

    // Check for token to authorize & omit appending token for meta service request
    const token: string = localStorage.getItem('access_token');
    if (token && request.url.search('/version.html') === -1) {
        request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    }
    //  To exclude Content-Type in import & config service call
    if (request.url.search('/api/v1/import') === -1 && request.url.search('/api/v1/config') === -1 && request.url.search('/version.html') === -1) {
      if (!request.headers.has('Content-Type')) {
          request = request.clone({ headers: request.headers.set('Content-Type', 'application/x-www-form-urlencoded') });
      }
      request = request.clone({ headers: request.headers.set('Accept', 'application/x-www-form-urlencoded') });
    }
    return next.handle(request);
   }

}

@Injectable()
export class UnauthorisedInterceptor implements HttpInterceptor {
  constructor(private sharedService: SharedService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(tap((event: HttpEvent<any>) => {

      if (event instanceof HttpResponse) {
        this.sharedService.endHttpLoading();
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        this.sharedService.endHttpLoading();
        if (err.status === 401) { //TODO: Handling for err.status === 403
          window.location.href = '/';
        }
      }
    }));
  }
}
