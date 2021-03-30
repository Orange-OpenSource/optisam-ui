// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SharedService } from '../shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.scss']
})
export class AdvanceSearchComponent implements OnInit, OnDestroy {
  @ViewChild('advanceSearch', {static: false}) advanceSeachElement: ElementRef;
  @Input('advanceSearchModel') model: any;
  @Input('existingFilterFields') existingFilterFields: any;
  @Input() hideAdvanceToggle: boolean;
  @Output() advFilterEvent = new EventEmitter();
  filterFields: any = {};
  toggleAdvanceSearch: Boolean = false;
  searchSubscription: Subscription;
  enableSearch:Boolean;
  enableReset:Boolean;
  hideToggleFlag: Boolean;

  constructor(
    public sharedService: SharedService,
    private cd: ChangeDetectorRef
  ) { 
    this.searchSubscription = this.sharedService.clearSearch().subscribe(data => {
      this.filterFields = {};
    });
  }

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewChecked() {
    this.hideToggleFlag = this.hideAdvanceToggle;
    this.cd.detectChanges();
  }

  initForm() {
    this.filterFields[this.model.primary] = (this.existingFilterFields)?this.existingFilterFields[this.model.primary]:'';
    this.model.other.forEach(element => {
      this.filterFields[element.key] = (this.existingFilterFields)?this.existingFilterFields[element.key]:'';
    });
    this.onFocusOut();
  }

  focusout(ev) {
    if (ev.relatedTarget) {
      if (ev.relatedTarget.id === 'toggleKeyUp' || ev.relatedTarget.className.indexOf('advanceChild') !== -1 || ev.relatedTarget.className.indexOf('advance-search') !== -1) {
        return;
      }
    }
    this.toggleAdvanceSearch = false;
  }
  onFocusOut() {
    this.enableSearch = true;
    this.enableReset = false;
    const allAttrCount = Object.keys(this.filterFields).length || 0;
    let emptyAttrCount = 0;
    for(let attr in this.filterFields) {
      if((this.filterFields[attr]||'').length > 0) {
        this.enableReset = true;
        if((this.filterFields[attr]||'').length < 3) {
          this.enableSearch = false;
        }
      } else {
        emptyAttrCount++;
      }
    }
    if(emptyAttrCount === allAttrCount) {
      this.enableSearch = false;
      this.enableReset = false;
    }
  }

  openAdvanceSearch() {
    this.initForm();
    this.toggleAdvanceSearch = !this.toggleAdvanceSearch;
  }

  applyFilter() {
    this.advFilterEvent.emit(this.filterFields);
  }

  clearFilter() {
    this.filterFields[this.model.primary] = '';
    this.model.other.forEach(ele => {
      this.filterFields[ele.key] = '';
    });
    this.enableSearch = false;
    this.enableReset = false;
    this.applyFilter();
  }

  pressEnter(filteredField?:any,toggle?: boolean) {
    if ( (this.filterFields[this.model.primary] && this.filterFields[this.model.primary].length>2)||(filteredField && filteredField.length > 2)) {
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
