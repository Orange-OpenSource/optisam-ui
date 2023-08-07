import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'remainingEntities',
})
export class RemainingEntitiesPipe implements PipeTransform {
  transform(entities: string[], showScopeCount: number): string {
    if (!entities?.length) return '';
    return entities?.slice(showScopeCount).join('\n');
  }
}
