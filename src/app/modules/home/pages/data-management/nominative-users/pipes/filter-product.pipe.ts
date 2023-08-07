import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProduct',
})
export class FilterProductPipe implements PipeTransform {
  transform(products: string[], productInput: string): string[] {
    const data: string[] = (products || []).filter((product: string) =>
      product
        .toLowerCase()
        .includes(productInput ? productInput.toLowerCase() : '')
    );
    return [...new Set(data)];
  }
}
