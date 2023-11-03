import { AfterViewInit, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ErrorResponse, KpiOptions, KpiPieData, PCDashboardOverviewResponse, ProductCatalogOverview } from '@core/modals';
import { CommonService, ProductService } from '@core/services';
import { SharedService } from '@shared/shared.service';
import * as Chart from 'chart.js';
import 'chartjs-plugin-datalabels';
import { CHART_COLORS, DEFAULT_LANGUAGE, DEFAULT_LANGUAGES, LOCAL_KEYS } from '@core/util/constants/constants';
import { commonPieChartDataLabelConfig, pieChartLabelCallback } from '@core/util/common.functions';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';

const SAAS_ID: string = 'pc-location-chart';
const OPEN_SOURCE_ID: string = 'pc-open-source-chart';

@Component({
  selector: 'app-product-catalog-dashboard',
  templateUrl: './product-catalog-dashboard.component.html',
  styleUrls: ['./product-catalog-dashboard.component.scss']
})
export class ProductCatalogDashboardComponent implements OnInit, AfterViewInit {

  editorOptions: KpiOptions = {
    'icon': "my_location",
    'number': 0,
    'metaDescription': '',
    'description': 'TOTAL_EDITOR',
    titleTooltip: "EDITOR_TITLE_INFO"
  };
  productOptions: KpiOptions = {
    'icon': "my_location",
    'number': 0,
    'metaDescription': '',
    'description': 'TOTAL_PRODUCT',
    titleTooltip: "PRODUCT_TITLE_INFO"
  };
  pcSaasChartData: KpiPieData = {
    title: {
      title: "PC_DASHBOARD_LOCATION_TITLE",
      info: "PERCENT_SAAS_INFO"
    },
    isError: false,
    loading: false
  };
  pcOpenSourceChartData: KpiPieData = {
    title: {
      title: "PC_DASHBOARD_LICENSE_TITLE",
      info: "PERCENT_OPEN_SOURCE_INFO"
    },
    isError: false,
    loading: false
  };
  pcOpenSourceChart: Chart;
  pcSaasChart: Chart;
  labelList: any;
  subs: SubSink = new SubSink();

  constructor(
    private ps: ProductService,
    private ss: SharedService,
    private cd: ChangeDetectorRef,
    private cs: CommonService,
    private translate: TranslateService
  ) {

  }

  ngOnInit(): void {
    console.log('product catalog dashboard initiated', this.translate.currentLang)
    this.resetCharts();

    if (this.translate.currentLang) {
      this.translate.use(this.translate.currentLang).subscribe((translations: any) => {
        this.labelList = translations;
      });
    } else {
      this.translate.addLangs(DEFAULT_LANGUAGES);
      const language = this.cs.getLocalData(LOCAL_KEYS.LANGUAGE) || DEFAULT_LANGUAGE;
      this.translate.setDefaultLang(language);
      console.log('language', language)
      this.translate.use(language).subscribe((translations: any) => {
        this.labelList = translations;
        this.getChartData();
      });
    }

    this.subs.add(
      this.translate.onLangChange.subscribe(({ translations }: LangChangeEvent) => {
        this.labelList = translations;
        this.getChartData();
      })
    )

  }

  ngAfterViewInit(): void {
    this.pcOpenSourceChartInit();
    this.pcSaasChartInit();
    this.getChartData();

  }


  private resetCharts(): void {
    const pcOpenSourceEl = document.getElementById(OPEN_SOURCE_ID);
    if (pcOpenSourceEl) pcOpenSourceEl.remove();
    const pcSaasEl = document.getElementById(SAAS_ID);
    if (pcSaasEl) pcSaasEl.remove();
  }

  private getChartData(): void {
    this.pcOpenSourceChartData.loading = true;
    this.pcSaasChartData.loading = true;
    this.ps.getPcDashboardOverview().subscribe((res: PCDashboardOverviewResponse) => {
      if (!this.pcOpenSourceChart) this.pcOpenSourceChartInit();
      if (!this.pcSaasChart) this.pcSaasChartInit();

      this.pcOpenSourceChartData.loading = false;
      this.pcSaasChartData.loading = false;
      this.editorOptions.number = res.total_editor;
      this.productOptions.number = res.total_product;
      const openSource: number = res.total_opensource_product;
      const saas: number = res.total_saas_product;
      this.pcOpenSourceChart.data.datasets[0].data = [openSource, res.total_product - openSource];
      this.pcSaasChart.data.datasets[0].data = [saas, res.total_product - saas];
      this.pcOpenSourceChart.data.labels = [this.labelList?.['OPEN_SOURCE'], this.labelList?.['OTHER']];
      this.pcSaasChart.data.labels = [this.labelList?.['SAAS'], this.labelList?.['OTHER']];
      this.pcOpenSourceChart.update();
      this.pcSaasChart.update();
      this.cd.detectChanges();
    }, (error: ErrorResponse) => {
      this.ss.commonPopup({
        title: 'ERROR_TITLE',
        singleButton: true,
        message: error.message,
        buttonText: 'OK'
      })
    }, () => {
    })
  }


  private pcOpenSourceChartInit(): void {

    const canvas: HTMLCanvasElement = document.getElementById(
      OPEN_SOURCE_ID
    ) as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      this.pcOpenSourceChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [
            'Open Source',
            'Other',
          ],
          datasets: [
            {
              backgroundColor: [
                CHART_COLORS.totalCost,
                CHART_COLORS.expenditure,
              ],
              data: [0, 0],
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
              label: pieChartLabelCallback()
            }
          },
        },
      });
      // get details

    }

  }

  private pcSaasChartInit(): void {
    const canvas: HTMLCanvasElement = document.getElementById(
      SAAS_ID
    ) as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      this.pcSaasChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [
            'SAAS',
            'Other',
          ],
          datasets: [
            {
              backgroundColor: [
                CHART_COLORS.saas,
                CHART_COLORS.onPremise,
              ],
              data: [0, 0],
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
              label: pieChartLabelCallback()
            }
          },
        },
      });
    }
  }
}
