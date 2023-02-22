import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getOpenSource'
})
export class GetOpenSourcePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
