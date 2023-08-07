import { Pipe, PipeTransform } from '@angular/core';
import { MAX_CHARS_ENTITY_LABEL } from '@core/util/constants/constants';

const padding: number = 8 * 2;
const letterWidth: number = 10.5;
const borderWidth: number = 1 * 2;
const restEntityBlockWidth: number = 64;
const scopeGap: number = 3;
const containerPadding: number = 8 * 2;
const containerBorderWidth: number = 1 * 2;


interface EntitySpaceAndCount { allEntityAcquiredSpace: number; count: number }

interface VisibleEntitiesAndCount { visibleScopes: string[], restScopeCount: number }

@Pipe({
  name: 'takeFirst',
})
export class TakeFirstPipe implements PipeTransform {
  containerAvailableWidth: number = 0;

  transform(value: string[], containerWidth: number, fullWidth: boolean = false): VisibleEntitiesAndCount {
    if (!value?.length || !value?.join('')?.length) return { visibleScopes: [], restScopeCount: 0 };
    value.sort((a, b) => a.length - b.length);
    this.containerAvailableWidth = containerWidth - containerPadding - containerBorderWidth;
    const allEntityAcquiredSpaceObject: EntitySpaceAndCount = this.getAllEntityAcquiredSpace(value);
    const allEntityAcquiredSpace: number = allEntityAcquiredSpaceObject.allEntityAcquiredSpace;
    if (this.containerAvailableWidth >= allEntityAcquiredSpace) {
      return { visibleScopes: value, restScopeCount: 0 };
    }
    let count: number = allEntityAcquiredSpaceObject.count;
    if (!fullWidth) {
      this.containerAvailableWidth -= restEntityBlockWidth;
      count = this.getAllEntityAcquiredSpace(value).count;
    }
    return { visibleScopes: value.slice(0, count), restScopeCount: value.length - count }

  }

  private getAllEntityAcquiredSpace(value: string[]): EntitySpaceAndCount {
    return value.reduce((data: EntitySpaceAndCount, scope: string, index: number) => {
      const gap: number = index === 0 ? 0 : scopeGap;
      data.allEntityAcquiredSpace += gap + (scope.length * letterWidth) + padding + borderWidth;
      if (data.allEntityAcquiredSpace <= this.containerAvailableWidth) data.count = index + 1;
      return data;
    }, { allEntityAcquiredSpace: 0, count: 0 })
  }
}
