import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkAggregationMetricLength'
})
export class CheckAggregationMetricLengthPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.split(',').length > 1;
  }

}
