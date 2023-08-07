import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFr'
})
export class FrenchNumberPipe implements PipeTransform {

  transform(value: number | string): string | number {
    debugger;
    if (!value) return value;
    console.log(value);
    let number: number;
    if (value.constructor.name === 'String') {
      number = Number(value);
      if (isNaN(number)) return value;
    }
    return number?.toLocaleString() || '';
  }

}
