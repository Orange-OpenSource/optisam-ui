import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { EquipmentsService } from '@core/services/equipments.service';
import * as d3 from 'd3';
import * as Chart from 'chart.js';
import { CommonService, ProductService } from '@core/services';
import { SharedService } from '@shared/shared.service';
import { EQUIPMENT_COLORS, LOCAL_KEYS } from '@core/util/constants/constants';
import { SubSink } from 'subsink';
import { DeploymentType, DashboardLocationResponse } from '@core/modals';
import { commonPieChartDataLabelConfig, pieChartLabelCallback, resetLegends } from '@core/util/common.functions';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-park',
  templateUrl: './park.component.html',
  styleUrls: ['./park.component.scss'],
})
export class ParkComponent implements OnInit, OnDestroy, AfterViewInit {
  currentScope: string = this.cs.getLocalData(LOCAL_KEYS.SCOPE);
  equipsData: {
    labels: any;
    data: any;
    colorScale: (t: number) => string;
    colorRangeInfo: { colorStart: number; colorEnd: number };
  };
  emptyequipsDataFlag: boolean;
  getEquipsFailed: boolean;
  canvas: any;
  ctx: any;
  productsLocationData: DeploymentType;
  productsLicensingData: DashboardLocationResponse;
  locationDataFailed: boolean = false;
  licensingDataFailed: boolean = false;
  productsDataLocationFlag: boolean = false;
  productsLicensingDataFlag: boolean = false;
  equipmentChart: Chart;
  productLocationPieChart: Chart;
  productLicensingPieChart: Chart;
  subs: SubSink = new SubSink();
  equipmentList: string[];
  _loadingProductsLicensing: boolean = true;
  _loadingProductLocation: boolean = true;
  _loadingEquipmentDetails: boolean = true;
  labelList: any;



