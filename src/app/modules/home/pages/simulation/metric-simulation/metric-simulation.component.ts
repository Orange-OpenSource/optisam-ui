import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { ProductService } from 'src/app/core/services/product.service';
import { MetricService } from 'src/app/core/services/metric.service';
import { MetricSimulationRequest, SimulationTotal } from '@core/modals';

@Component({
  selector: 'app-metric-simulation',
  templateUrl: './metric-simulation.component.html',
  styleUrls: ['./metric-simulation.component.scss'],
})
export class MetricSimulationComponent implements OnInit, OnDestroy {
  editorList: any[] = [];
  productList: any[] = [];
  metricList: any[] = [];
  editorRightList: any[] = [];
  entityList: any[] = [];
  loadingSubscription: Subscription;
  HTTPActivity: Boolean;
  simulateObj: any;
  simulatedResults: any[] = [];
  simulationMetrics: any[] = [];
  simulateHttpCount: number;
  _loading: Boolean;
  filteredOptions: any[];
  invalidProductFlag: Boolean;
  simulationTotal: SimulationTotal;
  count: any = 0;
  displayedColumns: string[] = ['sku', 'metric', 'unitCost', 'aggName'];
  body: any;
  selectedScope: any;
  editorEmpty: Boolean;

  constructor(
    private sharedService: SharedService,
    private productService: ProductService,
    private metricService: MetricService
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
    this.getEditorsList();
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

  selectionChanged(ev: any, type: string) {
    switch (type) {
      case 'editor':
        this.getSimulationRights();
        this.simulateObj.product = null;
        this.simulatedResults = [];
        this.simulationMetrics = [];
        break;
      default:
        break;
    }
  }

  getSimulationRights() {
    this._loading = true;
    this.productService.getSimulationRights(this.simulateObj.editor).subscribe(
      (response: any) => {
        this.editorRightList = (response.editor_rights || []).filter((res) => {
          return res.sku || res.metric_name;
        });
        this.editorEmpty = true;
        this._loading = false;
      },
      (error) => {
        this._loading = false;
        console.log('Error fetching products');
      }
    );
  }

  selectMetric(event: any, metric: any) {
    if (event.checked) {
      this.simulationMetrics.push(metric);
      console.log(metric);
      console.log(this.simulationMetrics);
    } else {
      const idx = this.simulationMetrics.findIndex(
        (m) =>
          m.sku === metric.sku &&
          m.metric_name === metric.metric_name &&
          m.aggregation_name === m.aggregation_name
      );
      console.log(idx);
      this.simulationMetrics.splice(idx, 1);
      console.log('AFter splice', this.simulationMetrics);
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

  simulate() {
    if (this.checkValidSimulation()) {
      return false;
    }
    this.body = {
      // "swid_tag": this.simulateObj.product.swidTag,
      editor: this.simulateObj.editor,
      cost_details: [],
      scope: this.selectedScope,
    };
    this._loading = true;
    this.simulatedResults = [];
    const indexArray: number[] = [];
    this.simulateHttpCount = 0;
    this.simulationMetrics.forEach((metric, idx) => {
      if (metric.simulationExists) {
        console.log('Inside');
        this.simulatedResults.push({
          num_cpt_licences: metric.numCptLicences,
          metric_name: metric.name,
          total_cost: metric.numCptLicences * Number(metric.avgUnitPrice), //TODO: remove license calculation
          success: true,
          exists: true,
        });
      } else {
        indexArray.push(idx);
        this.body.cost_details.push({
          sku: this.simulationMetrics[idx].sku,
          swidtag: this.simulationMetrics[idx].swidtag,
          aggregation_name: this.simulationMetrics[idx].aggregation_name,
          metric_name: this.simulationMetrics[idx].metric_name,
          unit_cost: this.simulationMetrics[idx].avg_unit_price,
        });
      }
    });

    this.simulateHttpCount = indexArray.length;
    // call http request for non-existing metrices
    this.productService.costSimulation(this.body).subscribe(
      (response: any) => {
        if (response.cost_sim_result) {
          response.cost_sim_result.map((res) =>
            this.simulatedResults.push(res)
          );
        }
        console.log('Results', this.simulatedResults);

        this.simulationTotal = this.simulatedResults.reduce(
          (total: SimulationTotal, sm) => {
            console.log({ sm });
            total.beforeTotal += Number(sm.old_total_cost);
            total.afterTotal += Number(sm.new_total_cost);
            return total;
          },
          {
            beforeTotal: 0,
            afterTotal: 0,
          }
        );
        console.log('BODY', this.body);
        console.log(this.simulationTotal);

        this._loading = false;
      },
      (error) => {
        this.simulationMetrics.forEach((metric) => {
          if (!metric.simulationExists) {
            this.simulatedResults.push({
              metric_name: metric.metric_name,

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
      metric_name: currentSimulationObj.metric_name,
      unit_cost: Number(currentSimulationObj.avg_unit_price) || 0,
    };

    this.productService.costSimulation(body).subscribe(
      (response: any) => {
        const obj = response;
        obj.success = true;
        this.simulatedResults.push(obj);
        this.callRecursionSimulate(indexArray);
      },
      (error) => {
        console.log('Error simulating metric');
        this.simulatedResults.push({
          metric_name: currentSimulationObj.metric_name,
          success: false,
        });
        this.callRecursionSimulate(indexArray);
      }
    );
  }

  // Check if all required parameters available for simulation
  checkValidSimulation(): boolean {
    // If no product selected
    // if (!this.simulateObj.product || !this.simulateObj.product.swidTag) {
    //   return true;
    // }

    // If no simulation metric selected
    if (this.simulationMetrics.length < 1) {
      return true;
    }
    // If metric dosen't have unit price
    if (this.simulationMetrics.filter((v) => !v.avg_unit_price).length > 0) {
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
