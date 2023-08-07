import { Pipe, PipeTransform } from '@angular/core';
import { ProductLocation, Products } from '@core/modals';

@Pipe({
  name: 'isSaas',
})
export class IsSaasPipe implements PipeTransform {
  transform(product: Products): boolean {
    return product?.location === ProductLocation.SAAS;
  }
}
