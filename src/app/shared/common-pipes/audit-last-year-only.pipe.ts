import { Pipe, PipeTransform } from '@angular/core';
import { Audit } from '@core/modals';

@Pipe({
  name: 'auditLastYearOnly',
})
export class AuditLastYearOnlyPipe implements PipeTransform {
  transform(audits: Audit[]): string {
    if (audits?.constructor.name !== 'Array' || audits?.length === 0) return '';
    const lastDate = audits[audits.length - 1].date;
    if (!lastDate) return '';
    return String(new Date(lastDate).getFullYear());
  }
}
