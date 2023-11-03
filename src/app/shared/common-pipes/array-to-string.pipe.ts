import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayToString'
})
export class ArrayToStringPipe implements PipeTransform {

  transform(value: string[] | number[], newLine: boolean = false): string {
    if (value.constructor.name !== "Array") return 'Array don\'t consist only number/string';
    return value.join(', ' + (newLine ? '\n' : ''));
  }

}
