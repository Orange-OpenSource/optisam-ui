import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkMetricsLength'
})
export class CheckMetricsLengthPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.split(',').length > 1;
  }

}
