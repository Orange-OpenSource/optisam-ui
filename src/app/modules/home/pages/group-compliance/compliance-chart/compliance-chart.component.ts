import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '@core/services';
import { GroupComplianceEditors } from '@core/services/group-compliance-editor';
import {
  ComplianceProductsLicense,
  GroupComplianceProducts,
} from '@core/services/group-compliance-product';
import * as Chart from 'chart.js';
import * as d3 from 'd3';
import { Output, EventEmitter } from '@angular/core';
import { CHART_COLORS } from '@core/util/constants/constants';

@Component({
  selector: 'app-compliance-chart',
  templateUrl: './compliance-chart.component.html',
  styleUrls: ['./compliance-chart.component.scss'],
})
export class ComplianceChartComponent implements OnInit {
  @Input() selectedScopeCodes: string[];
  @Input() selectedScopeNames: string[];
  @Output() resetSelect: EventEmitter<void> = new EventEmitter<void>();

  canvasBarEditor: any;
  canvasHorizontalBarEditor: any;

  canvasBarLicense: any;
  canvasBarCost: any;

  simulateObj: any = {};
  editorList: string[] = [];
  productList: string[] = [];
  selectedEditor: string;
  selectedProduct: string;
  myBarChartEditor: any;
  myHorizontalBarChartEditor: any;
  myBarChartLicense: any;
  myBarChartCost: any;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.generateBarChartEditor();
    this.generatePieChartEditor();
    this.generateBarChartLicense();
    this.generateBarChartCost();
  }

  selectionChanged(ev, operation: string) {
    switch (operation) {
      case 'group':
        this.productService.setGroupComplianceSelectedEditor('');
        this.selectedScopeCodes = ev.value.scope_code;
        this.selectedScopeNames = ev.value.scope_name;
        this.resetGraphs();
        this.productService
          .getEditorListAggr(this.selectedScopeCodes)
          .subscribe((ele: { editor: string[] }) => {
            this.editorList = ele.editor;
            this.editorList.sort();
          });
        // commented bcoz API not ready for list.
        break;
      case 'editor':
        this.selectedEditor = ev.value;
        this.productService.setGroupComplianceSelectedEditor(this.selectedEditor);
        if (this.selectedEditor === '') {
          this.resetProductGraph();
        } else {
          this.resetProductGraph();
          this.productService
            .getGroupComplianceByEditors(
              this.selectedScopeCodes,
              this.selectedEditor
            )
            .subscribe((ele: GroupComplianceEditors) => {
              console.log(ele);
              this.updateBarChartEditor(ele);
              this.updateHorizontalBarChartEditor(ele, this.selectedEditor);
            });
          this.productService
            .getProductsList(this.selectedScopeCodes, this.selectedEditor)
            .subscribe((ele: { products: string[] }) => {
              console.log(ele);
              this.productList = ele.products;
              this.productList.sort();
            });
        }
        break;
      case 'product':
        this.selectedProduct = ev.value;
        this.productService
          .getGroupComplianceByProducts(
            this.selectedScopeCodes,
            this.selectedEditor,
            this.selectedProduct
          )
          .subscribe((ele: GroupComplianceProducts) => {
            this.updateBarChartLicense(ele);
            this.updateBarChartCost(ele);
          });
        break;
      default:
        console.log('DEFAULT');
    }
  }

  resetProductGraph() {
    this.productList = []; //to disable mat-select
    this.myBarChartEditor.config.data.labels = [];
    this.myBarChartEditor.config.data.datasets.forEach((dataset) => {
      dataset.data = [];
    });
    this.myBarChartEditor.update();

    // Reset Pie Chart Editor
    this.myHorizontalBarChartEditor.config.data.datasets[0].data = [];
    this.myHorizontalBarChartEditor.update();
    this.myBarChartLicense.config.data.labels = [];
    this.myBarChartLicense.config.data.datasets.forEach((dataset) => {
      dataset.data = [];
    });
    this.myBarChartLicense.update();

    // Reset Bar Chart Cost
    this.myBarChartCost.config.data.labels = [];
    this.myBarChartCost.config.data.datasets.forEach((dataset) => {
      dataset.data = [];
    });
    this.myBarChartCost.update();
  }
  generateBarChartEditor() {
    this.canvasBarEditor = document.getElementById('myBarChartEditor');
    var ctx = this.canvasBarEditor.getContext('2d');
    var data = {
      labels: [],
      datasets: [
        {
          label: 'Under Usage',
          backgroundColor: CHART_COLORS.underUsage,
          data: [],
        },
        {
          label: 'Counterfeiting',
          backgroundColor: CHART_COLORS.counterfeiting,
          data: [],
        },
        {
          label: 'Total Cost',
          backgroundColor: CHART_COLORS.totalCost,
          data: [],
        },
      ],
    };

    this.myBarChartEditor = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
              },
            },
          ],
        },
        legend: {
          position: 'bottom',
          display: true,
        },
        plugins: {
          datalabels: {
            color: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: 5,
            display: false,
            formatter: (val, data) => {
              let value: number = Number((val as number).toFixed(2));
              value = Math.floor(value) == value ? Math.floor(value) : value;
              return value.toLocaleString();
            }

          },
        },
        tooltips: {
          callbacks: {
            label: (item, data) => {
              let value = Number((data.datasets[item.datasetIndex].data[item.index] as number).toFixed(2));
              return `  ${data.datasets[item.datasetIndex].label}: ${value.toLocaleString()}`;
            }
          }
        },
        responsive: false,
      },
    });
  }

  resetGraphs() {
    // Reset Bar Chart Editor

    this.simulateObj.editorName = '';
    this.simulateObj.productName = '';
    this.productService.setGroupComplianceSelectedEditor('');

    this.editorList = []; //to disable mat-select
    this.productList = []; //to disable mat-select
    this.myBarChartEditor.config.data.labels = [];
    this.myBarChartEditor.config.data.datasets.forEach((dataset) => {
      dataset.data = [];
    });

    this.myBarChartEditor.update();

    // Reset Pie Chart Editor
    this.myHorizontalBarChartEditor.config.data.datasets.forEach((dataset => dataset.data = []));
    this.myHorizontalBarChartEditor.update();

    // Reset Bar Chart License
    this.myBarChartLicense.config.data.labels = [];
    this.myBarChartLicense.config.data.datasets.forEach((dataset) => {
      dataset.data = [];
    });
    this.myBarChartLicense.update();

    // Reset Bar Chart Cost
    this.myBarChartCost.config.data.labels = [];
    this.myBarChartCost.config.data.datasets.forEach((dataset) => {
      dataset.data = [];
    });
    this.myBarChartCost.update();
  }

  updateBarChartEditor(ele: GroupComplianceEditors) {
    var labels = [];
    var underUsage = [];
    var counterFeiting = [];
    var total = [];
    ele.costs.counterFeiting.sort((a, b) => a.scope.localeCompare(b.scope));
    ele.costs.underUsage.sort((a, b) => a.scope.localeCompare(b.scope));
    ele.costs.total.sort((a, b) => a.scope.localeCompare(b.scope));
    console.log(ele);
    for (let i = 0; i < ele.costs.counterFeiting.length; i++) {
      labels.push(ele.costs.counterFeiting[i].scope);
      counterFeiting.push(ele.costs.counterFeiting[i].cost);
      underUsage.push(ele.costs.underUsage[i].cost);
      total.push(ele.costs.total[i].cost);
    }
    this.myBarChartEditor.config.data.labels = labels;
    console.log(this.myBarChartEditor.config.data);
    this.myBarChartEditor.config.data.datasets.forEach((e) => {
      if (e.label == 'Under Usage') {
        e.data = underUsage;
      }
      if (e.label == 'Counterfeiting') {
        e.data = counterFeiting.map((value) => Math.abs(value));
      }
      if (e.label == 'Total Cost') {
        e.data = total;
      }
    });
    console.log(this.myBarChartEditor.config.data.datasets);

    this.myBarChartEditor.update();
  }

  generatePieChartEditor() {
    this.canvasHorizontalBarEditor = document.getElementById('myHorizontalBarChartEditor');
    var ctx = this.canvasHorizontalBarEditor.getContext('2d');

    var data = {
      labels: [],
      datasets: [
        {
          label: 'Under Usage',
          backgroundColor: CHART_COLORS.underUsage,
          data: [],
        },
        {
          label: 'Counterfeiting',
          backgroundColor: CHART_COLORS.counterfeiting,
          data: [],
        },
        {
          label: 'Total Cost',
          backgroundColor: CHART_COLORS.totalCost,
          data: [],
        },
      ],
    };

    this.myHorizontalBarChartEditor = new Chart(ctx, {
      type: 'horizontalBar',
      data: data,
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
              },
            },
          ],
        },
        legend: {
          position: 'bottom',
          display: true,
        },
        plugins: {
          datalabels: {
            color: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: 5,
            display: false,
            formatter: (val, data) => {
              let value: number = Number((val as number).toFixed(2));
              value = Math.floor(value) == value ? Math.floor(value) : value;
              return value.toLocaleString();
            }

          },
        },
        tooltips: {
          callbacks: {
            label: (item, data) => {
              let value = Number((data.datasets[item.datasetIndex].data[item.index] as number).toFixed(2));
              return `  ${data.datasets[item.datasetIndex].label}: ${value.toLocaleString()}`;
            }
          }
        },
        responsive: false,
      },
    });



  }

  updateHorizontalBarChartEditor(ele: GroupComplianceEditors, editor: string = null) {
    this.myHorizontalBarChartEditor.config.data.labels = [editor];
    this.myHorizontalBarChartEditor.config.data.datasets.forEach(e => {
      switch (e.label) {
        case 'Under Usage':
          e.data = [ele.groupUnderUsageCost]
          break;
        case 'Counterfeiting':
          e.data = [Math.abs(ele.groupCounterFeitingCost)]
          break;
        case 'Total Cost':
          e.data = [ele.groupTotalCost]
          break;

      }
    })
    this.myHorizontalBarChartEditor.update();
  }

  generateBarChartLicense() {
    this.canvasBarLicense = document.getElementById('myBarChartLicense');
    var ctx = this.canvasBarLicense.getContext('2d');

    var data = {
      labels: [],
      datasets: [
        {
          label: 'Acquired Licenses',
          backgroundColor: CHART_COLORS.acquiredLicense,
          data: [],
        },
        {
          label: 'Computed Licenses',
          backgroundColor: CHART_COLORS.computedLicense,
          data: [],
        },
      ],
    };

    this.myBarChartLicense = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
              },
            },
          ],
        },
        legend: {
          position: 'bottom',
        },
        plugins: {
          datalabels: {
            color: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: 5,
            display: false,
            formatter: (val, data) => {
              let value: number = Number((val as number).toFixed(2));
              value = Math.floor(value) == value ? Math.floor(value) : value;
              return value.toLocaleString();
            }

          },
        },
        tooltips: {
          callbacks: {
            label: (item, data) => {
              let value = Number((data.datasets[item.datasetIndex].data[item.index] as number).toFixed(2));
              return `  ${data.datasets[item.datasetIndex].label}: ${value.toLocaleString()}`;
            }
          }
        },
        responsive: false,
      },
    });
  }

  updateBarChartLicense(ele: GroupComplianceProducts) {
    var labels = [];
    var aquired = [];
    var computed = [];
    ele.licences.forEach((lic: ComplianceProductsLicense) => {
      labels.push(lic.scope);
      aquired.push(lic.acquired_licences);
      computed.push(lic.computed_licences);
    });

    this.myBarChartLicense.config.data.labels = labels;
    this.myBarChartLicense.config.data.datasets.forEach((e) => {
      if (e.label == 'Acquired Licenses') {
        e.data = aquired;
      }
      if (e.label == 'Computed Licenses') {
        e.data = computed;
      }
    });
    this.myBarChartLicense.update();
  }

  generateBarChartCost() {
    this.canvasBarCost = document.getElementById('myBarChartCost');
    var ctx = this.canvasBarCost.getContext('2d');

    var data = {
      labels: [],
      datasets: [
        {
          label: 'Under Usage',
          backgroundColor: CHART_COLORS.underUsage,
          data: [],
        },
        {
          label: 'Counterfeiting',
          backgroundColor: CHART_COLORS.counterfeiting,
          data: [],
        },
        {
          label: 'Total Cost',
          backgroundColor: CHART_COLORS.totalCost,
          data: [],
        },
      ],
    };

    this.myBarChartCost = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
              },
            },
          ],
        },
        legend: {
          position: 'bottom',
        },
        plugins: {
          datalabels: {
            color: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: 5,
            display: false,
            formatter: (val, data) => {
              let value: number = Number((val as number).toFixed(2));
              value = Math.floor(value) == value ? Math.floor(value) : value;
              return value.toLocaleString();
            }

          },
        },
        tooltips: {
          callbacks: {
            label: (item, data) => {
              let value = Number((data.datasets[item.datasetIndex].data[item.index] as number).toFixed(2));
              return `  ${data.datasets[item.datasetIndex].label}: ${value.toLocaleString()}`;
            }
          }
        },
        responsive: false,
      },
    });
  }
  updateBarChartCost(ele: GroupComplianceProducts) {
    var labels = [];
    var underUsage = [];
    var counterFeiting = [];
    var total = [];
    for (let i = 0; i < ele.cost.length; i++) {
      labels.push(ele.cost[i].scope);
      counterFeiting.push(ele.cost[i].counterfeiting_cost);
      underUsage.push(ele.cost[i].underusage_cost);
      total.push(ele.cost[i].total_cost);
    }
    this.myBarChartCost.config.data.labels = labels;
    console.log(ele, counterFeiting);

    this.myBarChartCost.config.data.datasets.forEach((e) => {
      if (e.label == 'Under Usage') {
        e.data = underUsage;
      }
      if (e.label == 'Counterfeiting') {
        e.data = counterFeiting.map((value) => Math.abs(value));
      }
      if (e.label == 'Total Cost') {
        e.data = total;
      }
    });
    console.log(this.myBarChartCost.config.data.datasets);
    this.myBarChartCost.update();
  }
}
