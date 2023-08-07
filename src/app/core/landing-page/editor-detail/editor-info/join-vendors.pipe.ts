import { Pipe, PipeTransform } from '@angular/core';
import { ProductCatalogVendor } from '@core/modals';

@Pipe({
  name: 'joinVendors'
})
export class JoinVendorsPipe implements PipeTransform {

  transform(vendors: ProductCatalogVendor[], delimiter: string = ', '): string {
    if (!vendors || !vendors?.length) return '';
    return vendors.reduce((vendorString: string, vendor: ProductCatalogVendor, index: number) => {
      if (vendor?.name?.trim())
        vendorString += (index === 0 ? '' : delimiter) + vendor.name.trim();
      return vendorString;
    }, '')

  }

}
