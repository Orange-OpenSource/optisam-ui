import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productLicense',
})
export class ProductLicensePipe implements PipeTransform {
  transform(license: 'CLOSEDSOURCE' | 'OPENSOURCE' | 'NONE'): string {
    switch (license) {
      case 'CLOSEDSOURCE':
        return 'CLOSED_SOURCE';
        break;
      case 'OPENSOURCE':
        return 'OPEN_SOURCE';
        break;
      default:
        return "NONE"
        break;
    }
  }
}
