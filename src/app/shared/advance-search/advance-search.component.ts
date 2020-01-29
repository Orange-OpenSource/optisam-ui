// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SharedService } from '../shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.scss']
})
export class AdvanceSearchComponent implements OnInit, OnDestroy {
  @ViewChild('advanceSearch') advanceSeachElement: ElementRef;
  @Input('advanceSearchModel') model: any;
  @Input() hideAdvanceToggle: boolean;
  @Output() advFilterEvent = new EventEmitter();
  filterFields: any = {};
  toggleAdvanceSearch: Boolean = false;
  searchSubscription: Subscription;

  constructor(
    public sharedService: SharedService
  ) { }

  ngOnInit() {
    this.filterFields[this.model.primary] = '';
    this.model.other.forEach(element => {
      this.filterFields[element.key] = '';
    });
    this.searchSubscription = this.sharedService.clearSearch().subscribe(data => {
      this.filterFields = {};
    });
  }

  focusout(ev) {
    if (ev.relatedTarget) {
      if (ev.relatedTarget.id === 'toggleKey' || ev.relatedTarget.className.indexOf('advanceChild') !== -1 || ev.relatedTarget.className.indexOf('advance-search') !== -1) {
        return;
      }
    }
    this.toggleAdvanceSearch = false;
  }

  openAdvanceSearch() {
    this.toggleAdvanceSearch = !this.toggleAdvanceSearch;
    if (this.toggleAdvanceSearch) {
      setTimeout(() => {
        this.advanceSeachElement.nativeElement.focus();
      }, 10);
    }
  }

  applyFilter() {
    this.advFilterEvent.emit(this.filterFields);
  }

  clearFilter() {
    this.filterFields[this.model.primary] = '';
    this.model.other.forEach(ele => {
      this.filterFields[ele.key] = '';
    });
    this.applyFilter();
  }

  pressEnter(toggle: boolean) {
    if (this.filterFields[this.model.primary] && this.filterFields[this.model.primary].length > 2) {
      this.applyFilter();
      if (toggle) {
        this.toggleAdvanceSearch = false;
      }
    }
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

}
