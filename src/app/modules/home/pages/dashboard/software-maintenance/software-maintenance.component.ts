import { Component, OnDestroy, OnInit, inject, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonService, ProductService } from '@core/services';
import * as Chart from 'chart.js';
import { ProductsWithNoMaintainanceInfoComponent } from '../products-with-no-maintainance-info/products-with-no-maintainance-info.component';
import { DashboardOverviewResponse, Overview, SoftwareMaintenance, SoftwareWithNoMaintenance } from '@core/modals';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { SharedService } from '@shared/shared.service';
import { SubSink } from 'subsink';
import { commonPieChartDataLabelConfig, pieChartLabelCallback, resetLegends } from '@core/util/common.functions';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-software-maintenance',
  templateUrl: './software-maintenance.component.html',
  styleUrls: ['./software-maintenance.component.scss'],
})
export class SoftwareMaintenanceComponent implements OnInit, OnDestroy, AfterViewInit {
  currentScope: string = this.cs.getLocalData(LOCAL_KEYS.SCOPE);
  ProductsWithMaintenance: SoftwareMaintenance;
  alertQualityDbErr: boolean;
  alertQualityNetworkErr: boolean;
  canvas: any;
  overview: Overview;
  ProductsWithNoMaintenance: SoftwareWithNoMaintenance;
  productsWithoutMaintenance: number = 0;
  TotalMaintenanceCost: number = 0;
  ctx: any;
  getProductsDbError: boolean;
  getProductsNetworkError: Boolean;
  totalCostMaintenanceDataFlag: boolean = false;
  productsWithoutMaintenanceFlag: boolean = false;
  productsWithMaintenanceNoDataFlag: boolean = false;
  maintenancePieChart: Chart = null;
  subs: SubSink = new SubSink();
  _loadingMaintenanceData: boolean = true;
  _loadingProductWithoutMaintenance: boolean = true;
  labelList: any;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private cs: CommonService,
    private ss: SharedService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {

    this.translate.use(this.cs.getLocalData(LOCAL_KEYS.LANGUAGE)).subscribe((translations: any) => {
      this.labelList = translations;
    })

    this.subs.add(
      this.ss._emitScopeChange.subscribe(() => {
        this.currentScope = this.cs.getLocalData(LOCAL_KEYS.SCOPE)
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

  private dataInit() {
    // this.productService.fetchDashboardOverviewData(this.currentScope)
    this.getProductsMaintenance();
    this.getProductsWithNoMaintenance();
    this.getTotalMaintenanceCost();
  }

  getProductsMaintenance() {
    this._loadingMaintenanceData = true;
    this.productService.getProductsWithMaintenance(this.currentScope).subscribe(
      (res: SoftwareMaintenance | any) => {
        this._loadingMaintenanceData = false;
        this.ProductsWithMaintenance = res;
        const { product_with_maintenance_percentage, product_without_maintenance_percentage } = res;
        if (
          product_with_maintenance_percentage ||
          product_without_maintenance_percentage
        ) {
          this.generateDeployedPieChart(res);
          this.productsWithMaintenanceNoDataFlag = false;
        } else {
          this.productsWithMaintenanceNoDataFlag = true;
        }
      },
      (err) => {
        this._loadingMaintenanceData = false;
        console.log('Some error occured! Could not get Maintenance products.');
        this.alertQualityNetworkErr = true;
      }
    );
  }

  generateDeployedPieChart(data: SoftwareMaintenance) {
    const productWithMaintenancePercentage =
      data?.product_with_maintenance_percentage;
    const productsWithoutMaintenancePercentage =
      data?.product_without_maintenance_percentage;
    this.canvas = document.getElementById('deployedProductsChart');
    if (this.canvas && !this.maintenancePieChart) {
      this.ctx = this.canvas.getContext('2d');
      this.maintenancePieChart = new Chart(this.ctx, {
        type: 'pie',
        data: {
          labels: [this.labelList?.['COVERED'], this.labelList?.['NON_COVERED']],
          datasets: [
            {
              backgroundColor: [
                '#03658C',
                '#0BC4D9',
                // '#95a5a6',
                // '#9b59b6',
                // '#f1c40f',
                // '#e74c3c',
              ],
              data: [
                Number(productWithMaintenancePercentage.toFixed(2)),
                Number(productsWithoutMaintenancePercentage.toFixed(2)),
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
          responsive: true,
          // display: true,
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

    if (this.maintenancePieChart) {
      this.maintenancePieChart.data.datasets[0].data = [
        Number(productWithMaintenancePercentage.toFixed(2)),
        Number(productsWithoutMaintenancePercentage.toFixed(2))
      ]
      this.maintenancePieChart.data.labels = [this.labelList?.['COVERED'], this.labelList?.['NON_COVERED']]

      resetLegends(this.maintenancePieChart);
      this.maintenancePieChart.update();
    }

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

  getTotalMaintenanceCost() {
    this.subs.add(
      this.productService.overviewDashboardData$.subscribe(
        (res: DashboardOverviewResponse) => {
          console.log('res from the software maintainance', res);
          this.TotalMaintenanceCost = res?.total_maintenance_cost || 0;
          this.totalCostMaintenanceDataFlag = this.TotalMaintenanceCost ? false : true;
        },
        (err) => {
          console.log('Some error occured! Could not get products info.');
          this.getProductsNetworkError = true;
        }
      )
    )
  }

  getProductsWithNoMaintenance() {
    this._loadingProductWithoutMaintenance = true;
    this.productService
      .getProductsWithNoMaintenance(this.currentScope)
      .subscribe(
        (res: SoftwareWithNoMaintenance) => {
        this._loadingProductWithoutMaintenance = false;
          this.ProductsWithNoMaintenance = res;
          this.productsWithoutMaintenance =
            this.ProductsWithNoMaintenance?.total_products;
          if (this.productsWithoutMaintenance !== 0) {
            this.productsWithoutMaintenanceFlag = false;
          } else {
            this.productsWithoutMaintenanceFlag = true;
          }
        },
        (err) => {
          this._loadingProductWithoutMaintenance = false;
          console.log(
            'Some error occured! Could not get product quality info.'
          );
          this.alertQualityDbErr = true;
        }
      );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
