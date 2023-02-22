import { Pipe, PipeTransform } from '@angular/core';

interface Audits {
  date: string;
  entity: string;
}

@Pipe({
  name: 'auditLastYear',
})
export class AuditLastYearPipe implements PipeTransform {
  transform(audits: Audits[]): string {
    if (audits.constructor.name !== 'Array' || audits.length === 0) return '';
    const lastDate = audits[audits.length - 1].date;
    if (!lastDate) return '';
    return String(new Date(lastDate).getFullYear());
  }
}
