import { Pipe, PipeTransform } from '@angular/core';
import * as COUNTRY_CODES from '@assets/files/country_code.json';

@Pipe({
  name: 'isFlagAvailable',
})
export class IsFlagAvailablePipe implements PipeTransform {
  transform(countryCode: string): boolean {
    if (countryCode in COUNTRY_CODES?.['default']) {
      return true;
    }
    return false;
  }
}
