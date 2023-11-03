import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { ProductService } from 'src/app/core/services/product.service';
import { MetricService } from 'src/app/core/services/metric.service';
import {
  AggregationGetResponse,
  AggregationSingle,
  ErrorResponse,
  GetAggregationParams,
  ListProductQueryParams,
  MetricSimulationRequest,
  ProductListResponse,
} from '@core/modals';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from '@core/services/common.service';
import { ChopValuePipe } from '@shared/common-pipes';

@Component({
  selector: 'app-product-simulation',
  templateUrl: './product-simulation.component.html',
  styleUrls: ['./product-simulation.component.scss'],
  providers: [ChopValuePipe]
})
export class ProductSimulationComponent implements OnInit {
  editorList: any[] = [];
  productList: any[] = [];
  metricList: any[] = [];
  entityList: any[] = [];
  loadingSubscription: Subscription;
  HTTPActivity: Boolean;
  simulateObj: any;
  simulateAggregationObj: any;
  simulatedResults: any[] = [];
  simulationMetrics: any[] = [];
  simulateHttpCount: number;
  _loading: Boolean;
  filteredOptions: any[];
  filteredAggregationOptions: any[];
  sortBy: string = 'aggregation_name';
  sortOrder: 'asc' | 'desc' = 'asc';
  totalRecords: number;
  pageSize: number = 50;
  pageSizeOptions: number[] = [50, 100, 200];
  currentPageNum: number = 1;
  length: any;
  aggregationData: any[] = [];
  options: any;
  invalidProductFlag: Boolean;
  invalidAggregationFlag: Boolean;
  adminRoles: string[] = ['ADMIN', 'SUPER_ADMIN'];
  role: string;
  count: any = 0;
  displayedColumns: string[] = ['metric', 'unitCost'];
  body: any;
  selectedScope: any;

  constructor(
    private sharedService: SharedService,
    private productService: ProductService,
    private metricService: MetricService,
    private cs: CommonService,
    private chop: ChopValuePipe
  ) {
    this.loadingSubscription = this.sharedService
      .httpLoading()
      .subscribe((data) => {
        this.HTTPActivity = data;
      });
    this.selectedScope = localStorage.getItem('scope');
  }

