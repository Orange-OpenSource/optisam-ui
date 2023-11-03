import { SelectionChange } from '@angular/cdk/collections';
import { AdvanceSearchFieldSelect } from './../../core/modals/common.modal';
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
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvanceSearchComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  @ViewChild('advanceSearch', { static: false })
  advanceSeachElement: ElementRef;
  @Input('advanceSearchModel') model: AdvanceSearchModel;
  @Input('existingFilterFields') existingFilterFields: any = null;
  @Input() hideAdvanceToggle: boolean;
  @Output() advFilterEvent = new EventEmitter();
  filterFields: any = {};
  toggleAdvanceSearch: Boolean = false;
  searchSubscription: Subscription;
  enableSearch: Boolean;
  enableReset: boolean;
  hideToggleFlag: Boolean;
  customFocusClass: string = 'focus-out-class-selector';
  labels: Array<AdvanceSearchField | AdvanceSearchFieldSelect> = [];
  selectionChanged: boolean = false;
  touched: boolean = false;

  constructor(
    public sharedService: SharedService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.searchSubscription = this.sharedService
      .clearSearch()
      .subscribe((data) => {
        this.filterFields = { ...this.existingFilterFields };
        this.getlabels();
      });
    this.initForm();
  }

  ngAfterViewChecked() {
    this.model.other.map((model) => {
      model.type = model?.type || 'text';
      model.show = model?.show === undefined ? true : model?.show;
      return model;
    });
    this.model.translate = this.model?.translate !== false ? true : false;
    this.hideToggleFlag = this.hideAdvanceToggle;
    this.cd.detectChanges();
  }

  initForm() {
    this.filterFields[this.model.primary] = this.existingFilterFields?.[
      this.model.primary
    ]
      ? this.existingFilterFields[this.model.primary]
      : this.filterFields[this.model.primary];
    this.model.other.forEach((element) => {
      if (!element?.show) return; // filter removed that has property show == false;
      this.filterFields[element.key] = this.existingFilterFields?.[element.key]
        ? this.existingFilterFields[element.key]
        : this.filterFields[element.key];
    });
    this.onFocusOut();
  }

  changeSelection(event, key): void {
    // this.applyFilter();
  }

  get isResetDisable(): boolean {
    return !Object.values(this.filterFields).some((f) => !!f) && !this.touched;
  }

  getlabels(): void {
    this.labels = [];
    for (const key in this.filterFields) {
      if (this.filterFields[key])
        this.labels.push(
          this.model.other.find(
            (f: AdvanceSearchField | AdvanceSearchFieldSelect) => f.key === key
          )
        );
    }
  }

  focusout(ev) {
    if (ev.relatedTarget) {
      if (
        ev.relatedTarget.id === 'toggleKeyUp' ||
        ev.relatedTarget.className.indexOf('advanceChild') !== -1 ||
        ev.relatedTarget.className.indexOf('advance-search') !== -1 ||
        ev.relatedTarget
          .closest('mat-calendar, .mat-select')
          ?.classList.contains(this.customFocusClass) ||
        ev.relatedTarget.closest(`.${this.customFocusClass}`) ||
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
    this.touched = false;
  }

  applyFilter() {
    const dateFields = this.model.other
      .filter((m) => m.type === 'date' && m.show)
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
