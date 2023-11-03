import { Pipe, PipeTransform } from '@angular/core';
import { frenchNumber } from '@core/util/common.functions';

@Pipe({
  name: 'numberFr'
})
export class FrenchNumberPipe implements PipeTransform {

  transform(value: number | string, decimalCount: number = 2): string | number {
    return frenchNumber(value, decimalCount)
  }



}


