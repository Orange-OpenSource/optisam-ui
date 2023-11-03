import { LOCAL_KEYS } from '@core/util/constants/constants';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import * as Chart from 'chart.js';
import * as d3 from 'd3';
import { Observable, Subject, throwError } from 'rxjs';
import { map, pluck, takeUntil, catchError, tap } from 'rxjs/operators';
import { DataManagementService } from 'src/app/core/services/data-management.service';
import { EquipmentsService } from 'src/app/core/services/equipments.service';
import { ProductService } from 'src/app/core/services/product.service';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { DashboardOverviewResponse, ErrorResponse, SharedAmount, SharedAmountParams, SoftwareMaintenance, SoftwareWithNoMaintenance } from '@core/modals';
import { AccountService, CommonService } from '@core/services';
import { MatSelect } from '@angular/material/select';
import { ProductsWithNoMaintainanceInfoComponent } from './products-with-no-maintainance-info/products-with-no-maintainance-info.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  canvas: any;
  ctx: any;
  tabList: string[] = [
    'Overview',
    'Quality',
    'Compliance',
    'Maintenance',
    'Software Usage Expenditure',
    'Park',
  ];
  currentTab: string = localStorage.getItem('dashboardTab') || this.tabList[0];
  parentGutterSize: '16px';
  childGutterSize: '8px';
  unsubscribeScope: Subject<void> = new Subject();
  lastUpdatedDate: any;
  nextUpdateDate: any;

  // Overview
  noOfProducts: any;
  noOfManagedEditors: any;
  valuationOfOwnedLicense: any;
  total_counterfeiting_amount: any;
  total_underusage_amount: any;
  valuationOfOwnedLicenseMaintenance: any;
  swLicCompData: any;
  emptyLicCompFlag: Boolean;
  equipsData: any;
  emptyequipsDataFlag: Boolean;
  productsPerEditorData: any;
  emptyproductsPerEditorFlag: Boolean;
  currentScope: any;
  getLicCompFailed: Boolean;
  getEquipsFailed: Boolean;
  getProductsPerEditorFailed: Boolean;
  getDevRatesFailed: Boolean;
  complianceRibbonColor: string;
  alertComplianceNetworkErr: Boolean;
  alertComplianceDbErr: Boolean;
  counterfeiting_percentage: number;
  overdeployment_percentage: number;
  qualityRibbonColor: string;
  alertQualityNetworkErr: Boolean;
  alertQualityDbErr: Boolean;
  data_quality: number;
  getProductsDbError: Boolean;
  getProductsNetworkError: Boolean;

  // Compliance
  editorsList: string[] = [];
  selectedEditor: string;
  odFVData: any;
  emptyodFVFlag: Boolean;
  cfFVData: any;
  emptycfFVFlag: Boolean;
  odNLData: any;
  emptyodNLFlag: Boolean;
  cfNLData: any;
  emptycfNLFlag: Boolean;
  getOverdeploymentFailed: Boolean;
  getCounterfeitingFailed: Boolean;

  // Quality
  noOfDataPoints: number = 6;
  frequency: string = 'MONTHLY'; // 'YEARLY', 'MONTHLY', 'DAILY'
  devRateData: any;
  timeLabelsArray: string[] = [];
  entitiesList: any[] = [];
  emptydevRateDataFlag: Boolean;
  failureRate: number;
  failureCausesData: any;
  emptyFailureCausesFlag: Boolean;
  failureCausesNoDataError: Boolean;
  getFailureCausesFailed: Boolean;
  failureRateFailed: Boolean;
  failureRateNoDataError: Boolean;
  failureRateServerError: Boolean;
  productsNotDeployed: number;
  productsNotAcquired: number;
  productsNotDeployedInfo: any;
  productsNotAcquiredInfo: any;
  hideStatus: boolean = false;
  totalReceivedAmount: number;
  totalSharedAmount: number;
  scopeExpense$: Observable<number>;
  scopeErrorMsg: string = null;
  filteredEditor: string[] = [];
  searchLoading: boolean = false;
  delayLoader: any = null;
  searchText: string = '';
  softwareMaintenance: SoftwareMaintenance;
  totalProductsWithNoMaintenance: number;
  ProductsWithNoMaintenance: SoftwareWithNoMaintenance;
  ProductsWithMaintenance: SoftwareMaintenance;

  constructor(
    private productService: ProductService,
    private dpsService: DataManagementService,
    private sharedService: SharedService,
    private router: Router,
    private dialog: MatDialog,
    private equipmentService: EquipmentsService,
    private cs: CommonService,
    private accountService: AccountService,
    private cd: ChangeDetectorRef
  ) {
    this.sharedService._emitScopeChange
      .pipe(takeUntil(this.unsubscribeScope.asObservable()))
      .subscribe((scope) => {
        if (scope) {
          this.currentScope = scope;
          const currentRoute = this.router.url;
          if (currentRoute === '/optisam/dashboard') {
            this.getAllApis();
          }
        }
      });
  }

  ngOnInit() {
    this.currentTab = 'Overview';
    this.currentScope = localStorage.getItem('scope');
    this.getAllApis();
    // this.sharedAmount();
  }

  private getAllApis(): void {
    this.getProductsQualityInfo();
    this.getProductsWithNoMaintenance();
    this.getDashboardUpdateInfo();
    this.generateCharts();
  }

  getScopeExpenses(): void {
    this.scopeExpense$ = this.accountService
      .getScopeExpense(this.cs.getLocalData(LOCAL_KEYS.SCOPE))
      .pipe(
        tap(() => {
          this.scopeErrorMsg = null;
        }),
        pluck('expenses'),
        map((expenses: number) => Math.abs(expenses)),
        catchError((e: any) => {
          console.log(e);
          switch (e.code) {
            case 5:
              this.scopeErrorMsg = null; //`DASHBOARDS.ERROR.NO_EXPENSES_EXIST`;
              break;
            default:
              this.scopeErrorMsg = `DASHBOARDS.ERROR.SERVER_ERROR`;
              break;
          }
          return throwError(e);
        })
      );
  }

  getDashboardUpdateInfo() {
    this.lastUpdatedDate = null;
    this.nextUpdateDate = null;
    this.productService
      .getDashboardUpdateInfo(this.currentScope, 'CEST')
      .subscribe(
        (res) => {
          this.lastUpdatedDate = res.updated_at;
          this.nextUpdateDate = res.next_update_at;
        },
        (err) => {
          console.log(
            'Some error occured! Could not get Dashboard update details'
          );
        }
      );
  }

  sharedAmount(): void {
    const obj: SharedAmountParams = { scope: this.currentScope };
    this.productService.getSharedAmount(obj).subscribe(
      (res: SharedAmount) => {
        this.totalSharedAmount = res.total_shared_amount;
        this.totalReceivedAmount = res.total_recieved_amount;
      },
      (err) => {
        console.log('Some error occured! Could not get Details');
      }
    );
  }

  generateCharts() {
    localStorage.setItem('dashboardTab', this.currentTab);
    this.canvas = null;
    this.ctx = null;
    this.scopeErrorMsg = null;
    if (this.currentTab === 'Overview') {
      this.generateChartsForOverview();
    } else if (this.currentTab === 'Quality') {
      this.generateChartsForQuality();
    } else if (this.currentTab === 'Compliance') {
      this.generateChartsForCompliance();
    } else if (this.currentTab === 'Maintenance') {
      this.generateChartsForMaintenance();
    }
  }

  generateChartsForOverview() {
    this.getLicCompFailed = false;
    this.getEquipsFailed = false;
    this.getProductsPerEditorFailed = false;
    this.complianceRibbonColor = '';
    this.getComplianceAlert();
    this.getProductsInfo();
    this.sharedAmount();
    this.getProductsPerEditor();
    this.getSoftwareLicenceComposition();
    this.getEquipmentDetails();
    this.getScopeExpenses();
  }

  generateChartsForMaintenance() {
    this.getProductsMaintenance();
  }

  getComplianceAlert() {
    this.alertComplianceDbErr = false;
    this.alertComplianceNetworkErr = false;
    this.productService.getComplianceAlert(this.currentScope).subscribe(
      (res) => {
        if (!res) {
          this.counterfeiting_percentage = 0;
          this.overdeployment_percentage = 0;
          this.complianceRibbonColor = 'Green';
        } else {
          //overdeployment: under-usage
          this.counterfeiting_percentage = res.counterfeiting_percentage || 0;
          this.overdeployment_percentage = res.overdeployment_percentage || 0;
          if (
            this.counterfeiting_percentage == 0 &&
            this.overdeployment_percentage <= 10
          ) {
            this.complianceRibbonColor = 'Green';
          } else if (
            this.counterfeiting_percentage > 10 ||
            this.overdeployment_percentage > 25
          ) {
            this.complianceRibbonColor = 'Red';
          } else {
            this.complianceRibbonColor = 'Orange';
          }
        }
      },
      (err) => {
        this.complianceRibbonColor = 'Error';
        if (err.status == 500) {
          this.alertComplianceDbErr = true;
        } else {
          this.alertComplianceNetworkErr = true;
        }
        console.log('Some error occured! Could not get compliance alert info.');
      }
    );
  }

  getProductsInfo() {
    this.noOfProducts = null;
    this.noOfManagedEditors = null;
    this.valuationOfOwnedLicense = null;
    this.valuationOfOwnedLicenseMaintenance = null;
    this.total_counterfeiting_amount = null;
    this.total_underusage_amount = null;
    this.getProductsDbError = false;
    this.getProductsNetworkError = false;
    this.productService.getProductsOverview(this.currentScope).subscribe(
      (res: DashboardOverviewResponse) => {
        this.noOfProducts = res.num_products || 0;
        this.noOfManagedEditors = res.num_editors || 0;
        this.valuationOfOwnedLicense = res.total_license_cost || 0;
        this.valuationOfOwnedLicenseMaintenance =
          res.total_maintenance_cost || 0;
        this.total_underusage_amount = res.total_underusage_amount || 0;
        this.total_counterfeiting_amount = res.total_counterfeiting_amount || 0;
      },
      (err) => {
        if (err.status == 500) {
          this.getProductsDbError = true;
        } else {
          this.getProductsNetworkError = true;
        }
        console.log(
          'Some error occured! Could not get products info.',
          this.getProductsNetworkError
        );
      }
    );
  }

  getProductsPerEditor() {
    this.refreshCanvasProdsPerEditor();
    this.productService.getProductsPerEditor(this.currentScope).subscribe(
      (res) => {
        if (res.editors_products && res.editors_products.length !== 0) {
          this.productsPerEditorData = {
            labels: res.editors_products.map((p) => p.editor),
            data: res.editors_products.map((p) => p.num_products),
            colorScale: d3.interpolateMagma,
            colorRangeInfo: {
              colorStart: 0.4,
              colorEnd: 0.8,
              useEndAsStart: true,
            },
          };
          this.emptyproductsPerEditorFlag = false;
          this.generateNoOfProductsPerEditor();
        } else {
          this.emptyproductsPerEditorFlag = true;
          this.productsPerEditorData = null;
        }
        this.getProductsPerEditorFailed = false;
      },
      (err) => {
        this.getProductsPerEditorFailed = true;
        console.log('Some error occured! Could not get editor-product info.');
      }
    );
  }

  getSoftwareLicenceComposition() {
    this.refreshCanvasLic();
    this.productService.getSwLicComposition(this.currentScope).subscribe(
      (res) => {
        if (res.metrics_products && res.metrics_products.length > 0) {
          this.swLicCompData = {
            labels: res.metrics_products.map((p) => p.metric_name),
            data: res.metrics_products.map((p) => p.num_products),
            colorScale: d3.interpolateGnBu,
            colorRangeInfo: {
              colorStart: 0.5,
              colorEnd: 1,
              useEndAsStart: false,
            },
          };
          this.emptyLicCompFlag = false;
          this.generateSoftwareLicenceComposition();
        } else {
          this.emptyLicCompFlag = true;
          this.swLicCompData = null;
        }
        this.getLicCompFailed = false;
      },
      (err) => {
        this.getLicCompFailed = true;
        console.log('Some error occured! Could not get software licence info.');
      }
    );
  }

  getEquipmentDetails() {
    this.refreshCanvasEqp();
    this.equipmentService.getEquipmentsOverview(this.currentScope).subscribe(
      (res) => {
        if (res.types_equipments && res.types_equipments.length !== 0) {
          this.equipsData = {
            labels: res.types_equipments.map((p) => p.equip_type).reverse(),
            data: res.types_equipments.map((p) => p.num_equipments).reverse(),
            colorScale: d3.interpolateCool,
            colorRangeInfo: {
              colorStart: 0.3,
              colorEnd: 1,
            },
          };
          this.emptyequipsDataFlag = false;
          this.generateEquipmentDetails();
        } else {
          this.emptyequipsDataFlag = true;
          this.equipsData = null;
        }
        this.getEquipsFailed = false;
      },
      (err) => {
        this.getEquipsFailed = true;
        console.log('Some error occured! Could not get software licence info.');
      }
    );
  }

  generateSoftwareLicenceComposition() {
    this.canvas = document.getElementById('swLicComChart');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      const myChart = new Chart(this.ctx, {
        type: 'doughnut',
        data: {
          labels: this.swLicCompData.labels,
          datasets: [
            {
              data: this.swLicCompData.data,
              backgroundColor: this.interpolateColors(
                this.swLicCompData.data.length,
                this.swLicCompData.colorScale,
                this.swLicCompData.colorRangeInfo
              ),
            },
          ],
        },
        options: {
          legend: {
            display: true,
            position: 'bottom',
          },
          plugins: {
            labels: {
              render: 'percentage',
              fontColor: 'white',
              precision: 2,
            },
          },
          responsive: false,
        },
      });
    }
  }

  generateEquipmentDetails() {
    this.canvas = document.getElementById('equipmentDetails');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      const myChart = new Chart(this.ctx, {
        type: 'bar',
        data: {
          labels: this.equipsData.labels,
          datasets: [
            {
              data: this.equipsData.data,
              backgroundColor: this.interpolateColors(
                this.equipsData.data.length,
                this.equipsData.colorScale,
                this.equipsData.colorRangeInfo
              ),
            },
          ],
        },
        options: {
          legend: { display: false },
          responsive: false,
          plugins: {
            labels: false,
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
          },
        },
      });
    }
  }

  generateNoOfProductsPerEditor() {
    this.canvas = document.getElementById('noOfProdsPerEditor');
    console.log(this.canvas);
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      const myChart = new Chart(this.ctx, {
        type: 'pie',
        data: {
          labels: this.productsPerEditorData.labels,
          datasets: [
            {
              data: this.productsPerEditorData.data,
              backgroundColor: this.interpolateColors(
                this.productsPerEditorData.data.length,
                this.productsPerEditorData.colorScale,
                this.productsPerEditorData.colorRangeInfo
              ),
            },
          ],
        },
        options: {
          legend: {
            display: true,
            position: 'bottom',
          },
          plugins: {
            labels: {
              fontColor: 'white',
              precision: 2,
              position: 'border',
            },
          },
          responsive: false,
        },
      });
    }
  }

  refreshCanvasProdsPerEditor() {
    this.emptyproductsPerEditorFlag = false;
    this.productsPerEditorData = null;
    if (document.getElementById('noOfProdsPerEditor')) {
      document.getElementById('noOfProdsPerEditor').remove();
      let canvas = document.createElement('canvas');
      canvas.setAttribute('id', 'noOfProdsPerEditor');
      canvas.setAttribute('width', '380');
      canvas.setAttribute('height', '260');
      document
        .querySelector('#noOfProdsPerEditorContainer')
        .appendChild(canvas);
    }
  }

  refreshCanvasLic() {
    this.emptyLicCompFlag = false;
    this.swLicCompData = null;
    if (document.getElementById('swLicComChart')) {
      document.getElementById('swLicComChart').remove();
      let canvas = document.createElement('canvas');
      canvas.setAttribute('id', 'swLicComChart');
      canvas.setAttribute('width', '380');
      canvas.setAttribute('height', '260');
      document.querySelector('#swLicComChartContainer').appendChild(canvas);
    }
  }

  refreshCanvasEqp() {
    this.emptyequipsDataFlag = false;
    this.equipsData = null;
    if (document.getElementById('equipmentDetails')) {
      document.getElementById('equipmentDetails').remove();
      let canvas = document.createElement('canvas');
      canvas.setAttribute('id', 'equipmentDetails');
      canvas.setAttribute('width', '380');
      canvas.setAttribute('height', '260');
      document.querySelector('#equipmentDetailsContainer ').appendChild(canvas);
    }
  }

  // Quality
  generateChartsForQuality() {
    this.canvas = null;
    this.ctx = null;
    this.getQualityProducts();
    // this.getFailureRate();
    // this.getFailureCauses();
    this.setTimeLabels();
    this.getDevelopmentRateDetails();
  }

  getProductsQualityInfo() {
    this.data_quality = 0;
    this.qualityRibbonColor = '';
    this.productsNotDeployed = null;
    this.productsNotAcquired = null;
    this.productService.getProductsQualityInfo(this.currentScope).subscribe(
      (res) => {
        if (!res) {
          this.productsNotDeployed = 0;
          this.productsNotAcquired = 0;
          this.data_quality = 0;
          this.qualityRibbonColor = 'Green';
        } else {
          this.productsNotDeployed = res.not_deployed_products || 0;
          this.productsNotAcquired = res.not_acquired_products || 0;
          this.data_quality = (
            (res.not_acquired_products_percentage || 0) +
            (res.not_deployed_products_percentage || 0)
          ).toFixed(2);
          if (this.data_quality <= 10) {
            this.qualityRibbonColor = 'Green';
          } else if (this.data_quality > 30) {
            this.qualityRibbonColor = 'Red';
          } else {
            this.qualityRibbonColor = 'Orange';
          }
        }
      },
      (err) => {
        this.qualityRibbonColor = 'Error';
        if (err.status == 500) {
          this.alertQualityDbErr = true;
        } else {
          this.alertQualityNetworkErr = true;
        }
        console.log('Some error occured! Could not get product quality info.');
      }
    );
  }

  getProductsWithNoMaintenance() {
    this.productService
      .getProductsWithNoMaintenance(this.currentScope)
      .subscribe(
        (res: SoftwareWithNoMaintenance) => {
          this.ProductsWithNoMaintenance = res;
          console.log(this.ProductsWithNoMaintenance);
        },
        (err) => {
          console.log(
            'Some error occured! Could not get product quality info.'
          );
          if (err.status == 500) {
            this.alertQualityDbErr = true;
          } else {
            this.alertQualityNetworkErr = true;
          }
        }
      );
  }

  openProductsNoMaintenanceInfo(obj: SoftwareWithNoMaintenance) {
    console.log(obj);
    let dialogRef = this.dialog.open(ProductsWithNoMaintainanceInfoComponent, {
      width: '40%',
      autoFocus: false,
      disableClose: true,
      data: obj,
    });
  }
  getQualityProducts() {
    this.productsNotDeployedInfo = null;
    this.productsNotAcquiredInfo = null;
    this.productsNotAcquired = 0;
    this.productsNotDeployed = 0;
    this.productService.getProductsQualityProducts(this.currentScope).subscribe(
      (res) => {
        this.productsNotDeployedInfo = res?.products_not_deployed;
        this.productsNotAcquiredInfo = res?.products_not_acquired;
        this.productsNotAcquired = this.productsNotAcquiredInfo?.length || 0;
        this.productsNotDeployed = this.productsNotDeployedInfo?.length || 0;
      },
      (err) => {
        console.log('Some error occured! Could not get quality products.');
      }
    );
  }

  getProductsMaintenance() {
    this.productService.getProductsWithMaintenance(this.currentScope).subscribe(
      (res: SoftwareMaintenance) => {
        this.ProductsWithMaintenance = res;
        this.generateDeployedPieChart(res);
      },
      (err) => {
        console.log('Some error occured! Could not get quality products.');
        if (err.status == 500) {
          this.alertQualityDbErr = true;
        } else {
          this.alertQualityNetworkErr = true;
        }
      }
    );
  }

  openProductsInfo(products) {
    let dialogRef = this.dialog.open(products, {
      width: '40%',
      autoFocus: false,
      disableClose: true,
    });
  }

  getFailureRate() {
    this.failureRateFailed = false;
    this.failureRateNoDataError = false;
    this.failureRateServerError = false;
    this.failureRate = null;
    this.dpsService.getFailureRate(this.currentScope).subscribe(
      (res) => {
        if (res) {
          this.failureRate = res.failureRate || 0;
        } else {
          this.failureRateNoDataError = true;
        }
      },
      (error) => {
        if (error.status == 500) {
          this.failureRateServerError = true;
        } else {
          this.failureRateFailed = true;
        }
        console.log('Error fetching failure rate', error);
      }
    );
  }

  getFailureCauses() {
    this.refreshCanvasFailureCauses();
    this.dpsService.getFailureReason(this.currentScope).subscribe(
      (res) => {
        if (res) {
          this.failureCausesData = {
            labels: Object.keys(res.failureReasons),
            data: Object.values(res.failureReasons),
            colorScale: d3.interpolateMagma,
            colorRangeInfo: {
              colorStart: 0.4,
              colorEnd: 0.8,
              useEndAsStart: true,
            },
          };
          this.emptyFailureCausesFlag = false;
          this.generateFailureCauses();
        } else {
          this.emptyFailureCausesFlag = true;
          this.failureCausesData = null;
        }
        this.getFailureCausesFailed = false;
        this.failureCausesNoDataError = false;
      },
      (error) => {
        if (error.status == 404) {
          this.failureCausesNoDataError = true;
          this.getFailureCausesFailed = false;
        } else {
          this.getFailureCausesFailed = true;
          this.failureCausesNoDataError = false;
        }
        console.log('Error fetching failure reasons:', error.status);
      }
    );
  }

  generateFailureCauses() {
    this.canvas = document.getElementById('failureCauses');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      const myChart = new Chart(this.ctx, {
        type: 'pie',
        data: {
          labels: this.failureCausesData.labels,
          datasets: [
            {
              data: this.failureCausesData.data,
              backgroundColor: this.interpolateColors(
                this.failureCausesData.data.length,
                this.failureCausesData.colorScale,
                this.failureCausesData.colorRangeInfo
              ),
            },
          ],
        },
        options: {
          legend: {
            display: true,
            position: 'bottom',
          },
          plugins: {
            labels: {
              fontColor: 'white',
              precision: 2,
              position: 'border',
            },
          },
          responsive: false,
        },
      });
    }
  }

  refreshCanvasFailureCauses() {
    this.failureCausesData = null;
    this.emptyFailureCausesFlag = false;
    if (document.getElementById('failureCauses')) {
      document.getElementById('failureCauses').remove();
      let canvas = document.createElement('canvas');
      canvas.setAttribute('id', 'failureCauses');
      canvas.setAttribute('width', '400');
      canvas.setAttribute('height', '270');
      document
        .querySelector('#failureCausesContainer .mat-figure')
        .appendChild(canvas);
    }
  }

  setTimeLabels() {
    let currDate = new Date();
    this.timeLabelsArray = [];
    switch (this.frequency) {
      case 'DAILY':
        let currDay = currDate.getDate();
        for (let i = 1; i <= this.noOfDataPoints; i++) {
          const label = (currDay - i).toString();
          this.timeLabelsArray.push(label);
        }
        break;
      case 'MONTHLY':
        let months = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];
        let currMonth = currDate.getMonth() + 12;
        for (let i = 1; i <= this.noOfDataPoints; i++) {
          const label = months[currMonth - i];
          this.timeLabelsArray.push(label);
        }
        break;
      case 'YEARLY':
        let currYear = currDate.getFullYear();
        for (let i = 0; i < this.noOfDataPoints; i++) {
          const label = (currYear - i).toString();
          this.timeLabelsArray.push(label);
        }
        break;
    }
  }
  // getSoftwareMaintenanceData() {
  //   const currentScope = localStorage.getItem('scope');
  //   this.productService.getSoftwareMaintenance(currentScope).subscribe(
  //     (res: SoftwareMaintenance) => {
  //       console.log(res);
  //       this.softwareMaintenance = res;
  //       this.getSoftwareMaintenance(this.softwareMaintenance);
  //     },
  //     (err) => {
  //       console.log('some error occured');
  //     }
  //   );
  // }
  getDevelopmentRateDetails() {
    this.refreshCanvasDevRate();
    this.dpsService
      .getDevelopmentRates(
        this.currentScope,
        this.frequency,
        this.noOfDataPoints
      )
      .subscribe(
        (res) => {
          if (res) {
            this.entitiesList = [
              {
                name: '% evolution applications',
                data: res.applications.reverse(),
              },
              {
                name: '% evolution products',
                data: res.products.reverse(),
              },
              {
                name: '% evolution equipments',
                data: res.equipments.reverse(),
              },
              {
                name: '% evolution acquired rights',
                data: res.acqrights.reverse(),
              },
            ];
            this.devRateData = {
              labels: this.timeLabelsArray.reverse(),
              data: { datasets: [] },
            };
            for (let i = 0; i < this.entitiesList.length; i++) {
              this.devRateData['data']['datasets'].push({
                label: this.entitiesList[i].name,
                type: 'line',
                borderColor: d3.interpolateTurbo(
                  Number('0.' + ((i + 1) * 2).toString())
                ),
                data: this.entitiesList[i].data,
                fill: false,
              });
            }
            this.emptydevRateDataFlag = false;
            this.generateDevRateDetails();
          } else {
            this.emptydevRateDataFlag = true;
            this.devRateData = null;
          }
          this.getDevRatesFailed = false;
        },
        (err) => {
          this.getDevRatesFailed = true;
          console.log(
            'Some error occured! Could not get development rate details.'
          );
        }
      );
  }

  generateDevRateDetails() {
    this.canvas = document.getElementById('devRateDetails');
    console.log(this.canvas);
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      const myChart = new Chart(this.ctx, {
        type: 'line',
        data: {
          labels: this.devRateData.labels,
          datasets: this.devRateData.data.datasets,
        },
        options: {
          legend: {
            display: true,
            position: 'bottom',
            align: 'start',
          },
          responsive: false,
          plugins: {
            labels: true,
          },
        },
      });
    }
  }

  refreshCanvasDevRate() {
    this.devRateData = null;
    this.emptydevRateDataFlag = false;
    if (document.getElementById('devRateDetails')) {
      document.getElementById('devRateDetails').remove();
      let canvas = document.createElement('canvas');
      canvas.setAttribute('id', 'devRateDetails');
      canvas.setAttribute('width', '400');
      canvas.setAttribute('height', '270');
      document
        .querySelector('#devRateDetailsContainer .mat-figure')
        .appendChild(canvas);
    }
  }
  // Compliance tab
  generateChartsForCompliance() {
    this.getOverdeploymentFailed = false;
    this.getCounterfeitingFailed = false;
    this.refreshCanvasOdFV();
    this.refreshCanvasOdNL();
    this.refreshCanvasCfFV();
    this.refreshCanvasCfNL();
    this.getEditors();
  }

  getEditors() {
    const query = '?scope=' + this.currentScope;
    this.productService.getEditorList(query).subscribe(
      (response: any) => {
        this.editorsList = response.editor || [];
        this.editorsList.sort();
        this.filteredEditor = [...this.editorsList];
        this.selectedEditor = this.filteredEditor[0];
        this.editorSelected();
      },
      (error) => {
        this.editorSelected();
        console.log('Error fetching editors');
      }
    );
  }
  searchEditor(e: Event): void {
    e.stopImmediatePropagation();
    e.preventDefault();
  }

  searchKeydown(e: Event): void {
    e.stopPropagation();
  }

  searchInputEvent(e: KeyboardEvent): void {
    this.searchLoading = true;
    if (this.delayLoader !== null) clearTimeout(this.delayLoader);
    this.delayLoader = setTimeout(() => {
      this.searchText = (e.target as HTMLInputElement).value
        .trim()
        .toLowerCase();
      if (this.searchText == '') {
        this.filteredEditor = [...this.editorsList];
        this.searchLoading = false;
        this.cd.detectChanges();
        return;
      }
      this.filteredEditor = [
        ...this.editorsList.filter((editor: string) =>
          editor.toLowerCase().includes(this.searchText)
        ),
      ];
      this.delayLoader = null;
      this.searchLoading = false;
      this.cd.detectChanges();
    }, 500);
  }

  searchInputOpenChange(change: boolean, target: MatSelect): void {
    this.searchText = '';
    // this.searchInput. as HTMLInputElement));
  }

  editorSelected() {
    this.refreshCanvasOdFV();
    this.refreshCanvasOdNL();
    this.refreshCanvasCfFV();
    this.refreshCanvasCfNL();
    if (this.selectedEditor && this.selectedEditor !== '') {
      this.getOverdeploymentDetails();
      this.getCounterfeitingDetails();
    } else {
      this.emptyodFVFlag = true;
      this.odFVData = null;
      this.emptyodNLFlag = true;
      this.odNLData = null;
      this.emptycfFVFlag = true;
      this.cfFVData = null;
      this.emptycfNLFlag = true;
      this.cfNLData = null;
    }
  }
  // Overdeployment
  getOverdeploymentDetails() {
    this.productService
      .getProductsComplianceOverdeployment(
        this.currentScope,
        this.selectedEditor
      )
      .subscribe(
        (res) => {
          if (res.products_costs) {
            const dataListFV = {
              products: res.products_costs.map((p) =>
                p.swid_tag.replaceAll(',', '\n')
              ),
              data: [
                {
                  label: 'Acquired Rights',
                  data: res.products_costs.map((p) => p.licenses_acquired_cost),
                },
                {
                  label: 'Rights Used',
                  data: res.products_costs.map((p) => p.licenses_computed_cost),
                },
                {
                  label: 'Delta',
                  data: res.products_costs.map((p) => p.delta_cost),
                },
              ],
            };
            this.odFVData = {
              labels: dataListFV.products,
              datasets: [],
            };
            for (let i = 0; i < dataListFV.data.length; i++) {
              this.odFVData.datasets.push({
                label: dataListFV.data[i].label,
                type: 'bar',
                backgroundColor: d3.interpolateBlues(
                  Number('0.' + (i + 5).toString())
                ),
                data: dataListFV.data[i].data,
              });
            }
            this.emptyodFVFlag = false;
            this.generateOverdeploymentFVChart();
          } else {
            this.emptyodFVFlag = true;
            this.odFVData = null;
          }

          if (res.products_licenses) {
            const dataListNL = {
              products: res.products_licenses.map((p) =>
                p.swid_tag.replaceAll(',', '\n')
              ),

              data: [
                {
                  label: 'Acquired Rights',
                  data: res.products_licenses.map(
                    (p) => p.num_licenses_acquired
                  ),
                },
                {
                  label: 'Rights Used',
                  data: res.products_licenses.map(
                    (p) => p.num_licenses_computed
                  ),
                },
                {
                  label: 'Delta',
                  data: res.products_licenses.map((p) => p.delta),
                },
              ],
            };
            this.odNLData = {
              labels: dataListNL.products,
              datasets: [],
            };
            for (let i = 0; i < dataListNL.data.length; i++) {
              this.odNLData.datasets.push({
                label: dataListNL.data[i].label,
                type: 'bar',
                backgroundColor: d3.interpolateBlues(
                  Number('0.' + (i + 5).toString())
                ),
                data: dataListNL.data[i].data,
              });
            }
            this.emptyodNLFlag = false;
            this.generateOverdeploymentNLChart();
          } else {
            this.emptyodNLFlag = true;
            this.odNLData = null;
          }
          this.getOverdeploymentFailed = false;
        },
        (err) => {
          this.getOverdeploymentFailed = true;
          console.log('Some error occured! Could not get overdeployment data.');
        }
      );
  }
  // Chart for Financial Volume
  generateOverdeploymentFVChart() {
    this.canvas = document.getElementById('od_FV_chart');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      const myChart = new Chart(this.ctx, {
        type: 'bar',
        data: {
          labels: this.odFVData.labels,
          datasets: this.odFVData.datasets,
        },
        options: {
          legend: {
            display: true,
            position: 'bottom',
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  callback: function (label, index, labels) {
                    if (labels.length > 1 && label.length > 16) {
                      return label.slice(0, 15) + '...';
                    } else {
                      return label;
                    }
                  },
                },
              },
            ],
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
          },
          responsive: false,
          plugins: {
            labels: false,
          },
        },
      });
    }
  }

  refreshCanvasOdFV() {
    this.odFVData = null;
    this.emptyodFVFlag = false;
    if (document.getElementById('od_FV_chart')) {
      document.getElementById('od_FV_chart').remove();
      let canvas = document.createElement('canvas');
      canvas.setAttribute('id', 'od_FV_chart');
      canvas.setAttribute('width', '380');
      canvas.setAttribute('height', '260');
      document
        .querySelector('#odFVChartContainer .mat-figure')
        .appendChild(canvas);
    }
  }

  // Chart for No of licenses

  generateOverdeploymentNLChart() {
    this.canvas = document.getElementById('od_NL_chart');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      const myChart = new Chart(this.ctx, {
        type: 'bar',
        data: {
          labels: this.odNLData.labels,
          datasets: this.odNLData.datasets,
        },
        options: {
          legend: {
            display: true,
            position: 'bottom',
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  callback: function (label, index, labels) {
                    if (labels.length > 1 && label.length > 16) {
                      return label.slice(0, 15) + '...';
                    } else {
                      return label;
                    }
                  },
                },
              },
            ],
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
          },
          responsive: false,
          plugins: {
            labels: false,
          },
        },
      });
    }
  }

  refreshCanvasOdNL() {
    this.odNLData = null;
    this.emptyodNLFlag = false;
    if (document.getElementById('od_NL_chart')) {
      document.getElementById('od_NL_chart').remove();
      let canvas = document.createElement('canvas');
      canvas.setAttribute('id', 'od_NL_chart');
      canvas.setAttribute('width', '380');
      canvas.setAttribute('height', '260');
      document
        .querySelector('#odNLChartContainer .mat-figure')
        .appendChild(canvas);
    }
  }

  // Counterfeiting
  getCounterfeitingDetails() {
    this.productService
      .getProductsComplianceCounterfeiting(
        this.currentScope,
        this.selectedEditor
      )
      .subscribe(
        (res) => {
          if (res.products_costs) {
            const dataListFV = {
              products: res.products_costs.map((p) =>
                p.swid_tag.replaceAll(',', '\n')
              ),
              data: [
                {
                  label: 'Acquired Rights',
                  data: res.products_costs.map((p) => p.licenses_acquired_cost),
                },
                {
                  label: 'Rights Used',
                  data: res.products_costs.map((p) => p.licenses_computed_cost),
                },
                {
                  label: 'Delta',
                  data: res.products_costs.map((p) => {
                    if (p.delta_cost < 0) return p.delta_cost * -1;
                    else return p.delta_cost;
                  }),
                },
              ],
            };
            this.cfFVData = {
              labels: dataListFV.products,
              datasets: [],
            };
            for (let i = 0; i < dataListFV.data.length; i++) {
              this.cfFVData.datasets.push({
                label: dataListFV.data[i].label,
                type: 'bar',
                backgroundColor: d3.interpolateReds(
                  Number('0.' + ((i + 1) * 2).toString())
                ),
                data: dataListFV.data[i].data,
              });
            }
            this.emptycfFVFlag = false;
            this.generateCounterfeitingFVChart();
          } else {
            this.emptycfFVFlag = true;
            this.cfFVData = null;
          }
          if (res.products_licenses) {
            const dataListNL = {
              products: res.products_licenses.map((p) =>
                p.swid_tag.replaceAll(',', '\n')
              ),
              data: [
                {
                  label: 'Acquired Rights',
                  data: res.products_licenses.map(
                    (p) => p.num_licenses_acquired
                  ),
                },
                {
                  label: 'Rights Used',
                  data: res.products_licenses.map(
                    (p) => p.num_licenses_computed
                  ),
                },
                {
                  label: 'Delta',
                  data: res.products_licenses.map((p) => {
                    if (p.delta < 0) return p.delta * -1;
                    else return p.delta;
                  }),
                },
              ],
            };
            this.cfNLData = {
              labels: dataListNL.products,
              datasets: [],
            };
            for (let i = 0; i < dataListNL.data.length; i++) {
              this.cfNLData.datasets.push({
                label: dataListNL.data[i].label,
                type: 'bar',
                backgroundColor: d3.interpolateReds(
                  Number('0.' + ((i + 1) * 2).toString())
                ),
                data: dataListNL.data[i].data,
              });
            }
            this.emptycfNLFlag = false;
            this.generateCounterfeitingNLChart();
          } else {
            this.emptycfNLFlag = true;
            this.cfNLData = null;
          }
          this.getCounterfeitingFailed = false;
        },
        (err) => {
          this.getCounterfeitingFailed = true;
          console.log('Some error occured! Could not get counterfeiting data.');
        }
      );
  }
  // Chart for Financial Volume
  generateCounterfeitingFVChart() {
    this.canvas = document.getElementById('cf_FV_chart');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      const myChart = new Chart(this.ctx, {
        type: 'bar',
        data: {
          labels: this.cfFVData.labels,
          datasets: this.cfFVData.datasets,
        },
        options: {
          legend: {
            display: true,
            position: 'bottom',
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  callback: function (label, index, labels) {
                    if (labels.length > 1 && label.length > 16) {
                      return label.slice(0, 15) + '...';
                    } else {
                      return label;
                    }
                  },
                },
              },
            ],
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
          },
          responsive: false,
          plugins: {
            labels: false,
          },
        },
      });
    }
  }

  refreshCanvasCfFV() {
    this.cfFVData = null;
    this.emptycfFVFlag = false;
    if (document.getElementById('cf_FV_chart')) {
      document.getElementById('cf_FV_chart').remove();
      let canvas = document.createElement('canvas');
      canvas.setAttribute('id', 'cf_FV_chart');
      canvas.setAttribute('width', '380');
      canvas.setAttribute('height', '260');
      document
        .querySelector('#cfFVChartContainer .mat-figure')
        .appendChild(canvas);
    }
  }
  // Chart for No. of Licenses
  generateCounterfeitingNLChart() {
    this.canvas = document.getElementById('cf_NL_chart');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      const myChart = new Chart(this.ctx, {
        type: 'bar',
        data: {
          labels: this.cfNLData.labels,
          datasets: this.cfNLData.datasets,
        },
        options: {
          legend: {
            display: true,
            position: 'bottom',
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  callback: function (label, index, labels) {
                    if (labels.length > 1 && label.length > 16) {
                      return label.slice(0, 15) + '...';
                    } else {
                      return label;
                    }
                  },
                },
              },
            ],
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
          },

          responsive: false,
          plugins: {
            labels: false,
          },
        },
      });
    }
  }

  refreshCanvasCfNL() {
    this.cfNLData = null;
    this.emptycfNLFlag = false;
    if (document.getElementById('cf_NL_chart')) {
      document.getElementById('cf_NL_chart').remove();
      let canvas = document.createElement('canvas');
      canvas.setAttribute('id', 'cf_NL_chart');
      canvas.setAttribute('width', '380');
      canvas.setAttribute('height', '260');
      document
        .querySelector('#cfNLChartContainer .mat-figure')
        .appendChild(canvas);
    }
  }

  // ***** Common Methods *****

  // Color generation
  calculatePoint(i, intervalSize, colorRangeInfo) {
    var { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
    return useEndAsStart
      ? colorEnd - i * intervalSize
      : colorStart + i * intervalSize;
  }

  interpolateColors(dataLength, colorScale, colorRangeInfo) {
    var { colorStart, colorEnd } = colorRangeInfo;
    var colorRange = colorEnd - colorStart;
    var intervalSize = colorRange / dataLength;
    var i, colorPoint;
    var colorArray = [];

    for (i = 0; i < dataLength; i++) {
      colorPoint = this.calculatePoint(i, intervalSize, colorRangeInfo);
      colorArray.push(colorScale(colorPoint));
    }

    return colorArray;
  }

  generateDeployedPieChart(data: SoftwareMaintenance) {
    const productWithMaintenancePercentage =
      data?.product_with_maintenance_percentage;
    const productsWithoutMaintenancePercentage =
      data?.product_without_maintenance_percentage;
    this.canvas = document.getElementById('deployedProductsChart');
    console.log(this.canvas);
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      const myChart = new Chart(this.ctx, {
        type: 'pie',
        data: {
          labels: ['Covered', 'Non Covered'],
          datasets: [
            {
              backgroundColor: [
                '#2ecc71',
                '#3498db',
                // '#95a5a6',
                // '#9b59b6',
                // '#f1c40f',
                // '#e74c3c',
              ],
              data: [
                productWithMaintenancePercentage,
                productsWithoutMaintenancePercentage,
              ],
            },
          ],
        },
        options: {
          legend: {
            display: true,
            position: 'bottom',
            align: 'center',
          },
          responsive: false,
          plugins: {
            labels: true,
          },
        },
      });
    }
  }

  getSoftwareMaintenance(data: SoftwareMaintenance) {
    const productsWithMaintenance = data?.product_with_maintenance_percentage;
    const productsWithoutMaintenance =
      data?.product_without_maintenance_percentage;
    this.canvas = document.getElementById('getSoftwareMaintenance');
    console.log(this.canvas);
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      const myChart = new Chart(this.ctx, {
        type: 'pie',
        data: {
          labels: ['Covered', 'Non Covered'],
          datasets: [
            {
              backgroundColor: [
                '#2ecc71',
                '#3498db',
                // '#95a5a6',
                // '#9b59b6',
                // '#f1c40f',
                // '#e74c3c',
              ],
              data: [productsWithMaintenance, productsWithoutMaintenance],
            },
          ],
        },
        options: {
          legend: {
            display: true,
            position: 'bottom',
            align: 'center',
          },
          responsive: false,
          plugins: {
            labels: true,
          },
        },
      });
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('dashboardTab');
    this.unsubscribeScope.next();
  }
}
