import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TreeMapData, EditorTrueUpCost, ProductTrueUpCost, ErrorResponse, SoftwareExpenditureProduct, SoftwareExpenditureByProductParams, EditorProductExpensesByScope, EditorExpensesByScope } from '@core/modals';
import { CommonService, ProductService } from '@core/services';
import { LOCAL_KEYS, TREE_MAP_COLOR_LIST, TREE_MAP_COLOR_RANGE, TREE_MAP_COMMON_DATA_THRESHOLD, TREE_MAP_COMMON_MAX_DATA, customTooltipTreeMap } from '@core/util/constants/constants';
import { SharedService } from '@shared/shared.service';

@Component({
  selector: 'app-software-expenditure-products',
  templateUrl: './software-expenditure-products.component.html',
  styleUrls: ['./software-expenditure-products.component.scss']
})
export class SoftwareExpenditureProductsComponent implements OnInit {
  productList: TreeMapData[] = [];
  chartOption: any;
  editor: EditorTrueUpCost;
  dialogContainer: any;
  dialogContainerHeight: number = null;
  customTooltip: ApexTooltip = customTooltipTreeMap;

  constructor(
    private ps: ProductService,
    @Inject(MAT_DIALOG_DATA) private data: { editor: EditorExpensesByScope; withMaintenance: boolean; },
    private ss: SharedService,
    private cs: CommonService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer

  ) {
    this.matIconRegistry.addSvgIcon(
      'money-deck',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/svgs/money-deck.svg')
    );

  }

  ngOnInit(): void {
    this.getProductList();
  }



  ngAfterViewChecked(): void {
    this.dialogContainer = document.querySelector('.soft-exp-overlay .mat-dialog-container .mat-dialog-content')
    if (this.dialogContainer) {
      const height: number = this.dialogContainer.clientHeight;
      if (this.dialogContainerHeight !== height) {
        if (this.chartOption)
          this.chartOption = { ...this.chartOption, chart: { ...this.chartOption?.chart, height: height - 20, width: '100%' } };
        this.dialogContainerHeight = height;

      }
    }
  }

  get currentEditorTotal(): number {
    return this.data?.withMaintenance
      ? (this.data?.editor?.total_cost || 0)
      : (this.data?.editor?.total_purchase_cost || 0);
  }

  get editorName(): string {
    return this.data?.editor?.editor_name;
  }

  private getProductList(): void {
    const params: SoftwareExpenditureByProductParams = {
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      editor: this.data?.editor?.editor_name
    }
    this.ps.getUsageCostByProduct(params).subscribe((res: SoftwareExpenditureProduct) => {
      this.productList = res.editorProductExpensesByScope.reduce((productList: TreeMapData[], product: EditorProductExpensesByScope) => {
        const cost = this.data?.withMaintenance ? product.total_cost : product.total_cost - product.total_maintenance_cost
        if ((Math.abs(cost) / Math.abs(this.currentEditorTotal)) * 100 >= TREE_MAP_COMMON_DATA_THRESHOLD)
          productList.push({
            x: (product?.name || ''),
            y: this.data?.withMaintenance
              ? (product?.total_cost || 0)
              : (product?.total_purchase_cost || 0),
            fillColor: 'blue'
          });
        return productList;
      }, []);
      this.productList.sort((a, b) => b.y - a.y);
      // removing data more than the allowed MAX_DATA;
      if (this.productList.length > TREE_MAP_COMMON_MAX_DATA) this.productList.length = TREE_MAP_COMMON_MAX_DATA;
      this.productList = this.productList.map((data: TreeMapData, i: number) => {
        data.fillColor = TREE_MAP_COLOR_LIST[i]
        return data;
      })
      this.updateChart(this.productList);

    }, (error: ErrorResponse) => {
      this.ss.commonPopup({
        title: "ERROR_TITLE",
        singleButton: true,
        buttonText: 'OK',
        message: error.message
      })
    })
  }

  updateChart(data: TreeMapData[], title: string = '') {
    this.chartOption = {
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
        },
      },
      chart: {
        width: '100%',
        height: 250,
        parentHeightOffset: 0,
        type: 'treemap',
        toolbar: {
          show: false,
        },

        events: {
          // click: (event, chartContext, config) => {
          // },
          dataPointMouseEnter: (event, chartContext, config) => {
            event.target.setAttribute('style', 'cursor: pointer')
          },
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

}
