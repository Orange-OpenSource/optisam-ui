import { Pipe, PipeTransform } from '@angular/core';

type DisplayedRows = { name: string; schemaName: string };
@Pipe({
  name: 'getName',
})
export class GetEquipmentAttributeNamePipe implements PipeTransform {
  transform(displayedRows: DisplayedRows[]): string[] {
    return displayedRows.map((d: DisplayedRows) => d.name);
  }
}
