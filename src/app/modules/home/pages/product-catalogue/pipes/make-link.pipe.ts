import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'makeLink',
})
export class MakeLinkPipe implements PipeTransform {
  transform(link: string): string {
    if (link.match(/http:|https:/g) !== null) return link;
    return `http://${link}`;
  }
}
