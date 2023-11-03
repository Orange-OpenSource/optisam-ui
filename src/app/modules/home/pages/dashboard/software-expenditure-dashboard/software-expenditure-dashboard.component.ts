import { FrenchNumberPipe } from '@shared/common-pipes/french-number.pipe';
import { ProductService } from 'src/app/core/services/product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { KpiOptions, KpiPieData } from '@core/modals/dashboard.modal';
import * as Chart from 'chart.js';
import 'chartjs-plugin-datalabels';
import { CHART_COLORS, LOCAL_KEYS } from '@core/util/constants/constants';
import { CommonService } from '@core/services';
import {
  DashboardOverviewResponse,
  EntitySoftExpenseResponse,
  ErrorResponse,
  SharedAmount,

} from '@core/modals';
import { SharedService } from '@shared/shared.service';
import { SubSink } from 'subsink';
import { commonPieChartDataLabelConfig, pieChartDataLabelFormatter, pieChartLabelCallback, resetLegends, frenchNumber } from '@core/util/common.functions';
import { LangChangeEvent, TranslateService, TranslationChangeEvent, DefaultLangChangeEvent } from '@ngx-translate/core';


@Component({
  selector: 'app-software-expenditure-dashboard',
  templateUrl: './software-expenditure-dashboard.component.html',
  styleUrls: ['./software-expenditure-dashboard.component.scss'],
  providers: [FrenchNumberPipe]
})
export class SoftwareExpenditureDashboardComponent implements OnInit, OnDestroy {
  isWithMaintenanceOwnedLicense: boolean = false;
  isWithMaintenanceUsedLicense: boolean = false;

  scopeExpenditureOptions: KpiOptions = {
    icon: 'my_location',
    number: 0,
    description: 'ENTITY_EXPENDITURE',
    metaDescription: '',
    titleTooltip: "ENTITY_SOFTWARE_EXPENDITURE_INFO"
  };

  productSpendChart: Chart;
  sharedReceivedChart: Chart;
  ownedLicensesOptionsNumber: number = 0;
  usedLicensesOptionMaintenanceNumber: number = 0;
  ownedLicensesOptionMaintenanceNumber: number = 0;
  usedLicensesOptionsNumber: number = 0;
  subs: SubSink = new SubSink();
  totalExpenditure: number = 0;
  labelList: any;

  get ownedLicensesOptions(): KpiOptions {
    return {
      icon: 'my_location',
      number: this.ownedLicensesOptionsNumber
        + (
          this.isWithMaintenanceOwnedLicense
            ? this.ownedLicensesOptionMaintenanceNumber
            : 0
        ),
      description: 'OWNED_LICENSES',
      metaDescription: this.isWithMaintenanceOwnedLicense
        ? 'WITH_MAINTENANCE'
        : 'WITHOUT_MAINTENANCE',
      showToggle: true,
      titleTooltip: "OWNED_LICENSES_INFO"
    }
  };

  get usedLicensesOptions(): KpiOptions {
    return {
      icon: 'my_location',
      number: this.usedLicensesOptionsNumber
        + (
          this.isWithMaintenanceUsedLicense
            ? this.usedLicensesOptionMaintenanceNumber
            : 0
        ),
      description: 'USED_LICENSES',
      metaDescription: this.isWithMaintenanceUsedLicense
        ? 'WITH_MAINTENANCE'
        : 'WITHOUT_MAINTENANCE',
      showToggle: true,
      titleTooltip: "USED_LICENSES_INFO"
    };
  }

  softwareProductSpendData: KpiPieData = {
    title: {
      title: 'SOFTWARE_PRODUCT_SPEND',
      info: "SOFTWARE_PRODUCT_SPEND_INFO"
    },
    isError: false,
    noData: false,
    loading: true
  };

  sharedReceivedLicensesData: KpiPieData = {
    title: { title: 'SHARED_RECEIVED_LICENSES', info: 'SHARED_RECEIVED_LICENSES_INFO' },
    isError: false,
    noData: false,
    loading: true
  };
  softwareExpenditureError: boolean = false;

  constructor(
    private productService: ProductService,
    private cs: CommonService,
    private ss: SharedService,
    private translate: TranslateService,
    private frenchNumber: FrenchNumberPipe
  ) { }

  ngOnInit(): void {  
    this.translate.use(this.cs.getLocalData(LOCAL_KEYS.LANGUAGE)).subscribe((translations: any) => {
      this.labelList = translations;
    });


    this.subs.add(
      this.ss._emitScopeChange.subscribe(() => {
        this.setChartData();
      })
    )

    this.subs.add(
      this.translate.onLangChange.subscribe(({ translations }: LangChangeEvent) => {
        this.labelList = translations;
        this.setChartData();
      })
    )

  }


  ngAfterViewInit(): void {
    this.setChartData();
  }

