import { Pipe, PipeTransform } from '@angular/core';
import { ProductCatalogVersion } from '@core/modals';

@Pipe({
  name: 'getVersions',
})
export class GetVersionsPipe implements PipeTransform {
  transform(versions: ProductCatalogVersion[]): string[] {
    return versions.map((ver: ProductCatalogVersion) => ver.name);
  }
}
