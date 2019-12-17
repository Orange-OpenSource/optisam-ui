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
      case 'import':
          _url = this.config[caseValue] + _url;
          request = request.clone({url: _url});
          break;

      default:
          break;
    }

    // Check for token to authorize
    const token: string = localStorage.getItem('access_token');
    if (token) {
        request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    }

    //  To exclude Content-Type in import service call
    if (request.url.search('/api/v1/import') === -1) {
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
        if (err.status === 403) {
          window.location.href = '/';
        }
      }
    }));
  }
}