  constructor(
    private equipmentService: EquipmentsService,
    private productService: ProductService,
    private ss: SharedService,
    private cs: CommonService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {

    this.translate.use(this.cs.getLocalData(LOCAL_KEYS.LANGUAGE)).subscribe((translations: any) => {
      this.labelList = translations;
    })

    this.subs.add(
      this.ss._emitScopeChange.subscribe(() => {
        this.currentScope = this.cs.getLocalData(LOCAL_KEYS.SCOPE);
        this.dataInit();
      })
    )

    this.subs.add(
      this.translate.onLangChange.subscribe(({ translations }: LangChangeEvent) => {
        this.labelList = translations;
        this.dataInit();
      })
    )

  }

  ngAfterViewInit(): void {
    this.dataInit();
  }

  private dataInit(): void {
    this.getEquipmentDetails();
    this.getProductsByLicensing();
    this.getProductsByLocation();
  }

  getEquipmentDetails() {
    this._loadingEquipmentDetails = true;
    this.equipmentService.getEquipmentsOverview(this.currentScope).subscribe(
      (res) => {
        this._loadingEquipmentDetails = false;
        if (res.types_equipments && res.types_equipments.length !== 0) {
          const labels = res.types_equipments.map((p) => p.equip_type).reverse();
          const data = res.types_equipments.map((p) => p.num_equipments).reverse();
          this.equipmentList = labels;
          this.equipsData = {
            labels,
            data,
            colorScale: d3.interpolateCool,
            colorRangeInfo: {
              colorStart: 0.3,
              colorEnd: 1,
            },
          };
          this.emptyequipsDataFlag = data.every(d => d == 0);
          this.generateEquipmentDetails();
        } else {
          this.emptyequipsDataFlag = true;
          this.equipsData = null;
        }
        this.getEquipsFailed = false;
      },
      (err) => {
        this._loadingEquipmentDetails = false;
        this.getEquipsFailed = true;
        console.log('Some error occured! Could not get software licence info.');
      }
    );
  }

  getProductsByLocation() {
    this._loadingProductLocation = true;
    this.productsDataLocationFlag = false;
    this.productService.getProductsLocation(this.currentScope).subscribe(
      (res: DeploymentType) => {
        if (res?.on_premise_percentage !== null && res?.saas_percentage !== null) {
          this._loadingProductLocation = false;
          this.productsLocationData = res;
          this.productsDataLocationFlag = res?.on_premise_percentage + res?.saas_percentage <= 0 ? true : false;
          this.generateProductLocationPieChart(res);
        } else {
          this._loadingProductLocation = false;
          this.productsDataLocationFlag = true;
        }
      },
      (err) => {
        console.log('Some error occured! Could not get quality products.');
        this.locationDataFailed = true;
      }
    );
  }

  getProductsByLicensing() {
    this.licensingDataFailed = false;
    this.productsLicensingDataFlag = false;
    this._loadingProductsLicensing = true;

    this.productService.getProductsLicensing(this.currentScope).subscribe(
      (res: DashboardLocationResponse) => {
        this.productsLicensingDataFlag = res.total_amount[0].amount ? false : true;
        this.productsLicensingData = res;
        res.total_amount[0].amount && this.generateProductLicensingPieChart(res);
        this._loadingProductsLicensing = false;
      },
      (err) => {
        console.log('Some error occured! Could not get quality products.');
        this.licensingDataFailed = true;
        this._loadingProductsLicensing = false;
      }
    );
  }

  generateProductLocationPieChart(data: DeploymentType) {
    const saasProducts = data?.saas_percentage;
    const onPremise = data?.on_premise_percentage;
    const canvas: HTMLCanvasElement = document.getElementById('ProductsLocationChart') as HTMLCanvasElement;
    if (canvas && !this.productLocationPieChart) {
      this.ctx = canvas.getContext('2d');
      this.productLocationPieChart = new Chart(this.ctx, {
        type: 'pie',
        data: {
          labels: [this.labelList?.['SAAS'], this.labelList?.['ON_PREMISE']],
          datasets: [
            {
              backgroundColor: [
                '#457ABF',
                '#0BC4D9',
                // '#95a5a6',
                // '#9b59b6',
                // '#f1c40f',
                // '#e74c3c',
              ],
              data: [saasProducts, onPremise],
            },
          ],
        },
        options: {
          legend: {
            display: true,
            position: 'bottom',
            align: 'center',
          },
          responsive: true,
          plugins: {
            datalabels: commonPieChartDataLabelConfig()
          },
          tooltips: {
            callbacks: {
              label: pieChartLabelCallback('%')
            }
          }
        },
      });
    }

    if (this.productLocationPieChart) {
      this.productLocationPieChart.data.datasets[0].data = [saasProducts, onPremise];
      this.productLocationPieChart.data.labels = [this.labelList?.['SAAS'], this.labelList?.['ON_PREMISE']];
      resetLegends(this.productLocationPieChart);
      this.productLocationPieChart.update();
    }


  }

  generateProductLicensingPieChart(data: DashboardLocationResponse) {
    const openSource: number = Number(data.open_source[0].precentage_os.toFixed(2));
    const closeSource: number = Number(data.closed_source[0].precentage_cs.toFixed(2));
    const none: number = Number(data.total_amount[0].precentage.toFixed(2));

    const canvas: HTMLCanvasElement = document.getElementById('ProductsLicensingChart') as HTMLCanvasElement;
    if (canvas && !this.productLicensingPieChart) {
      this.ctx = canvas.getContext('2d');
      this.productLicensingPieChart = new Chart(this.ctx, {
        type: 'pie',
        data: {
          labels: [this.labelList?.['OPEN_SOURCE'], this.labelList?.['CLOSE_SOURCE'], this.labelList?.['NONE']],
          datasets: [
            {
              backgroundColor: [
                '#457ABF',
                '#0BC4D9',
                '#9b59b6'
              ],
              data: [openSource, closeSource, none],
            },
          ],
        },
        options: {
          legend: {
            display: true,
            position: 'bottom',
            align: 'center',
          },
          responsive: true,
          plugins: {
            datalabels: commonPieChartDataLabelConfig()
          },
          tooltips: {
            callbacks: {
              label: pieChartLabelCallback('%')
            }
          }
        },
      });
    }

    if (this.productLicensingPieChart) {
      this.productLicensingPieChart.data.datasets[0].data = [openSource, closeSource, none];
      this.productLicensingPieChart.data.labels = [
        this.labelList?.['OPEN_SOURCE'],
        this.labelList?.['CLOSE_SOURCE'],
        this.labelList?.['NONE']
      ];
      resetLegends(this.productLicensingPieChart);
      this.productLicensingPieChart.update();
    }


  }



  refreshCanvasEqp() {
    this.emptyequipsDataFlag = false;
    this.equipsData = null;
    if (document.getElementById('equipmentDetails')) {
      document.getElementById('equipmentDetails').remove();
      let canvas = document.createElement('canvas');
      canvas.setAttribute('id', 'equipmentDetails');
      canvas.setAttribute('width', '320');
      canvas.setAttribute('height', '260');
      document.querySelector('#equipmentDetailsContainer').appendChild(canvas);
    }
  }

  // calculatePoint(i, intervalSize, colorRangeInfo) {
  //   var { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
  //   return useEndAsStart
  //     ? colorEnd - i * intervalSize
  //     : colorStart + i * intervalSize;
  // }
  // interpolateColors(dataLength, colorScale, colorRangeInfo) {
  //   var { colorStart, colorEnd } = colorRangeInfo;
  //   var colorRange = colorEnd - colorStart;
  //   var intervalSize = colorRange / dataLength;
  //   var i, colorPoint;
  //   var colorArray = [];

  //   for (i = 0; i < dataLength; i++) {
  //     colorPoint = this.calculatePoint(i, intervalSize, colorRangeInfo);
  //     colorArray.push(colorScale(colorPoint));
  //   }

  //   return colorArray;
  // }

  generateEquipmentDetails() {
    this.canvas = document.getElementById('equipmentDetails');
    if (this.canvas && !this.equipmentChart) {
      this.ctx = this.canvas.getContext('2d');
      this.equipmentChart = new Chart(this.ctx, {
        type: 'bar',
        data: {
          labels: this.equipsData.labels,
          datasets: [
            {
              data: this.equipsData.data,
              backgroundColor: this.getEqBgColor(this.equipsData.labels),
            },
          ],
        },
        options: {
          legend: { display: false },
          responsive: true,
          // display: true,
          plugins: {
            datalabels: {
              color: '#fff',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: 5,
              display: false
            }
          },
          scales: {
            yAxes: [
              {
                display: true,
                ticks: {
                  suggestedMin: 0, // minimum will be 0, unless there is a lower value.
                  // OR //
                  beginAtZero: true, // minimum value will be 0.
                },
              },
            ],
            xAxes: [
              {
                // categoryPercentage: 1.0,
                // barPercentage: 1.0,
              },
            ],
          },
        },
      });
    }

    if (this.equipmentChart) {
      this.equipmentChart.data.datasets[0].backgroundColor = this.getEqBgColor(this.equipsData.labels)
      this.equipmentChart.data.datasets[0].data = this.equipsData.data;
      this.equipmentChart.data.labels = this.equipsData.labels;
      this.equipmentChart.update();
    }
  }

  private getEqBgColor(data: any): string[] {
    return data?.map(d => EQUIPMENT_COLORS[d]) || [];
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
