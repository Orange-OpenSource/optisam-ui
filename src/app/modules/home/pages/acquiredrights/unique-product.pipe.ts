import { Pipe, PipeTransform } from '@angular/core';
import { AggregationProductObject } from './acquired-rights.modal';

@Pipe({
  name: 'uniqueProduct',
})
export class UniqueProductPipe implements PipeTransform {
  transform(products: AggregationProductObject[]): AggregationProductObject[] {
    const productList: string[] = [];
    return products.filter((product: AggregationProductObject) => {
      const result: boolean = !productList.includes(product.product_name);
      productList.push(product.product_name);
      return result;
    });
  }
}
