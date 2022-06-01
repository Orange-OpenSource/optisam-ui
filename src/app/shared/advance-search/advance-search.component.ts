import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectorRef,
  SimpleChanges,
  AfterViewChecked,
  OnChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SharedService } from '../shared.service';
import { Subscription } from 'rxjs';
import { AdvanceSearchField, AdvanceSearchModel } from '@core/modals';
import { ISOFormat } from '@core/util/common.functions';

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvanceSearchComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  @ViewChild('advanceSearch', { static: false })
  advanceSeachElement: ElementRef;
  @Input('advanceSearchModel') model: AdvanceSearchModel;
  @Input('existingFilterFields') existingFilterFields: any;
  @Input() hideAdvanceToggle: boolean;
  @Output() advFilterEvent = new EventEmitter();
  filterFields: any = {};
  toggleAdvanceSearch: Boolean = false;
  searchSubscription: Subscription;
  enableSearch: Boolean;
  enableReset: boolean;
  hideToggleFlag: Boolean;
  customDateClass: string = 'advance_search_date';
  labels: AdvanceSearchField[] = [];

  constructor(
    public sharedService: SharedService,
    private cd: ChangeDetectorRef
  ) {
    this.searchSubscription = this.sharedService
      .clearSearch()
      .subscribe((data) => {
        this.filterFields = {};
        this.getlabels();
      });
  }

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewChecked() {
    this.model.other.map((model) => {
      model.type = model?.type || 'text';
      return model;
    });
    this.hideToggleFlag = this.hideAdvanceToggle;
    this.cd.detectChanges();
  }

  initForm() {
    this.filterFields[this.model.primary] = this.existingFilterFields
      ? this.existingFilterFields[this.model.primary]
      : this.filterFields[this.model.primary];
    this.model.other.forEach((element) => {
      this.filterFields[element.key] = this.existingFilterFields
        ? this.existingFilterFields[element.key]
        : this.filterFields[element.key];
    });
    this.onFocusOut();
  }

  get isResetDisable(): boolean {
    return !Object.values(this.filterFields).some((f) => !!f);
  }

  getlabels(): void {
    this.labels = [];
    for (const key in this.filterFields) {
      if (this.filterFields[key])
        this.labels.push(
          this.model.other.find((f: AdvanceSearchField) => f.key === key)
        );
    }
  }

  focusout(ev) {
    if (ev.relatedTarget) {
      console.log(ev.relatedTarget);
      if (
        ev.relatedTarget.id === 'toggleKeyUp' ||
        ev.relatedTarget.className.indexOf('advanceChild') !== -1 ||
        ev.relatedTarget.className.indexOf('advance-search') !== -1 ||
        ev.relatedTarget
          .closest('mat-calendar')
          ?.classList.contains(this.customDateClass) ||
        !!ev.relatedTarget.closest('mat-datepicker-toggle')
      ) {
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
    for (let attr in this.filterFields) {
      if ((this.filterFields[attr] || '').length > 0) {
        this.enableReset = true;
        // if ((this.filterFields[attr] || "").length < 3) {
        //   this.enableSearch = false;
        // }
      } else {
        emptyAttrCount++;
      }
    }
    if (emptyAttrCount === allAttrCount) {
      this.enableSearch = false;
      this.enableReset = false;
    }
  }

  openAdvanceSearch() {
    this.initForm();
    this.toggleAdvanceSearch = !this.toggleAdvanceSearch;
  }

  applyFilter() {
    const dateFields = this.model.other
      .filter((m) => m.type === 'date')
      .map((f) => f.key);
    dateFields.forEach((d) => {
      this.filterFields[d] = !!this.filterFields[d]
        ? ISOFormat(new Date(this.filterFields[d]))
        : this.filterFields[d];
    });
    this.advFilterEvent.emit(this.filterFields);
    this.getlabels();
  }

  clearFilter() {
    this.filterFields[this.model.primary] = '';
    this.model.other.forEach((ele) => {
      this.filterFields[ele.key] = '';
    });
    this.enableSearch = false;
    this.enableReset = false;
    this.applyFilter();
  }

  pressEnter(filteredField?: any, toggle?: boolean) {
    // if (this.filterFields[this.model.primary]) {
    this.applyFilter();
    if (toggle) {
      this.toggleAdvanceSearch = false;
    }
    // }
  }

  removeLabel(label: AdvanceSearchField): void {
    delete this.filterFields[label.key];
    this.applyFilter();
  }

  checkEmpty(value: string): void {
    value === '' && this.applyFilter();
  }

  clearPrimaryFilter(): void {
    delete this.filterFields[this.model.primary];
    this.applyFilter();
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }
}