  private getSoftwareProductSpendInfo(): void {
    if (!this.productSpendChart) {
      const canvas: HTMLCanvasElement = document.getElementById(
        'software-product-spend-chart'
      ) as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        this.productSpendChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: [
              this.labelList?.['REMAINING_EXPENDITURE'],
              this.labelList?.['COVERED_EXPENDITURE_PERCENT'],
            ],
            datasets: [
              {
                backgroundColor: [
                  CHART_COLORS.totalCost,
                  CHART_COLORS.expenditure,
                ],
                data: [],
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
                label: pieChartLabelCallback()
              }
            }
          },
        });
        // get details

      }
    }
    const scope = this.cs.getLocalData(LOCAL_KEYS.SCOPE);
    this.softwareProductSpendData.noData = false;
    this.softwareProductSpendData.isError = false;
    this.softwareProductSpendData.loading = true;
    this.sharedReceivedLicensesData.loading = true;
    this.productService.getSoftwareExpenditure(scope).subscribe(
      (res: EntitySoftExpenseResponse) => {
        this.softwareProductSpendData.loading = false;
        this.totalExpenditure = res.total_expenditure
        this.scopeExpenditureOptions.number = res.total_expenditure;
        this.softwareProductSpendData.noData = !(res.total_expenditure || res.total_cost);
        const remainingExpenditure = res.total_expenditure - res.total_cost;
        this.productSpendChart.data.datasets[0].data = [
          remainingExpenditure < 0 ? 0 : remainingExpenditure,
          res.total_cost,
        ];
        this.productSpendChart.data.labels = [
          this.labelList?.['REMAINING_EXPENDITURE'],
          this.labelList?.['COVERED_EXPENDITURE_PERCENT'],
        ];

        this.getSharedReceivedLicensesInfo(); // We are calling it here because "totalExpenditure" is need inside.
        resetLegends(this.productSpendChart);
        this.productSpendChart.update();

      },
      (e: ErrorResponse) => {
        this.softwareProductSpendData.loading = false;
        this.softwareProductSpendData.isError = true;
      }
    );
  }

  private getSharedReceivedLicensesInfo(): void {
    if (!this.sharedReceivedChart) {
      const canvas: HTMLCanvasElement = document.getElementById(
        'shared-received-licenses-chart'
      ) as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        this.sharedReceivedChart = new Chart(ctx, {
          type: 'bar',
          data: {

            labels: [
              this.labelList?.['SHARED_LICENSE_COST'],
              this.labelList?.['RECEIVED_LICENSE_COST']
            ],
            datasets: [
              {
                backgroundColor: [
                  CHART_COLORS.sharedLicense,
                  CHART_COLORS.receivedLicense
                ],

                data: [],
              },
            ],
          },
          options: {
            scales: {
              yAxes: [
                {
                  display: true,
                  ticks: {
                    suggestedMin: 0, // minimum will be 0, unless there is a lower value.
                    // OR //
                    beginAtZero: true, // minimum value will be 0..
                  },
                },
              ]
            },
            legend: {
              display: false,
              position: 'bottom',
              align: 'center',
            },
            plugins: {
              datalabels: {
                ...commonPieChartDataLabelConfig(), formatter: (value, context): string => {
                  const data: number[] = (context?.dataset?.data || []) as Array<number>;
                  return String(this.frenchNumber.transform(data[context.dataIndex]));
                }
              }

            },

            responsive: true,
            // display: true,
            tooltips: {
              callbacks: {
                label: (tooltipItem, data): string => {
                  const allData: number[] | Chart.ChartPoint[] = data.datasets[0].data;
                  const index: number = tooltipItem.index;
                  const label: string | string[] = data.labels[index];
                  let value: number = Number((allData[index] as number).toFixed(2));
                  value = Math.floor(value) == value ? Math.floor(value) : value;
                  return `  ${label}: ${value.toLocaleString()}`;
                },
                afterLabel: (tooltipItem, data) => {
                  if (this.totalExpenditure) {
                    const allData: number[] | Chart.ChartPoint[] = data.datasets[0].data;
                    const index: number = tooltipItem.index;
                    let value: number = Number((allData[index] as number))
                    const percent = this.frenchNumber.transform(((value / this.totalExpenditure) * 100));
                    return `\n${percent}% ${this.labelList?.['SHARED_RECEIVED_TOOLTIP_MSG']}`;
                  }
                  return '';
                }
              }
            }
          },
        });

      }
    }
    const scope = this.cs.getLocalData(LOCAL_KEYS.SCOPE);
    this.sharedReceivedLicensesData.noData = false;
    this.sharedReceivedLicensesData.isError = false;

    this.productService.getSharedAmount({ scope }).subscribe(
      (res: SharedAmount) => {
        this.sharedReceivedLicensesData.loading = false;
        let totalExpenditure: number = this.totalExpenditure || 0;
        this.sharedReceivedChart.data.datasets[0].data = [res.total_shared_amount, res.total_recieved_amount];
        this.sharedReceivedLicensesData.noData = !(res.total_shared_amount || res.total_recieved_amount);
        this.sharedReceivedChart.data.labels = [
          this.labelList?.['SHARED_LICENSE_COST'],
          this.labelList?.['RECEIVED_LICENSE_COST']
        ];
        resetLegends(this.sharedReceivedChart);
        this.sharedReceivedChart.update();
      },
      (e: ErrorResponse) => {
        this.sharedReceivedLicensesData.loading = false;
        this.sharedReceivedLicensesData.isError = true;
      }
    );
  }

  private getOwnedLicenseAndUnderUsageInfo(): void {

    this.subs.add(
      this.productService.overviewDashboardData$.subscribe((res: DashboardOverviewResponse) => {
        this.ownedLicensesOptionsNumber = res.total_license_cost - res.total_maintenance_cost;
        this.ownedLicensesOptionMaintenanceNumber = res.total_maintenance_cost || 0;
        this.usedLicensesOptionsNumber = res?.computed_without_maintenance || 0
        this.usedLicensesOptionMaintenanceNumber = (res?.computed_maintenance - res.computed_without_maintenance) || 0;

      })

    )


  }

  setChartData(): void {
    this.productService.fetchDashboardOverviewData(this.cs.getLocalData(LOCAL_KEYS.SCOPE));
    this.getOwnedLicenseAndUnderUsageInfo();
    this.getSoftwareProductSpendInfo();

  }

  ownedLicenseWithMaintenance(status: boolean): void {
    this.isWithMaintenanceOwnedLicense = status;
  }

  usedLicensesWithMaintenance(status: boolean): void {
    this.isWithMaintenanceUsedLicense = status;
  }


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
