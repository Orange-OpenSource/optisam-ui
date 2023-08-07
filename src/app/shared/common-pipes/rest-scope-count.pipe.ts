import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'restScopeCount',
})
export class RestScopeCountPipe implements PipeTransform {
  transform(value: string[], showScopeCount: number): number {
    if (!value?.length) return 0;
    const availableCount: number = value.length - showScopeCount;
    return availableCount > 0 ? availableCount : 0;
  }
}
