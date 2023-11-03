import { Component, OnInit, OnDestroy, AfterViewChecked, ChangeDetectorRef, ElementRef, QueryList, ViewChildren, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChartOptions } from '@core/modals/dashboard.modal';
import { CommonService, ProductService } from '@core/services';
import { ChartTypeSoft, EditorExpensesByScope, EditorTrueUpCost, ErrorResponse, SoftwareExpenditure, TreeMapData, TrueUpDashboardParams, TrueUpDashboardResponse } from '@core/modals';
import { LOCAL_KEYS, TREE_MAP_COLOR_LIST, TREE_MAP_COLOR_RANGE, TREE_MAP_COMMON_DATA_THRESHOLD, TREE_MAP_COMMON_MAX_DATA, customTooltipTreeMap } from '@core/util/constants/constants';
import { SharedService } from '@shared/shared.service';
import { SubSink } from 'subsink';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TrueUpProductsComponent } from '../effective-license-position-dashboard/true-up-products/true-up-products.component';
import { SoftwareExpenditureProductsComponent } from './software-expenditure-products/software-expenditure-products.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { UsageCostProductsComponent } from './usage-cost-products/usage-cost-products.component';
import { EffectiveLicensePositionDashboardComponent } from '../effective-license-position-dashboard/effective-license-position-dashboard.component';
import { fixMapSpaces } from '@core/util/common.functions';


interface SoftExpTotals { withMaintenance: number; withoutMaintenance: number; }

