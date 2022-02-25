import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { ProductService } from 'src/app/core/services/product.service';
import { MetricSimulationRequest } from 'src/app/core/services/product';
import { MetricService } from 'src/app/core/services/metric.service';

@Component({
  selector: 'app-metric-simulation',
  templateUrl: './metric-simulation.component.html',
  styleUrls: ['./metric-simulation.component.scss']
})
export class MetricSimulationComponent implements OnInit, OnDestroy {
  editorList: any[] = [];
  productList: any[] = [];
  metricList: any[] = [];
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
  count: any = 0;
  displayedColumns: string[] = ['metric', 'unitCost'];
  body: any;
  selectedScope: any;

  constructor(
    private sharedService: SharedService,
    private productService: ProductService,
    private metricService: MetricService
  ) {
    this.loadingSubscription = this.sharedService.httpLoading().subscribe(data => {
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
      currentEntity: ''
    };
    this.getEditorsList();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.productList.filter(option => option.toLowerCase().includes(filterValue));
  }

  onChangeProduct(ev) {
    this.filteredOptions = this.productList.filter(option => option.name.toLowerCase().startsWith(ev.target.value.toLowerCase()));
  }
  onProductNotSelected() {
    this.invalidProductFlag = false;
    let filteredProducts = this.productList.filter(option => {
      if (this.simulateObj.product) {
        (option.name + ' - ' + option.swidTag) === (this.simulateObj.product.name + ' - ' + this.simulateObj.product.swidTag)
      }
    });
    if (filteredProducts.length === 0) { this.invalidProductFlag = true; }
  }
  getOptionText(option) {
    if (option) { return option.name + ' - ' + option.swidTag; }
  }

  // Get All Editors
  getEditorsList() {
    this._loading = true;
    var query;
    query = '?scopes=' + this.selectedScope;
    this.productService.getEditorList(query).subscribe((response: any) => {
      this.editorList = response.editors || [];
      this._loading = false;
    }, (error) => {
      this._loading = false;
      console.log("Error fetching editors");
    });
  }

  // Get All Metrices based on Editor
  getMetricesList() {
    this._loading = true;
    this.metricService.getMetricList(this.selectedScope).subscribe((response: any) => {
      this.metricList = [];
      response.metrices.map(res => {
        const temp = {
          checked: false,
          avgUnitPrice: null,
          ...res
        };
        this.metricList.push(temp)
      });
      this._loading = false;
    }, (error) => {
      this._loading = false;
      console.log("Error fetching metric");
    });
  }

  // Get All Products based on Editor
  getProductsList(product?: string) {
    this._loading = true;
    var query = '?scopes=' + this.selectedScope;
    query += '&editor=' + this.simulateObj.editor;
    this.productService.getProductList(query).subscribe((response: any) => {
      this.productList = response.products || [];
      this.filteredOptions = this.productList;
      this._loading = false;
    }, (error) => {
      this._loading = false;
      console.log("Error fetching products");
    });
  }

  // Get acquired rights based on swidtag
  getAcquiredRights(swidTag: string) {
    this._loading = true;
    this.invalidProductFlag = false;
    this.productService.getAcquiredRightDetails(swidTag, this.selectedScope).subscribe((response: any) => {
      this.invalidProductFlag = false;
      this.simulateObj.acq_rights = response.acq_rights || [];
      // clear metricList
      this.simulationMetrics = [];
      for (let i = 0; i < this.metricList.length; i++) {
        this.metricList[i].avgUnitPrice = null;
        this.metricList[i].checked = false;
      }
      // Map avg. unit cost to metric
      this.simulateObj.acq_rights.forEach(right => {
        const idx = this.metricList.findIndex(metric => metric.name === right.metric);
        if (idx !== -1) {
          this.metricList[idx].avgUnitPrice = right.avgUnitPrice;
          this.metricList[idx].simulationExists = true;
          this.metricList[idx].numCptLicences = right.numCptLicences;
        }
      });
      this._loading = false;
    }, (error) => {
      this._loading = false;
      console.log("Error fetching acquired rights");
    });
  }

  selectionChanged(ev: any, type: string) {
    switch (type) {
      case 'editor':
        this.simulateObj.product = null;
        this.getProductsList();
        this.getMetricesList();
        break;
      case 'product':
        this.simulateObj.product = ev.option.value;
        this.getAcquiredRights(ev.option.value.swidTag);
        break;
      default:
        break;
    }
  }

  selectMetric(event: any, metric: any) {
    if (event.checked) {
      this.simulationMetrics.push(metric);
    } else {
      const idx = this.simulationMetrics.findIndex(m => m.name === metric.name);
      this.simulationMetrics.splice(idx, 1);
    }
  }

  changeInput(event, metric) {
    if (metric.checked) {
      const idx = this.simulationMetrics.findIndex(m => m.name === metric.name);
      this.simulationMetrics[idx] = metric;
    }
  }

  simulate() {
    if (this.checkValidSimulation()) {
      return false;
    }
    this.body = {
      "swid_tag": this.simulateObj.product.swidTag,
      "metric_details": [],
      "scope": this.selectedScope
    }
    this._loading = true;
    this.simulatedResults = [];
    const indexArray: number[] = [];
    this.simulateHttpCount = 0;
    this.simulationMetrics.forEach((metric, idx) => {
      if (metric.simulationExists) {
        this.simulatedResults.push({
          "num_cpt_licences": metric.numCptLicences,
          "metric_name": metric.name,
          "total_cost": metric.numCptLicences * Number(metric.avgUnitPrice), //TODO: remove license calculation
          "success": true,
          "exists": true
        });
      } else {
        indexArray.push(idx);
        this.body.metric_details.push({ "metric_name": this.simulationMetrics[idx].name, "unit_cost": this.simulationMetrics[idx].avgUnitPrice });
      }
    });

    this.simulateHttpCount = indexArray.length;
    // call http request for non-existing metrices   
    this.productService.metricSimulation(this.body).subscribe((response: any) => {
      if (response.metric_sim_result) { response.metric_sim_result.map((res) => this.simulatedResults.push(res)); }
      this._loading = false;
    }, (error) => {
      this.simulationMetrics.forEach((metric) => {
        if (!metric.simulationExists) {
          this.simulatedResults.push({
            "metric_name": metric.name,
            success: false
          });
        }
      });
      this._loading = false;
      console.log("Error simulating metric");
    });
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
      unit_cost: Number(currentSimulationObj.avgUnitPrice) || 0
    };

    this.productService.metricSimulation(body).subscribe((response: any) => {
      const obj = response;
      obj.success = true;
      this.simulatedResults.push(obj);
      this.callRecursionSimulate(indexArray);
    }, (error) => {
      console.log("Error simulating metric");
      this.simulatedResults.push({
        "metric_name": currentSimulationObj.name,
        success: false
      });
      this.callRecursionSimulate(indexArray);
    });
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
    if (this.simulationMetrics.filter(v => !v.avgUnitPrice).length > 0) {
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