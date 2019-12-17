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

