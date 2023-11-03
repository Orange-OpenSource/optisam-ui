import { ChartType } from 'chart.js';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef, QueryList, ViewChildren, HostListener, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChartOptions } from '@core/modals/dashboard.modal';
import { TrueUpProductsComponent } from './true-up-products/true-up-products.component';
import { CommonService, ProductService } from '@core/services';
import { ChartTypeEffective, EditorTrueUpCost, EditorWasteCost, ErrorResponse, TreeMapData, TrueUpDashboardParams, TrueUpDashboardResponse, WasteDashboardParams, WasteDashboardResponse } from '@core/modals';
import { LOCAL_KEYS, TREE_MAP_COLOR_LIST, TREE_MAP_COLOR_RANGE, TREE_MAP_COMMON_DATA_THRESHOLD, TREE_MAP_COMMON_MAX_DATA, customTooltipTreeMap } from '@core/util/constants/constants';
import { SharedService } from '@shared/shared.service';
import { SubSink } from 'subsink';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { WasteProductsComponent } from './waste-products/waste-products.component';
import { ApexOptions } from 'apexcharts';
import { fixMapSpaces } from '@core/util/common.functions';



@Component({
  selector: 'app-effective-license-position-dashboard',
  templateUrl: './effective-license-position-dashboard.component.html',
  styleUrls: ['./effective-license-position-dashboard.component.scss']
})
export class EffectiveLicensePositionDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('treeMapContainer') containers: QueryList<ElementRef>
  trueUpChartOption: Partial<ChartOptions>;
  wasteChartOption: Partial<ChartOptions>;
  trueUpEditorDatalist: EditorTrueUpCost[];
  wasteEditorDatalist: EditorWasteCost[];
  subs: SubSink = new SubSink();
  containerHeight: number = 0;
  containerWidth: number = 0;
  trueUpTotalCost: number;
  wasteTotalCost: number;
  trueUpData: TreeMapData[];
  wasteData: TreeMapData[];
  customTooltip: ApexTooltip = customTooltipTreeMap;
  _loadingTrueUp: boolean = true;
  _loadingWaste: boolean = true;
  loadingChart: number = 0;


  constructor(
    private dialog: MatDialog,
    private ps: ProductService,
    private cs: CommonService,
    private ss: SharedService,
    private cd: ChangeDetectorRef,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'money-deck',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/svgs/money-deck.svg')
    );
  }

  ngOnInit(): void {
    this.getData();
    this.subs.add(
      this.ss._emitScopeChange.subscribe(() => {
        this.getData();
      })
    )
  }

  ngAfterViewInit(): void {
    this.containers.changes.subscribe(() => this.ps.checkMapSizeChange.call(this))
  }

  @HostListener('window:resize') resize(): void {
    this.ps.checkMapSizeChange.call(this);
  }




  resetHeight(margin: number = 0, chartType: ChartTypeEffective = ChartTypeEffective.both) {
    if (this.wasteChartOption && [ChartTypeEffective.wasteChartOption, ChartTypeEffective.both].includes(chartType)) {
      this.wasteChartOption = { ...this.wasteChartOption, chart: { ...this.wasteChartOption?.chart, height: this.containerHeight - 20, width: this.containerWidth + margin } };
    }

    if (this.trueUpChartOption && [ChartTypeEffective.trueUpChartOption, ChartTypeEffective.both].includes(chartType)) {
      this.trueUpChartOption = { ...this.trueUpChartOption, chart: { ...this.trueUpChartOption?.chart, height: this.containerHeight - 20, width: this.containerWidth + margin } };
    }

  }



  private getData(): void {
    this.getTrueUpData();
    this.getWasteData();
  }

  private getTrueUpData(): void {
    this._loadingTrueUp = true;
    const params: TrueUpDashboardParams = {
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE)
    }
    this.ps.getTrueUpDashboardData(params).subscribe((res: TrueUpDashboardResponse) => {
      this._loadingTrueUp = false;
      this.trueUpEditorDatalist = res.editors_true_up_cost;
      this.trueUpTotalCost = res.total_true_up_cost;
      this.trueUpData = this.getTrueUpEditorTreeMapData();
      this.updateTrueUpChartOption(this.trueUpData);

    },
      (e: ErrorResponse) => {
        this._loadingTrueUp = false;
        this.ss.commonPopup({
          title: "ERROR_TITLE",
          singleButton: true,
          buttonText: "OK",
          message: e.message || "TRUE_UP_UNKNOWN_ERROR"
        })
      })
  }

  private getWasteData(): void {
    const params: WasteDashboardParams = {
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE)
    }
    this.ps.getWasteDashboardData(params).subscribe(async (res: WasteDashboardResponse) => {
      this.wasteEditorDatalist = res.editors_waste_up_cost;
      this.wasteTotalCost = res.total_waste_up_cost;
      this.wasteData = await this.getWasteEditorTreeMapData();
      await this.updateWasteChartOption(this.wasteData)

    },
      (e: ErrorResponse) => {
        this.ss.commonPopup({
          title: "ERROR_TITLE",
          singleButton: true,
          buttonText: "OK",
          message: e.message || 'WASTE_UNKNOWN_ERROR'
        })
      })
  }

  getTrueUpEditorTreeMapData(): TreeMapData[] {
    let treeMapData: TreeMapData[] = this.trueUpEditorDatalist.reduce((editorTreeMapData: TreeMapData[], editor: EditorTrueUpCost) => {
      if ((Math.abs(editor.editor_cost) / Math.abs(this.trueUpTotalCost)) * 100 >= TREE_MAP_COMMON_DATA_THRESHOLD) // filtering small data.
        editorTreeMapData.push({ x: editor.editor, y: Math.abs(editor.editor_cost), editor, fillColor: 'blue' });
      return editorTreeMapData;
    }, [])
    treeMapData.sort((a, b) => b.y - a.y);
    // removing data more than the allowed MAX_DATA;
    if (treeMapData.length > TREE_MAP_COMMON_MAX_DATA) treeMapData.length = TREE_MAP_COMMON_MAX_DATA;
    return treeMapData.map((data: TreeMapData, i: number) => {
      data['fillColor'] = TREE_MAP_COLOR_LIST[i];
      return data;
    });
  }

  getWasteEditorTreeMapData(): TreeMapData[] {
    let treeMapData: TreeMapData[] = this.wasteEditorDatalist.reduce((editorTreeMapData: TreeMapData[], editor: EditorWasteCost) => {
      if ((Math.abs(editor.editor_cost) / Math.abs(this.wasteTotalCost)) * 100 >= TREE_MAP_COMMON_DATA_THRESHOLD)
        editorTreeMapData.push({ x: editor.editor, y: Math.abs(editor.editor_cost), editor, fillColor: 'blue' });
      return editorTreeMapData;
    }, []);
    treeMapData.sort((a, b) => b.y - a.y);
    // removing data more than the allowed MAX_DATA;
    if (treeMapData.length > TREE_MAP_COMMON_MAX_DATA) treeMapData.length = TREE_MAP_COMMON_MAX_DATA;
    return treeMapData.map((data: TreeMapData, i: number) => {
      data['fillColor'] = TREE_MAP_COLOR_LIST[i];
      return data;
    });
  }

  updateTrueUpChartOption(data: TreeMapData[], title: string = ''): void {

    this.trueUpChartOption = {
      series: [
        {
          name: title,
          data
        },
      ],
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false,
          useFillColorAsStroke: true,
        },
      },
      chart: {
        width: '100%',
        height: 300,
        parentHeightOffset: 0,
        offsetX: 0,
        type: 'treemap',
        toolbar: {
          show: false,
        },

        events: {
          click: (event, chartContext, config) => {
            if (config.dataPointIndex !== -1) {
              this.showTrueUpProducts(config);
            }
          },
          dataPointMouseEnter: (event, chartContext, config) => {
            event.target.setAttribute('style', 'cursor: pointer')
          },
          mounted: (chart, { config }) => {
            this.ps.checkMapSizeChange.call(this);
            fixMapSpaces.call(this, chart, ChartTypeEffective.trueUpChartOption);
          },


        },
        animations: {
          enabled: false
        }
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

    }
  }

  updateWasteChartOption(data: TreeMapData[], title: string = ''): void {
    this.wasteChartOption = {
      series: [
        {
          name: title,
          data,
        },
      ],
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false,
          useFillColorAsStroke: true,
        },
      },
      chart: {
        width: '100%',
        height: 300,
        parentHeightOffset: 0,
        offsetX: 0,
        type: 'treemap',
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false // Disable animations
        },

        events: {
          click: (event, chartContext, config) => {
            if (config.dataPointIndex !== -1) {
              this.showWasteProducts(config);
            }
          },
          dataPointMouseEnter: (event, chartContext, config) => {
            event.target.setAttribute('style', 'cursor: pointer')
          },
          mounted: (chart, { config }) => {
            this.ps.checkMapSizeChange.call(this);
            fixMapSpaces.call(this, chart, ChartTypeEffective.wasteChartOption)
          },

          updated: (chart, { config }) => {
            this.ps.checkMapSizeChange.call(this);
            fixMapSpaces.call(this, chart, ChartTypeEffective.wasteChartOption)

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
    }

  }


  showTrueUpProducts(config: any): void {
    this.dialog.open(TrueUpProductsComponent, {
      disableClose: true,
      width: '80vw',
      minWidth: "550px",
      height: "60vh",
      minHeight: '450px',
      panelClass: 'true-up-overlay',
      data: { index: config.dataPointIndex, editorList: this.trueUpData }
    })
  }

  showWasteProducts(config: any) {
    this.dialog.open(WasteProductsComponent, {
      disableClose: true,
      width: '80vw',
      minWidth: "550px",
      height: "60vh",
      minHeight: '450px',
      panelClass: 'waste-overlay',
      data: { index: config.dataPointIndex, editorList: this.wasteData }
    })
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
