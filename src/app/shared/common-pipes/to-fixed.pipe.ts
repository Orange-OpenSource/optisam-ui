import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFixed'
})
export class ToFixedPipe implements PipeTransform {

  transform(value: string | number, range: number): unknown {
    if (value.constructor.name === 'String') {
      value = Number(value);
    }

    return parseFloat(value as string).toFixed(2);
  }

}
