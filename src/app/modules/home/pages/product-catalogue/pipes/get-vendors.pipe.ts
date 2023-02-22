import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getVendors',
})
export class GetVendorsPipe implements PipeTransform {
  transform(vendors: { name: string }[]): string {
    if (!vendors) return '';
    return vendors.map((v) => v.name).join(', ');
  }
}
