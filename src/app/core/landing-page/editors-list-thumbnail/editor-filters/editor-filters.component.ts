import { SharedService } from 'src/app/shared/shared.service';
import * as COUNTRY_CODES from '@assets/files/country_code.json';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import {
  EditorFiltersResponse,
  ErrorResponse,
  Filter,
  FilterType,
  CountryFilter
} from '@core/modals';
import { ProductCatalogService } from '@core/services';
import { ALL_SELECTION_NAME } from '@core/util/constants/constants';
import { Observable } from 'rxjs';
import { pluck, tap } from 'rxjs/operators';

@Component({
  selector: 'app-editor-filters',
  templateUrl: './editor-filters.component.html',
  styleUrls: ['./editor-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorFiltersComponent implements OnInit {
  form: FormGroup;
  groupContract: Filter[] = [];
  auditYear: Filter[] = [];
  countryCode: CountryFilter[] = [];
  entities: Filter[] = [];
  totalGroupContract: number = 0;
  totalAuditYear: number = 0;
  totalCountryCode: number = 0;
  totalEntities: number = 0;
  valueObject: any = {};
  allSelection: string = ALL_SELECTION_NAME;
  loadingFilter: boolean = false;

  constructor(
    private container: ControlContainer,
    private pc: ProductCatalogService,
    private cd: ChangeDetectorRef,
    private ss: SharedService
  ) { }

  ngOnInit(): void {
    this.form = this.container.control as FormGroup;
    this.getFilters();
  }

  private getFilters(): void {
    this.loadingFilter = true;
    this.pc.getEditorFilters().subscribe(
      ({
        groupContract,
        countryCode,
        year,
        entities,
      }: EditorFiltersResponse) => {
        this.loadingFilter = true;
        this.totalGroupContract = groupContract.total_count;
        this.totalAuditYear = year.total_count;
        this.totalCountryCode = countryCode.total_count;
        this.totalEntities = entities.total_count;
        this.groupContract = groupContract.filter;
        this.auditYear = year.filter;
        this.entities = entities.filter;
        this.countryCode = countryCode.filter.reduce((countryObject: CountryFilter[], country: Filter, index: number) => {
          countryObject = [...countryObject, { name: { countryCode: country.name, countryName: COUNTRY_CODES?.['default']?.[country.name] }, count: country.count }]
          return countryObject;
        }, []);
        this.cd.detectChanges();
      },
      (e: ErrorResponse) => {
        this.ss.commonPopup({
          title: 'ERROR',
          buttonText: 'OK',
          message: e.message,
          singleButton: true,
        });
      }
    );
  }

  selectionChange(
    e: MatSelectChange,
    allOption: MatOption,
    data: Array<Filter | CountryFilter>
  ): void {
    const previousValue: string[] =
      this.valueObject?.[e.source.ngControl.name]?.previousValue || [];
    let currentValue: string[] = e.value;
    const countObject: object = {};

    if (previousValue.length > currentValue.length && currentValue.includes(this.allSelection)) {
      allOption.deselect()
      currentValue = e.value.filter(val => val !== this.allSelection);
      e.source.ngControl.control.patchValue(currentValue)
      this.setPreviousValue(e, currentValue);
    }
    console.log('currentValue', currentValue)
    console.log('currentValue length', currentValue.length);




    [...previousValue, ...currentValue].forEach((option: string) => {
      if (option in countObject) {
        countObject[option] += 1;
      } else {
        countObject[option] = 1;
      }
    });



    if (
      Object.keys(countObject).find((key) => countObject[key] === 1) ===
      this.allSelection
    ) {


      if (allOption.selected) {
        const newValue = [
          ...data.map((d: CountryFilter | Filter) => d.name?.['countryCode'] || d.name),
          this.allSelection,
        ];
        e.source.ngControl.control.patchValue(newValue);
        this.setPreviousValue(e, newValue);
        return;
      }
      e.source.ngControl.control.patchValue([]);
      this.setPreviousValue(e, []);
      return;
    }


    // if (!currentValue?.includes(this.allSelection) && currentValue?.length === (e?.source?.options?.length - 1)) {
    //   allOption.select();
    //   currentValue = [this.allSelection, ...e.value];
    //   // e.source.ngControl.control.patchValue(currentValue)
    //   this.setPreviousValue(e, currentValue);
    // }


    this.setPreviousValue(e, currentValue);
  }

  setPreviousValue(e: MatSelectChange, value: string[]) {
    if (this.valueObject?.[e.source.ngControl.name]) {
      this.valueObject[e.source.ngControl.name]['previousValue'] = value;
    } else {
      this.valueObject[e.source.ngControl.name] = { previousValue: value };
    }
  }

  changeOption(event: any): void {
    console.log(event);
  }
}
