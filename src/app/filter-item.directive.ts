// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

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
