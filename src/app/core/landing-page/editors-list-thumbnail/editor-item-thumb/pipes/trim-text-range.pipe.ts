import { ElementRef, Pipe, PipeTransform } from '@angular/core';
import { TrimTextRangeInput } from '@core/modals';

@Pipe({
  name: 'trimTextRange',
})
export class TrimTextRangePipe implements PipeTransform {
  text: string = '';
  transform(text: string, input: TrimTextRangeInput): string {
    this.text = text;
    if (text?.length <= input?.min?.char) return text;
    const allowedChars = this.getAllowedChars(input);
    return text?.length <= allowedChars
      ? text
      : text?.substring(0, allowedChars) + '...';
  }

  private getAllowedChars(input: TrimTextRangeInput): number {
    const currentWidth: number = Math.floor(input?.currentWidth || 0);
    const charExtensionAllowed =
      (input?.max?.char || 0) - (input?.min?.char || 0);
    const widthExtensionAllowed =
      (input?.max?.maxWidth || 0) - (input?.min?.minWidth || 0);

    const widthDiff = currentWidth - (input?.min?.minWidth || 0);
    const increased = widthDiff / widthExtensionAllowed;
    const allowedChar =
      input?.min?.char + Math.floor(charExtensionAllowed * increased);
    return allowedChar;
  }
}
