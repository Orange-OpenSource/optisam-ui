import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  AcquiredRightAggregationBody,
  AggregationData,
  AggregationGetResponse,
  AggregationSingle,
  GetAggregationParams,
} from '@core/modals';
import { CommonService } from '@core/services/common.service';
import { ProductService } from '@core/services/product.service';
import { LOCAL_KEYS } from '@core/util/constants/constants';

@Component({
  selector: 'app-edit-top-section',
  templateUrl: './edit-top-section.component.html',
  styleUrls: ['./edit-top-section.component.scss'],
})
export class EditTopSectionComponent implements OnInit {
  aggregationForm: FormGroup;
  data: AcquiredRightAggregationBody;
  pageSize: number = 200;
  sortOrder: 'asc' | 'desc' = 'asc';
  aggregationList: AggregationSingle[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private cs: CommonService
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.productService
      .getAggregationData()
      .subscribe((data: AcquiredRightAggregationBody) => {
        this.data = data;
        this.getAggregationList();
      });
  }

  formInit(): void {
    this.aggregationForm = this.fb.group({
      sku: this.fb.control({ value: '', disabled: true }),
      aggregationName: this.fb.control(
        { value: null, disabled: false },
        Validators.required
      ),
    });
  }

  get sku(): FormControl {
    return this.aggregationForm.get('sku') as FormControl;
  }

  get aggregationName(): FormControl {
    return this.aggregationForm.get('aggregationName') as FormControl;
  }

  getAggregationList(): void {
    const param: GetAggregationParams = {
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      page_size: this.pageSize,
      page_num: 1,
      sort_by: 'aggregation_name',
      sort_order: this.sortOrder,
    };

    this.productService.getAggregationListNew(param).subscribe(
      ({ aggregations }: AggregationGetResponse) => {
        this.aggregationList = aggregations;
        this.aggregationForm.setValue({
          sku: this.data?.sku,
          aggregationName: this.aggregationList.find(
            (a) => a.aggregation_name === this.data.aggregation_name
          ).ID,
        });
      },
      (error) => {
        console.log(
          'There was an error while retrieving aggregations !!!' + error
        );
      }
    );
  }
}
