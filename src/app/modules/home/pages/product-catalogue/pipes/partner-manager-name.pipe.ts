import { Pipe, PipeTransform } from '@angular/core';
import { PartnerManager } from '@core/modals';

@Pipe({
  name: 'partnerManagerName',
})
export class PartnerManagerNamePipe implements PipeTransform {
  transform(partnerManagers: PartnerManager[]): string {
    return (partnerManagers ?? []).reduce(
      (pMString: string, pm: PartnerManager, i: number) => {
        if (!!pm?.name?.trim()) pMString += (i == 0 ? '' : ', ') + pm.name;
        return pMString;
      },
      ''
    );
  }
}
