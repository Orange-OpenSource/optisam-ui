import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByWord',
})
export class FilterByWordPipe implements PipeTransform {
  transform(value: any, input: string): unknown {
    if (input === '') return value;
    const regex = new RegExp('(.*)' + input.toLowerCase() + '(.*)');
    return value.filter((v: string) => regex.test(v.toLowerCase()));
  }
}
