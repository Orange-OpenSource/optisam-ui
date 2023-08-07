import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productLicense',
})
export class ProductLicensePipe implements PipeTransform {
  transform(license: 'CLOSEDSOURCE' | 'OPENSOURCE'): string {
    if (license === 'CLOSEDSOURCE') {
      return 'CLOSED_SOURCE';
    }
    return 'OPEN_SOURCE';
  }
}
