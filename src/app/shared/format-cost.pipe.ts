import { Pipe, PipeTransform } from '@angular/core';
import { getCurrencySymbol, formatCurrency } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
registerLocaleData(localeEn, 'en');

@Pipe({
  name: 'formatCost',
})
export class FormatCostPipe implements PipeTransform {
  transform(value: number): string | null {
    return formatCurrency(value, 'en', '', 'EUR', '1.2-2');
  }
}
