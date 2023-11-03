import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chopValue'
})
export class ChopValuePipe implements PipeTransform {

  transform(value: number | string, decimal: number = 2): number {
    value = parseFloat(value.toString());
    decimal ??= 2;
    let base: number = 1;
    for (let i = 0; i < Math.floor(Math.abs(decimal)); i++)
      base *= 10;
    if (!decimal) return value;
    return parseInt((value * base).toString()) / base;
  }

}
