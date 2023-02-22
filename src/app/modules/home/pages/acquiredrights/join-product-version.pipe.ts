import { Pipe, PipeTransform } from '@angular/core';
import { ProductVersionMapping } from '@core/modals';

@Pipe({
  name: 'joinProductVersion',
})
export class JoinProductVersionPipe implements PipeTransform {
  transform(productVersions: ProductVersionMapping[]): string {
    return productVersions
      ?.map(
        ({ product_name, product_version }: ProductVersionMapping) =>
          `${product_name}${product_version ? ' ' + product_version : ''}`
      )
      .join(',\n\r');
  }
}
