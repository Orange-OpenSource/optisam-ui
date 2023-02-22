import { Pipe, PipeTransform } from '@angular/core';
import { VersionHeader } from '@core/modals';

@Pipe({
  name: 'checkHeader',
})
export class CheckHeaderPipe implements PipeTransform {
  transform(versionHeaders: VersionHeader[], header: string): boolean {
    return versionHeaders.some((ver: VersionHeader) => ver.key === header);
  }
}
