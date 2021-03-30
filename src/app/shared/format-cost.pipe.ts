// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Pipe, PipeTransform } from '@angular/core';
import { getCurrencySymbol, formatCurrency } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
registerLocaleData(localeEn, 'en');

@Pipe({
  name: 'formatCost'
})
export class FormatCostPipe implements PipeTransform {

  transform(value: number): string | null {
    return formatCurrency(
      value,
      'en',
      '',
      'EUR',
      '1.2-2',
    );
  }
}
