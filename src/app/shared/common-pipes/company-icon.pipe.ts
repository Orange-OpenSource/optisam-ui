import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
const SERVER: string =
  'https://pr-diod-ocp-fr01-dev-optisam-dev-optisam.oss.eu-west-0.prod-cloud-ocb.orange-business.com/optisam-dev/';
@Pipe({
  name: 'companyIcon',
})
export class CompanyIconPipe implements PipeTransform {
  constructor(protected _sanitizer: DomSanitizer) {}

  transform(companyName: string): Observable<boolean> {
    if (!companyName) return this.isImgUrl('#', companyName);
    return this.isImgUrl(
      SERVER + companyName.toLowerCase().trim() + '.svg',
      companyName
    );
  }

  private isImgUrl(url: string, companyName: string): Observable<boolean> {
    return from(
      fetch(url, {
        method: 'GET',
      })
        .then((res) => {
          const response =
            res.headers.get('Content-Type')?.startsWith('image') || false;
          console.log(companyName, response, res.headers, 'status', res);
          return response;
        })
        .catch((e) => {
          console.log(companyName, e);
          return false;
        })
    );
  }
}
