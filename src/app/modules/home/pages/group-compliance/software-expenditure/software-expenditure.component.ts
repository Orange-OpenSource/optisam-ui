import { element } from 'protractor';
import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '@core/services';
import { ExpansePercent, Expenditure } from '@core/services/expenditure';
import { CHART_COLORS } from '@core/util/constants/constants';
import * as Chart from 'chart.js';
import * as d3 from 'd3';
import { commonPieChartDataLabelConfig, pieChartLabelCallback } from '@core/util/common.functions';

@Component({
  selector: 'app-software-expenditure',
  templateUrl: './software-expenditure.component.html',
  styleUrls: ['./software-expenditure.component.scss'],
})
export class SoftwareExpenditureComponent implements OnInit {
  @Input() selectedScopeCodes: string[];
  @Input() selectedScopeNames: string[];
  canvasBar: any;
  canvasPie: any;
  softExpend: Expenditure;
  myPieChart: any;
  myBarChart: any;
  dataNotAvail: boolean = true;

  // barChartOptions: ChartOptions = {};
  // barChartLabels: Label[] = [];
  // barChartType: ChartType = 'bar';
  // barChartLegend = true;
  // barChartPlugins = [];
  // barChartData: ChartDataSets[] = [];

  // pieChartOptions: ChartOptions = {};
  // pieChartLabels: Label[] = [];
  // pieChartType: ChartType = 'pie';
  // pieChartLegend = true;
  // pieChartPlugins = [];
  // pieChartData: SingleDataSet = [];
  // pieChartColors: Array < any > = [];

  constructor(private productService: ProductService) {
    // monkeyPatchChartJsTooltip();
    // monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
    this.generatePieChartConfig();
    this.generateBarChartConfig();
  }

  selectionChanged(ev: any) {
    this.selectedScopeCodes = ev.value.scope_code;
    this.selectedScopeNames = ev.value.scope_name;
    this.dataNotAvail = true;
    this.productService
      .getSoftwareExpenditure(this.selectedScopeCodes)
      .subscribe((res: Expenditure) => {
        this.dataNotAvail = false;
        this.softExpend = res;
        this.updateBarChartExpenditure(this.softExpend);
        this.updatePieChartExpenditure(this.softExpend);
      });
    console.log(this.selectedScopeCodes);
  }

  generateBarChartConfig() {
    this.canvasBar = document.getElementById('myBarChartExpenditure');
    var ctx = this.canvasBar.getContext('2d');
    var data = {
      labels: [],
      datasets: [
        {
          label: 'Expenditure',
          backgroundColor: CHART_COLORS.expenditure,
          data: [],
        },
        {
          label: 'Total Cost',
          backgroundColor: CHART_COLORS.totalCost,
          data: [],
        },
      ],
    };

    this.myBarChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        // barValueSpacing: 10,
        elements: {
        },
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
  updateBarChartExpenditure(softExpend: Expenditure) {
    var labels = [];
    var dataExpenditure = [];
    var dataCost = [];
    softExpend.expense_percent.forEach((ele) => {
      labels.push(ele.scope);
      dataExpenditure.push(ele.expenditure);
      dataCost.push(ele.totalCost);
    });
    this.myBarChart.config.data.labels = labels;
    this.myBarChart.config.data.datasets.forEach((e) => {
      if (e.label == 'Expenditure') {
        e.data = dataExpenditure;
      }
      if (e.label == 'Total Cost') {
        e.data = dataCost;
      }
    });
    this.myBarChart.update();
  }

  resetGraphs() {
    // Reset chart data
    this.myBarChart.data.labels = [];
    this.myBarChart.data.datasets.forEach((dataset) => {
      dataset.data = [];
    });
    this.myPieChart.data.labels = ['Expenditure', 'Total Cost'];
    this.myPieChart.data.datasets[0].data = [];
    // Update charts to reflect empty data
    this.myBarChart.update();
    this.myPieChart.update();
  }

  generatePieChartConfig() {
    this.canvasPie = document.getElementById('myPieChartExpenditure');
    var ctx = this.canvasPie.getContext('2d');
    var data = {
      labels: ['Total Expenditure', 'Expenditure Covered by Optisam'],
      datasets: [
        {
          label: 'Expenditure Pie',
          backgroundColor: [CHART_COLORS.expenditure, CHART_COLORS.totalCost],
          data: [],
          hoverOffset: 4,
        },
      ],
    };

    this.myPieChart = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: {
        legend: {
          display: true,
          position: 'bottom',
        },
        plugins: {
          datalabels: commonPieChartDataLabelConfig()
        },
        tooltips: {
          callbacks: {
            label: pieChartLabelCallback()
          }
        },
        responsive: false,
        // display: true,
      },
    });
  }
  updatePieChartExpenditure(softExpend: Expenditure) {
    var datasource = [softExpend.total_expenditure, softExpend.total_cost];
    this.myPieChart.config.data.datasets[0].data = datasource;
    this.myPieChart.update();
  }
}
