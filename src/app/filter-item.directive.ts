import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[mat-filter-item]',
})
export class FilterItemDirective {
  @HostListener('click', ['$event'])
  onClick(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
}
