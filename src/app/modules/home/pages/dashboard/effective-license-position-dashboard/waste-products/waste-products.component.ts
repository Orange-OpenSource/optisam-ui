import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, AfterViewChecked } from '@angular/core';
import { EditorWasteCost, ProductWasteCost, TreeMapData } from '@core/modals';
import { TREE_MAP_COLOR_LIST, TREE_MAP_COMMON_DATA_THRESHOLD, TREE_MAP_COMMON_MAX_DATA, customTooltipTreeMap } from '@core/util/constants/constants';

@Component({
  selector: 'app-waste-products',
  templateUrl: './waste-products.component.html',
  styleUrls: ['./waste-products.component.scss']
})
export class WasteProductsComponent implements OnInit, AfterViewChecked {
  productList: TreeMapData[] = [];
  chartOption: any;
  editor: EditorWasteCost;
  dialogContainer: any;
  dialogContainerHeight: number = null;
  customTooltip: ApexTooltip = customTooltipTreeMap;

  constructor(@Inject(MAT_DIALOG_DATA) private data: { index: number; editorList: TreeMapData[] }) { }

  ngOnInit(): void {
    console.log('data', this.data)
    this.chartInit();
  }

  ngAfterViewChecked(): void {
    this.dialogContainer = document.querySelector('.waste-overlay .mat-dialog-container .mat-dialog-content')
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

    this.productList = (this.editor?.products_waste_up_cost || []).reduce((treeMapData: TreeMapData[], productData: ProductWasteCost) => {
      if ((Math.abs(productData.product_cost) / Math.abs(this.editor.editor_cost)) * 100 >= TREE_MAP_COMMON_DATA_THRESHOLD)
        treeMapData.push({
          x: productData.aggregation_name || productData.product,
          y: productData.product_cost,
          fillColor: 'blue'
        })
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
          colorScale: {
            ranges: [
              { from: 0, to: 5, color: '#3B93A5' },
              { from: 6, to: 10, color: '#F7B844' },
              { from: 11, to: 15, color: '#DAA89B' },
              { from: 16, to: 20, color: '#9C8CB9' },
              { from: 21, to: 25, color: '#616247' },
              { from: 26, to: 30, color: '#F7E967' },
              { from: 31, to: 35, color: '#FF5733' },
              { from: 36, to: 40, color: '#00FFFF' },
              { from: 41, to: 45, color: '#FFC300' },
              { from: 46, to: 50, color: '#581845' },
              { from: 51, to: 55, color: '#900C3F' },
              { from: 56, to: 60, color: '#FF5733' },
              { from: 61, to: 65, color: '#00FFFF' },
              { from: 66, to: 70, color: '#FFC300' },
              { from: 71, to: 75, color: '#581845' },
              { from: 76, to: 80, color: '#900C3F' },
              { from: 81, to: 85, color: '#F7E967' },
              { from: 86, to: 90, color: '#FF5733' },
              { from: 91, to: 95, color: '#00FFFF' },
              { from: 96, to: 100, color: '#FFC300' },
            ],
          },
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
