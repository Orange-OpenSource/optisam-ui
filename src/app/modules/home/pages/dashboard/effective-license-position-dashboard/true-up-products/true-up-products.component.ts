import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, AfterViewChecked } from '@angular/core';
import { EditorTrueUpCost, ProductTrueUpCost, TreeMapData } from '@core/modals';
import { TREE_MAP_COLOR_LIST, TREE_MAP_COMMON_DATA_THRESHOLD, TREE_MAP_COMMON_MAX_DATA, customTooltipTreeMap } from '@core/util/constants/constants';

@Component({
  selector: 'app-true-up-products',
  templateUrl: './true-up-products.component.html',
  styleUrls: ['./true-up-products.component.scss']
})
export class TrueUpProductsComponent implements OnInit, AfterViewChecked {
  productList: TreeMapData[] = [];
  chartOption: any;
  editor: EditorTrueUpCost;
  dialogContainer: any;
  dialogContainerHeight: number = null;
  customTooltip: ApexTooltip = customTooltipTreeMap;

  constructor(@Inject(MAT_DIALOG_DATA) private data: { index: number; editorList: TreeMapData[] }) { }

  ngOnInit(): void {
    this.chartInit();
  }

  ngAfterViewChecked(): void {
    this.dialogContainer = document.querySelector('.true-up-overlay .mat-dialog-container .mat-dialog-content')
    if (this.dialogContainer) {
      const height: number = this.dialogContainer.clientHeight;
      if (this.dialogContainerHeight !== height) {
        this.chartOption = { ...this.chartOption, chart: { ...this.chartOption.chart, height: height - 20, width: '100%' } }
        this.dialogContainerHeight = height;

      }
    }
  }

  private getProductList(): void {
    const { index, editorList } = this.data;
    this.editor = editorList
      ?.find((editor: TreeMapData, i: number) => i === index).editor;

    this.productList = (this.editor?.products_true_up_cost || []).reduce((treeMapData: TreeMapData[], productData: ProductTrueUpCost) => {
      if ((Math.abs(productData.product_cost) / Math.abs(this.editor.editor_cost)) * 100 >= TREE_MAP_COMMON_DATA_THRESHOLD)
        treeMapData.push({
          x: productData.aggregation_name || productData.product,
          y: Math.abs(productData.product_cost),
          fillColor: 'blue'
        });
      return treeMapData;
    }, []);
    this.productList.sort((a, b) => b.y - a.y);
    // removing data more than the allowed MAX_DATA;
    if (this.productList.length > TREE_MAP_COMMON_MAX_DATA) this.productList.length = TREE_MAP_COMMON_MAX_DATA;
    this.productList = this.productList.map((data: TreeMapData, i: number) => {
      data.fillColor = TREE_MAP_COLOR_LIST[i];
      return data;
    })
  }

  private chartInit(): void {
    this.getProductList();
    this.updateChart(this.productList);
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
          click: (event, chartContext, config) => {
            // console.log({ event, chartContext, config })
            // if (config.dataPointIndex !== -1) {
            //   this.showTrueUpProducts(config);
            // }
          },

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