  ngOnInit() {
    this.simulateObj = {
      viewEntity: [],
      entity: '',
      editor: '',
      product: '',
      currentEntity: '',
    };

    this.simulateAggregationObj = {
      viewEntity: [],
      entity: '',
      editor: '',
      aggregation: '',
      currentEntity: '',
    };
    this.role = this.cs.getLocalData(LOCAL_KEYS.ROLE);
    this.getEditorsList();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.productList.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onChangeProduct(ev) {
    this.filteredOptions = this.productList.filter((option) =>
      option.name.toLowerCase().startsWith(ev.target.value.toLowerCase())
    );
  }

  onChangeAggregation(ev) {
    this.filteredAggregationOptions = this.aggregationData;
  }

  onProductNotSelected() {
    this.invalidProductFlag = false;
    let filteredProducts = this.productList.filter((option) => {
      if (this.simulateObj.product) {
        option.name + ' - ' + option.swidTag ===
          this.simulateObj.product.name +
          ' - ' +
          this.simulateObj.product.swidTag;
      }
    });
    if (filteredProducts.length === 0) {
      this.invalidProductFlag = true;
    }
  }

  onAggregationNotSelected() {
    this.invalidAggregationFlag = false;
    let filteredAggregations = this.aggregationData.filter((option) => {
      if (this.simulateAggregationObj.aggregation) {
        option.name + ' - ' + option.swidTag ===
          this.simulateAggregationObj.aggregation +
          ' - ' +
          this.simulateAggregationObj.product.swidTag;
      }
    });
    if (filteredAggregations.length === 0) {
      this.invalidAggregationFlag = true;
    }
  }

  getOptionText(option) {
    if (option) {
      return option.name + ' - ' + option.swidTag;
    }
  }

  getAggregationOption(option) {
    if (option) {
      return option;
    }
  }

  // Get All Editors
  getEditorsList() {
    this._loading = true;
    var query;
    query = '?scope=' + this.selectedScope;
    this.productService.getEditorList(query).subscribe(
      (response: any) => {
        this.editorList = response.editor || [];
        this.editorList.sort();
        this._loading = false;
      },
      (error) => {
        this._loading = false;
        console.log('Error fetching editors');
      }
    );
  }

  // Get All Metrices based on Editor
  getMetricesList() {
    this._loading = true;
    this.metricService.getMetricList(this.selectedScope).subscribe(
      (response: any) => {
        this.metricList = [];
        response.metrices.map((res) => {
          const temp = {
            checked: false,
            avgUnitPrice: null,
            ...res,
          };
          this.metricList.push(temp);
        });
        this._loading = false;
      },
      (error) => {
        this._loading = false;
        console.log('Error fetching metric');
      }
    );
  }

  // Get All Products based on Editor
  getProductsList(product?: string) {
    this._loading = true;

    const query: ListProductQueryParams = {
      scopes: this.selectedScope,
      editor: this.simulateObj.editor,
    };


    // this.productService
    //   .getProductsList([this.selectedScope], this.simulateObj.editor).subscribe((res: any) => {
    //     this.productList = res.products || [];
    //     this.filteredOptions = this.productList;
    //     this._loading = false;
    //   }, (error: any) => {
    //     this._loading = false;
    //     console.log('Error fetching products');
    //   })

    this.productService.getProductList(query).subscribe(
      (response: ProductListResponse) => {
        console.log('response', response)
        this.productList = response.products || [];
        this.filteredOptions = this.productList;
        this._loading = false;
      },
      (error: ErrorResponse) => {
        this._loading = false;
        console.log('Error fetching products');
      }
    );
  }

  getAggregations() {
    this._loading = true;

    var query =
      '?page_num=' +
      this.currentPageNum +
      '&page_size=' +
      this.pageSize +
      '&sort_by=' +
      this.sortBy +
      '&sort_order=' +
      this.sortOrder +
      '&scope=' +
      this.cs.getLocalData(LOCAL_KEYS.SCOPE) +
      '&search_params.product_editor.filteringkey=' +
      this.simulateAggregationObj.editor;

    // param += 'search_params.editor.filteringkey:'+  this.simulateObj.editor;
    this.productService.getSimulationAggregations(query).subscribe(
      (response: any) => {
        this.aggregationData = response.aggregations.map(
          (m) => m.aggregation_name
        );

        this.filteredAggregationOptions = this.aggregationData;

        this.length = response.total_records;
        this._loading = false;
      },
      (error) => {
        console.log(
          'There was an error while retrieving aggregations !!!' + error
        );
      }
    );
  }

  // Get acquired rights based on swidtag
  getAcquiredRights(swidTag: string) {
    this._loading = true;
    this.invalidProductFlag = false;
    this.productService
      .getAcquiredRightDetails(swidTag, this.selectedScope)
      .subscribe(
        (response: any) => {
          this.invalidProductFlag = false;
          this.simulateObj.acq_rights = response.acq_rights || [];
          // clear metricList
          this.simulationMetrics = [];
          for (let i = 0; i < this.metricList.length; i++) {
            this.metricList[i].avgUnitPrice = null;
            this.metricList[i].checked = false;
          }
          // Map avg. unit cost to metric
          this.simulateObj.acq_rights.forEach((right) => {
            const idx = this.metricList.findIndex(
              (metric) => metric.name === right.metric
            );
            if (idx !== -1) {
              this.metricList[idx].avgUnitPrice = this.chop.transform(right.avgUnitPrice);
              this.metricList[idx].simulationExists = true;
              this.metricList[idx].numCptLicences = right.numCptLicences;
            }
          });
          this._loading = false;
        },
        (error) => {
          this._loading = false;
          console.log('Error fetching acquired rights');
        }
      );
  }

  getAggregationAcquiredRights(aggregationName: string) {
    this._loading = true;
    this.invalidAggregationFlag = false;
    this.productService.getAggregationAquiredRights(aggregationName).subscribe(
      (res: any) => {
        this.invalidAggregationFlag = false;
        this.simulateAggregationObj.acq_rights = res.acq_rights;
        // this.aggregationName = res.aggregationName;
        // clear metricList
        this.simulationMetrics = [];
        for (let i = 0; i < this.metricList.length; i++) {
          this.metricList[i].avgUnitPrice = null;
          this.metricList[i].checked = false;
        }
        // Map avg. unit cost to metric
        this.simulateAggregationObj.acq_rights.forEach((right) => {
          const idx = this.metricList.findIndex(
            (metric) => metric.name === right.metric
          );
          if (idx !== -1) {
            this.metricList[idx].avgUnitPrice = this.chop.transform(right.avgUnitPrice);
            this.metricList[idx].simulationExists = true;
            this.metricList[idx].numCptLicences = right.numCptLicences;
          }
        });

        this._loading = false;
      },
      (error) => {
        this._loading = false;
        console.log('There was an error while retrieving Posts !!!' + error);
      }
    );
  }
  handleChange(evt: any) {
    this.simulateObj = {
      viewEntity: [],
      entity: '',
      editor: '',
      product: '',
      currentEntity: '',
    };
    this.metricList = [];
    this.simulateAggregationObj = {
      viewEntity: [],
      entity: '',
      editor: '',
      aggregation: '',
      currentEntity: '',
    };
    this.getEditorsList();
    this.simulatedResults = [];
    this.simulationMetrics = [];
  }
  selectionChanged(ev: any, type: string) {
    switch (type) {
      case 'editor':
        this.simulateObj.product = null;
        this.simulatedResults = [];
        this.simulationMetrics = [];
        this.getProductsList();
        this.getMetricesList();
        // this.getAggregations();

        break;
      case 'product':
        this.simulateObj.product = ev.option.value;
        this.getAcquiredRights(ev.option.value.swidTag);
        // this.getAggregationAcquiredRights(ev.option.value);
        break;
      default:
        break;
    }
  }
  aggregationChanged(ev: any, type: string) {
    switch (type) {
      case 'editor':
        this.simulateAggregationObj.aggregation = null;
        this.simulatedResults = [];
        this.simulationMetrics = [];
        // this.getProductsList();
        this.getMetricesList();
        this.getAggregations();
        break;
      case 'product':
        this.simulateObj.product = ev.option.value;
        // this.getAcquiredRights(ev.option.value.swidTag);
        this.getAggregationAcquiredRights(ev.option.value);
        break;
      default:
        break;
    }
  }

  selectMetric(event: any, metric: any) {
    if (event.checked) {
      this.simulationMetrics.push(metric);
    } else {
      const idx = this.simulationMetrics.findIndex(
        (m) => m.name === metric.name
      );
      this.simulationMetrics.splice(idx, 1);
    }
  }

  changeInput(event, metric) {
    if (metric.checked) {
      const idx = this.simulationMetrics.findIndex(
        (m) => m.name === metric.name
      );
      this.simulationMetrics[idx] = metric;
    }
  }

  aggregationSimulate() {
    if (this.checkValidAggregation()) {
      return false;
    }
    this.body = {
      swid_tag: '',
      aggregation_name: this.simulateAggregationObj.aggregation,
      metric_details: [],
      scope: this.selectedScope,
    };

    this._loading = true;
    this.simulatedResults = [];
    const indexArray: number[] = [];
    this.simulateHttpCount = 0;
    this.simulationMetrics.forEach((metric, idx) => {
      if (metric.simulationExists) {
        this.simulatedResults.push({
          num_cpt_licences: metric.numCptLicences,
          metric_name: metric.name,
          total_cost: metric.numCptLicences * this.chop.transform(metric.avgUnitPrice), //TODO: remove license calculation
          success: true,
          exists: true,
        });
      } else {
        indexArray.push(idx);
        this.body.metric_details.push({
          metric_name: this.simulationMetrics[idx].name,
          unit_cost: this.chop.transform(this.simulationMetrics[idx].avgUnitPrice),
        });
      }
    });
    this.simulateHttpCount = indexArray.length;
    // call http request for non-existing metrices
    this.productService.metricSimulation(this.body).subscribe(
      (response: any) => {
        if (response.metric_sim_result) {
          response.metric_sim_result.map((res) =>
            this.simulatedResults.push(res)
          );
        }
        this._loading = false;
      },
      (error) => {
        this.simulationMetrics.forEach((metric) => {
          if (!metric.simulationExists) {
            this.simulatedResults.push({
              metric_name: metric.name,
              success: false,
            });
          }
        });
        this._loading = false;
        console.log('Error simulating metric');
      }
    );
  }
  simulate() {
    if (this.checkValidSimulation()) {
      return false;
    }

    this.body = {
      // editor: this.simulateObj.editor,
      swid_tag: this.simulateObj.product.swidTag,
      aggregation_name: this.simulateObj.aggregation,
      metric_details: [],
      scope: this.selectedScope,
    };
    this._loading = true;
    this.simulatedResults = [];
    const indexArray: number[] = [];
    this.simulateHttpCount = 0;
    this.simulationMetrics.forEach((metric, idx) => {
      if (metric.simulationExists) {
        this.simulatedResults.push({
          num_cpt_licences: metric.numCptLicences,
          metric_name: metric.name,
          total_cost: metric.numCptLicences * this.chop.transform(metric.avgUnitPrice), //TODO: remove license calculation
          success: true,
          exists: true,
        });
      } else {
        indexArray.push(idx);
        this.body.metric_details.push({
          metric_name: this.simulationMetrics[idx].name,
          unit_cost: this.chop.transform(this.simulationMetrics[idx].avgUnitPrice),
        });
      }
    });

    this.simulateHttpCount = indexArray.length;
    // call http request for non-existing metrices
    this.productService.metricSimulation(this.body).subscribe(
      (response: any) => {
        if (response.metric_sim_result) {
          response.metric_sim_result.map((res) =>
            this.simulatedResults.push(res)
          );
        }
        this._loading = false;
      },
      (error) => {
        this.simulationMetrics.forEach((metric) => {
          if (!metric.simulationExists) {
            this.simulatedResults.push({
              metric_name: metric.name,
              success: false,
            });
          }
        });
        this._loading = false;
        console.log('Error simulating metric');
      }
    );
  }

  // Recursively call HTTP request to make it synchronous
  callRecursionSimulate(indexArray: number[]) {
    if (!this.simulateHttpCount) {
      this.simulatedResults.sort((a, b) => a.total_cost - b.total_cost);
      this._loading = false;
      return false;
    }

    this.simulateHttpCount -= 1;
    const fetchIndex: number = indexArray[this.simulateHttpCount];
    const currentSimulationObj = this.simulationMetrics[fetchIndex];
    const body: MetricSimulationRequest = {
      swid_tag: this.simulateObj.product.swidTag,
      metric_name: currentSimulationObj.name,
      unit_cost: this.chop.transform(currentSimulationObj.avgUnitPrice) || 0,
    };

    this.productService.metricSimulation(body).subscribe(
      (response: any) => {
        const obj = response;
        obj.success = true;
        this.simulatedResults.push(obj);
        this.callRecursionSimulate(indexArray);
      },
      (error) => {
        console.log('Error simulating metric');
        this.simulatedResults.push({
          metric_name: currentSimulationObj.name,
          success: false,
        });
        this.callRecursionSimulate(indexArray);
      }
    );
  }

  checkValidAggregation(): boolean {
    if (!this.aggregationData) {
      return true;
    }
    // If no simulation metric selected
    if (this.simulationMetrics.length < 1) {
      return true;
    }
    // If metric dosen't have unit price
    if (this.simulationMetrics.filter((v) => !v.avgUnitPrice).length > 0) {
      return true;
    }
    return false;
  }

  // Check if all required parameters available for simulation
  checkValidSimulation(): boolean {
    // If no product selected
    if (!this.simulateObj.product || !this.simulateObj.product.swidTag) {
      return true;
    }
    // If no simulation metric selected
    if (this.simulationMetrics.length < 1) {
      return true;
    }
    // If metric dosen't have unit price
    if (this.simulationMetrics.filter((v) => !v.avgUnitPrice).length > 0) {
      return true;
    }
    return false;
  }

  validateCostPattern(ev: any) {
    const regEx = new RegExp(/^\d*\.?\d*$/);
    const specialKeys: Array<string> = ['Backspace', 'Delete', 'End', 'Home'];
    if (!regEx.test(ev.key) && specialKeys.indexOf(ev.key) === -1) {
      return false;
    }
    return true;
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}
