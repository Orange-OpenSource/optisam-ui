import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimText',
})
export class TrimTextPipe implements PipeTransform {
  transform(text: string, limit: number): string {
    if ((text?.length || 0) <= limit) return text;
    return text.substring(0, limit - 1) + '...';
  }
}
