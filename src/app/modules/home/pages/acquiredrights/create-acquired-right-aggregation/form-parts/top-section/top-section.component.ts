import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  AggregationGetResponse,
  GetAggregationParams,
  AggregationSingle,
} from '@core/modals';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from '@core/services/common.service';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { ProductService } from '@core/services/product.service';

@Component({
  selector: 'app-top-section',
  templateUrl: './top-section.component.html',
  styleUrls: ['./top-section.component.scss'],
})
export class TopSectionComponent implements OnInit, DoCheck {
  aggregationForm: FormGroup;
  aggregationList: any[] = [];
  currentPageNum: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc' = 'asc';
  pageSize: number = 50;
  constructor(
    private fb: FormBuilder,
    private cs: CommonService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.getAggregationList();
  }

  ngDoCheck(): void {}

  formInit(): void {
    this.aggregationForm = this.fb.group({
      sku: this.fb.control('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9_.]*$/),
      ]),
      aggregationName: this.fb.control(null, Validators.required),
      // aggregationID: this.fb.control(null, Validators.required),
    });
  }

  get aggregationName(): FormControl {
    return this.aggregationForm.get('aggregationName') as FormControl;
  }

  get sku() {
    return this.aggregationForm.get('sku');
  }

  // get aggregationID()
  // {
  //   return this.aggregationForm.get('aggregationID');
  // }

  getAggregationList(): void {
    // this.productService.getAggregationListNew().subscribe((res) => {
    //   this.aggregationList = res;
    // }, console.log);

    const param: GetAggregationParams = {
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      page_size: this.pageSize,
      page_num: 1,
      sort_by: 'aggregation_name',
      sort_order: this.sortOrder,
    };
    this.productService.getAggregationListNew(param).subscribe(
      (data: AggregationGetResponse) => {
        this.aggregationList = data.aggregations;

        // this.aggregationList = this.aggregationList;

        console.log(this.aggregationList);
      },
      (error) => {
        console.log(
          'There was an error while retrieving aggregations !!!' + error
        );
      }
    );
  }
}
