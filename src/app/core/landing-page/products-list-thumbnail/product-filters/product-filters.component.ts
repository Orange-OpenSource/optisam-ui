import { compilePipeFromMetadata } from '@angular/compiler';
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
  ProductFiltersResponse,
} from '@core/modals';
import { ProductCatalogService } from '@core/services';
import { ALL_SELECTION_NAME } from '@core/util/constants/constants';
import { Observable } from 'rxjs';
import { pluck, tap } from 'rxjs/operators';

@Component({
  selector: 'app-product-filters',
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.scss'],
})
export class ProductFiltersComponent implements OnInit {
  form: FormGroup;
  filters$: Observable<ProductFiltersResponse | ErrorResponse>;
  deploymentType$: Observable<Filter[]>;
  vendor$: Observable<Filter[]>;
  recommendation$: Observable<Filter[]>;
  entities$: Observable<Filter[]>;
  licensing$: Observable<Filter[]>;
  totalDeploymentType: number = 0;
  totalVendor: number = 0;
  totalRecommendation: number = 0;
  totalEntities: number = 0;
  totalLicensing: number = 0;
  valueObject: any = {};
  allSelection: string = ALL_SELECTION_NAME;
  deploymentType: Filter[] = [];
  vendor: Filter[] = [];
  recommendation: Filter[] = [];
  entities: Filter[] = [];
  licensing: Filter[] = [];

  constructor(
    private container: ControlContainer,
    private pc: ProductCatalogService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.container.control as FormGroup;
    this.getFilters();
  }

  private getFilters(): void {
    this.pc.getProductFilters().subscribe((res: ProductFiltersResponse) => {
      console.log('res', res);
      this.deploymentType = res.deploymentType.filter;
      this.vendor = res.vendors.filter;
      this.recommendation = res.recommendation.filter;
      this.entities = res.entities.filter;
      this.licensing = res.licensing.filter;
      this.totalDeploymentType = res.deploymentType.total_count;
      this.totalVendor = res.vendors.total_count;
      this.totalEntities = res.entities.total_count;
      this.totalRecommendation = res.recommendation.total_count;
      this.totalLicensing = res.licensing.total_count;
      this.cd.detectChanges();
    });
  }

  selectionChange(
    e: MatSelectChange,
    allOption: MatOption,
    data: Filter[]
  ): void {
    const previousValue: string[] =
      this.valueObject?.[e.source.ngControl.name]?.previousValue || [];
    const currentValue: string[] = e.value;
    const countObject: object = {};
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
          ...data.map((d: Filter) => d.name),
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
    this.setPreviousValue(e, e.value);
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
