import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'floor',
})
export class FloorPipe implements PipeTransform {
  transform(value: number): number {
    if (value > 0) {
      var num1 = Math.floor(value);
      return num1;
    }

    var num1 = Math.ceil(value);
    return num1;
  }
}
