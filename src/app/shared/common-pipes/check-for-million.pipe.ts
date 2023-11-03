import { Pipe, PipeTransform } from '@angular/core';
import { convertToInternationalCurrencySystem } from '@core/util/common.functions';

@Pipe({
  name: 'checkForMillion'
})
export class CheckForMillionPipe implements PipeTransform {

  transform(value: any): string | number {
    value = isNaN(value) ? 0 : Number(value);
    if (value >= 1.0e+6) {
      return convertToInternationalCurrencySystem(value);
    }
    return value.toLocaleString();
  }

}
