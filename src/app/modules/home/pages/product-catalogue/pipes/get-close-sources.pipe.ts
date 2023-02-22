import { Pipe, PipeTransform } from '@angular/core';
import { ProductCatalogCloseSource } from '@core/modals';

@Pipe({
  name: 'getCloseSources',
})
export class GetCloseSourcesPipe implements PipeTransform {
  transform(closeSources: ProductCatalogCloseSource): string[] {
    return closeSources.closeLicences;
  }
}