@Component({
  selector: 'app-software-expenditure',
  templateUrl: './software-expenditure.component.html',
  styleUrls: ['./software-expenditure.component.scss'],
})
export class SoftwareExpenditureComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('treeMapContainer') containers: QueryList<ElementRef>
  @ViewChild(EffectiveLicensePositionDashboardComponent) effectiveLicensePosition: EffectiveLicensePositionDashboardComponent;
  usageCostChartOption: Partial<ChartOptions>;
  softExpChartOption: Partial<ChartOptions>;
  softExpEditorDatalist: EditorExpensesByScope[];
  subs: SubSink = new SubSink();
  chartContainer: HTMLDivElement;
  containerHeight: number = 0;
  containerWidth: number = 0;
  totalUsageCost: number;
  softwareExpenditureTotals: SoftExpTotals = null;
  isMaintenanceChecked: boolean = false;
  softExpData: TreeMapData[];
  usageCostData: TreeMapData[];
  customTooltip: ApexTooltip = customTooltipTreeMap;
  _loadingUsage: boolean = true;
  nullValues: any[] = [null, NaN];


  constructor(
    private dialog: MatDialog,
    private ps: ProductService,
    private cs: CommonService,
    private ss: SharedService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private cd: ChangeDetectorRef
  ) {

    this.matIconRegistry.addSvgIcon(
      'money-deck',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/svgs/money-deck.svg')
    );
  }
  ngAfterViewInit(): void {
    this.getData();
    this.containers.changes.subscribe(() => this.ps.checkMapSizeChange.call(this))
  }

  @HostListener('window:resize') resize(): void {
    this.ps.checkMapSizeChange.call(this);
  }

  resetHeight(margin: number = 0, chartType: ChartTypeSoft = ChartTypeSoft.both) {
    if (this.softExpChartOption && [ChartTypeSoft.both, ChartTypeSoft.softExpChartOption].includes(chartType))
      this.softExpChartOption = { ...this.softExpChartOption, chart: { ...this.softExpChartOption?.chart, height: this.containerHeight - 20, width: this.containerWidth + margin } };
    if (this.usageCostChartOption && [ChartTypeSoft.both, ChartTypeSoft.usageCostChartOption].includes(chartType))
      this.usageCostChartOption = { ...this.usageCostChartOption, chart: { ...this.usageCostChartOption?.chart, height: this.containerHeight - 20, width: this.containerWidth + margin } };
  }

  ngOnInit(): void {

    this.subs.add(
      this.ss._emitScopeChange.subscribe(async () => {
        this.isMaintenanceChecked = false;
        await this.getData();
      })
    )
  }


  private getData(): void {
    this.getSoftExpData();
  }


  get currentTotalSoftExp(): number {
    return this.isMaintenanceChecked
      ? this.softwareExpenditureTotals?.withMaintenance
      : this.softwareExpenditureTotals?.withoutMaintenance
  }

  private getSoftExpData(): void {
    this._loadingUsage = true;
    const scope: string = this.cs.getLocalData(LOCAL_KEYS.SCOPE)
    this.ps.getSoftwareExpenditureByEditor(scope).subscribe((res: SoftwareExpenditure) => {
      this._loadingUsage = false;
      this.softExpEditorDatalist = res.editorExpensesByScope;
      this.totalUsageCost = this.softExpEditorDatalist.reduce((sum: number, editor: EditorExpensesByScope) => sum + editor.total_computed_cost, 0)
      this.softwareExpenditureTotals = this.softExpEditorDatalist
        .reduce((totals: SoftExpTotals, editor: EditorExpensesByScope) => {
          totals = {
            withMaintenance: editor.total_cost + totals.withMaintenance,
            withoutMaintenance: editor.total_purchase_cost + totals.withoutMaintenance
          }
          return totals;
        }
        , { withMaintenance: 0, withoutMaintenance: 0 });
        this.currentTotalSoftExp;
        this.updateUsageCost();
        this.updateSoftExp();
        
      },
      (e: ErrorResponse) => {
        this._loadingUsage = false;
        this.ss.commonPopup({
          title: "ERROR_TITLE",
          singleButton: true,
          buttonText: "OK",
          message: e.message || "USAGE_EXPENDITURE_UNKNOWN_ERROR"
        })
      })
  }
  updateUsageCost() {
    this.usageCostData = this.getUsageCostEditorTreeMapData();
    this.updateUsageCostChartOption(this.usageCostData);

  }
  updateSoftExp(): void {
    this.softExpData = this.getSoftExpEditorTreeMapData();
    this.updateSoftExpChartOption(this.softExpData)
  }

  private getUsageCostEditorTreeMapData(): TreeMapData[] {
    let treeMapData: TreeMapData[] = this.softExpEditorDatalist.reduce((editorTreeMapData: TreeMapData[], editor: EditorExpensesByScope) => {
      if ((Math.abs(editor.total_computed_cost) / Math.abs(this.totalUsageCost)) * 100 >= TREE_MAP_COMMON_DATA_THRESHOLD) // filtering small data.
        editorTreeMapData.push({ x: editor.editor_name, y: editor.total_computed_cost, editor, fillColor: 'blue' });
      return editorTreeMapData;
    }, [])
    treeMapData.sort((a, b) => b.y - a.y);
    // removing data more than the allowed MAX_DATA;
    if (treeMapData.length > TREE_MAP_COMMON_MAX_DATA) treeMapData.length = TREE_MAP_COMMON_MAX_DATA;
    return treeMapData.map((data: TreeMapData, i: number) => {
      data.fillColor = TREE_MAP_COLOR_LIST[i];
      return data;
    });
  }
  getSoftExpEditorTreeMapData(): TreeMapData[] {
    let treeMapData: TreeMapData[] = this.softExpEditorDatalist.reduce((editorTreeMapData: TreeMapData[], editor: EditorExpensesByScope) => {
      const cost: number = this.isMaintenanceChecked
        ? editor.total_cost
        : editor.total_cost - editor.total_maintenance_cost;
      const TOTAL: number = this.isMaintenanceChecked ? this.softwareExpenditureTotals.withMaintenance : this.softwareExpenditureTotals.withoutMaintenance;
      if ((Math.abs(cost) / Math.abs(TOTAL)) * 100 >= TREE_MAP_COMMON_DATA_THRESHOLD) // filtering small data.
        editorTreeMapData.push({
          x: editor.editor_name,
          y: cost,
          editor,
          fillColor: 'blue'
        });
      return editorTreeMapData;
    }, []);

    treeMapData.sort((a, b) => b.y - a.y);
    // removing data more than the allowed MAX_DATA;
    if (treeMapData.length > TREE_MAP_COMMON_MAX_DATA) treeMapData.length = TREE_MAP_COMMON_MAX_DATA;

    return treeMapData.map((data: TreeMapData, i: number) => {
      data.fillColor = TREE_MAP_COLOR_LIST[i];
      return data;
    });
  }

  updateUsageCostChartOption(data: TreeMapData[], title: string = ''): void {
    this.usageCostChartOption = {
      series: [
        {
          name: title,
          data: data,
        },
      ],
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false,
          useFillColorAsStroke: true,
          colorScale: {
            ranges: TREE_MAP_COLOR_RANGE,
          },
        },
      },
      chart: {
        width: '100%',
        height: 300,
        parentHeightOffset: 0,
        type: 'treemap',
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false
        },

        events: {
          click: (event, chartContext, config) => {
            if (config.dataPointIndex !== -1) {
              this.showUsageCostProducts(config);
            }
          },
          dataPointMouseEnter: (event, chartContext, config) => {
            event.target.setAttribute('style', 'cursor: pointer')
          },
          mounted: (chart, config) => {
            this.ps.checkMapSizeChange.call(this);
            fixMapSpaces.call(this, chart, ChartTypeSoft.usageCostChartOption);
          },

          // updated: (chart, { config }) => {
          //   this.ps.checkMapSizeChange.call(this);
          //   fixMapSpaces.call(this, chart, ChartTypeSoft.usageCostChartOption)
          // }
        },
      },
      title: {
        text: title,
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '14px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          colors: ['#000'], // Change color to black
        },
        offsetX: 0, // Move the heading 10 pixels to the right
        offsetY: 0, // Move the heading 10 pixels up (negative value for moving up)
      },
    };
  }

  updateSoftExpChartOption(data: TreeMapData[], title: string = ''): void {
    this.softExpChartOption = {
      series: [
        {
          name: title,
          data: data,
        },
      ],
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false,
          useFillColorAsStroke: true,
          colorScale: {
            ranges: TREE_MAP_COLOR_RANGE,
          },
        },
      },
      chart: {
        width: '100%',
        height: 300,
        parentHeightOffset: 0,
        type: 'treemap',
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false
        },

        events: {
          click: (event, chartContext, config) => {
            if (config.dataPointIndex !== -1) {
              this.showSoftExpProducts(config);
            }
          },
          dataPointMouseEnter: (event, chartContext, config) => {
            event.target.setAttribute('style', 'cursor: pointer')
          },

          mounted: (chart, { config }) => {
            this.ps.checkMapSizeChange.call(this);
            fixMapSpaces.call(this, chart, ChartTypeSoft.softExpChartOption);
          },

          updated: (chart, { config }) => {
            this.ps.checkMapSizeChange.call(this);
            fixMapSpaces.call(this, chart, ChartTypeSoft.softExpChartOption);
          }
        },
      },
      title: {
        text: title,
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '14px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          colors: ['#000'], // Change color to black
        },
        offsetX: 0, // Move the heading 10 pixels to the right
        offsetY: 0, // Move the heading 10 pixels up (negative value for moving up)
      },
    };
  }


  showUsageCostProducts(config: any): void {
    const editor: TreeMapData = this.usageCostData.find((editor: TreeMapData, index: number) => index === config.dataPointIndex)

    this.dialog.open(UsageCostProductsComponent, {
      disableClose: true,
      width: '80vw',
      minWidth: "550px",
      height: "60vh",
      minHeight: '450px',

      panelClass: 'usage-cost-overlay',
      data: { editor: editor.editor }
    })
  }

  showSoftExpProducts(config: any) {

    const editor: TreeMapData = this.softExpData.find((editor: TreeMapData, index: number) => index === config.dataPointIndex)

    this.dialog.open(SoftwareExpenditureProductsComponent, {
      disableClose: true,
      width: '80vw',
      minWidth: "550px",
      height: "60vh",
      minHeight: '450px',
      panelClass: 'soft-exp-overlay',
      data: { editor: editor.editor, withMaintenance: this.isMaintenanceChecked }
    })
  }

  onMaintenanceChanged(e: MatSlideToggleChange): void {
    this.isMaintenanceChecked = e.checked;
    this._loadingUsage = true;
    setTimeout(() => {
      this._loadingUsage = false;
      this.updateSoftExp();
    }, 300)
  }


  // fixMapSpaces(chart, chartType: ChartTypeSoft): void {

  //   const chartBlock: HTMLDivElement = chart?.el?.closest('.chart-block--map');
  //   if (chartBlock) {
  //     try {
  //       const chartBlockWidth: number = chartBlock.getBoundingClientRect().width;
  //       const errorMargin = 2;
  //       const treeMapSeriesWidth: number = chartBlock.querySelector('.apexcharts-treemap-series')?.getBoundingClientRect().width;
  //       const margin = chartBlockWidth - treeMapSeriesWidth;
  //       if (chartBlockWidth && treeMapSeriesWidth && Math.abs(margin) > errorMargin) {
  //         this.resetHeight(margin, chartType)
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  // }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
