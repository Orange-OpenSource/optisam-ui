import { Pipe, PipeTransform } from '@angular/core';
import * as COUNTRY_CODES from '@assets/files/country_code.json';

@Pipe({
  name: 'countryNameFromCode',
})
export class CountryNameFromCodePipe implements PipeTransform {
  transform(countryCode: string): string {
    if (!countryCode) return '';
    return COUNTRY_CODES?.['default']?.[countryCode] || '';
  }
}
