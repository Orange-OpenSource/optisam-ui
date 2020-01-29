// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

// import { Injectable } from '@angular/core';
// import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';

// @Injectable()

// export class UnauthorisedInterceptor implements HttpInterceptor {

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

//     return next.handle(request).pipe(tap((event: HttpEvent<any>) => {

//       if (event instanceof HttpResponse) {

//       }
//     }, (err: any) => {
//       if (err instanceof HttpErrorResponse) {
//         if (err.status === 403) {
//           window.location.href = '/';
//         }
//       }
//     }));
//   }


// }
