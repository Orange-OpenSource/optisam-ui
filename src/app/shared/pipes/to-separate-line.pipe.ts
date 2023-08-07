import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toSeparateLine',
})
export class ToSeparateLinePipe implements PipeTransform {
  transform(array: string[]): string {
    if (array?.constructor?.name !== 'Array') return '';
    return array.reduce((r: string, item: string, i: number) => {
      r += `${i == 0 ? '' : ',\n'}${item}`;
      return r;
    }, '');
  }
}
