import { Component, OnInit, ViewChild } from '@angular/core';
import {
  trigger,
  style,
  state,
  animate,
  transition,
} from '@angular/animations';
import { MoreDetailsComponent } from '../../../dialogs/product-details/more-details.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from 'src/app/core/services/product.service';
import { ProductAggregationDetailsComponent } from '../../../dialogs/product-aggregation-details/product-aggregation-details.component';

@Component({
  selector: 'app-acquired-rights-aggregation',
  templateUrl: './acquired-rights-aggregation.component.html',
  styleUrls: ['./acquired-rights-aggregation.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*', minHeight: '*' })),
      transition('expanded => collapsed', animate('200ms ease-out')),
      transition('collapsed => expanded', animate('200ms ease-in')),
    ]),
  ],
})
export class AcquiredRightsAggregationComponent implements OnInit {
  public searchValue: any = {};
  arAggregationData: any;
  searchKey: string;
  swidTag: any;
  length;
  pageSize = 50;
  sort_order: any;
  sort_by: any;
  selected: any;
  page_size: any;
  pageEvent: any;
  current_page_num: any;
  filteringOrder: any;
  productsListByAggrID: any[];

  displayedColumns: string[] = [
    'sku',
    'swidtags',
    'aggregation_name',
    'product_editor',
    'metric_name',
    'num_licenses_acquired',
    'num_licences_maintainance',
    'start_of_maintenance',
    'end_of_maintenance',
    'licence_under_maintenance',
    'avg_unit_price',
    'avg_maintenance_unit_price',
    'total_purchase_cost',
    'total_maintenance_cost',
    'total_cost',
    'comment'


    
  ];
  expandDisplayedColumns: string[] = [
    'SKU',
    'swid_tag',
    'product_name',
    'version',
    'editor',
    'metric',
    'acquired_licenses_number',
    'licenses_under_maintenance_number',
    'start_of_maintenance',
    'end_of_maintenance',
    'licenses_under_maintenance',
    'avg_licenes_unit_price',
    'avg_maintenance_unit_price',
    'total_purchase_cost',
    'total_maintenance_cost',
    'total_cost',
    'comment',

  ];
  sortColumn: string[] = ['aggregation_name', 'product_editor', 'metric_name', 'total_cost'];
  tableKeyLabelMap: any = {
   
    sku: 'SKU',
    SKU: 'SKU',
    swid_tag: 'SwidTag',
    product_name: 'Product name',
    version: 'Version',
    editor:'Editor',
    metric: 'Metric',
    acquired_licenses_number:'Acquired licenses',
    licenses_under_maintenance_number:'Licenses under maintenance number',
    swidtags: 'SwidTags',
    aggregation_name: 'Aggregation Name',
    product_editor: 'Editor',
    metric_name: 'Metric(s)',
    num_licenses_acquired: 'Acquired licenses',
    num_licences_maintainance: 'Licenses under maintenance number',
    start_of_maintenance: 'Start of Maintenance',
    end_of_maintenance: 'End of Maintenance',
    licence_under_maintenance:'License under maintenance',
    licenses_under_maintenance: 'License under maintenance',
    avg_licenes_unit_price:'Avg License unit price',
    avg_unit_price: 'Unit Price',
    avg_maintenance_unit_price: 'Maintenance Price',
    total_purchase_cost: 'Total purchase cost',
    total_maintenance_cost: 'Total maintenance cost',
    total_cost: 'Total cost',
    comment: 'Comment',
  
    
  };
  _loading: Boolean;

  advanceSearchModel: any = {
    title: 'Search by Aggregation Name',
    primary: 'search_params.name.filteringkey',
    other: [
      { key: 'search_params.swidTag.filteringkey', label: 'SWIDtag' },
      { key: 'search_params.SKU.filteringkey', label: 'SKU' },
      { key: 'search_params.editor.filteringkey', label: 'Editor Name' },
      { key: 'search_params.name.filteringkey', label: 'Aggregation Name' },
      { key: 'search_params.metric.filteringkey', label: 'Metric' },
    ],
  };
  searchFields: any = {};
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  expandedRow: any;
  searchQuery: string;
  sortQuery: string;

  constructor(
    private productService: ProductService,
    public dialog: MatDialog
  ) {
    this.current_page_num = 1;
    this.page_size = 50;
  }

  ngOnInit() {
    this.getAcqiredRightsAggregationData();
  }

  getAcqiredRightsAggregationData() {
    this._loading = true;
    let query =
      '?page_num=' + this.current_page_num + '&page_size=' + this.page_size;
    this.sortQuery = this.sortQuery ? this.sortQuery : '&sort_order=asc';
    query += this.sortQuery;
    this.searchQuery = this.searchQuery ? this.searchQuery : '&sort_by=NAME';
    query += this.searchQuery;
    this.productService.getAggregationAcquiredRights(query).subscribe(
      (res: any) => {
        this.arAggregationData = new MatTableDataSource(res.aggregations);
        this.arAggregationData.sort = this.sort;
        this.length = res.totalRecords;
        this._loading = false;
      },
      (error) => {
        console.log('There was an error while retrieving Posts !!!' + error);
        this._loading = false;
      }
    );
  }

  getPaginatorData(ev) {
    this.page_size = ev.pageSize;
    this.current_page_num = ev.pageIndex + 1;
    this.getAcqiredRightsAggregationData();
  }

  sortData(ev) {
    if (!ev.direction) {
      return false;
    }
    this.searchQuery = '';
    this.sortQuery = '';
    this.sortQuery = '&sort_order=' + ev.direction.toLowerCase();
    this.searchQuery = '&sort_by=';
    switch (ev.active) {
      case 'aggregateName':
        this.searchQuery += 'NAME';
        break;

      case 'editor':
      case 'total_cost':
      case 'metric':
        this.searchQuery += ev.active.toUpperCase();
        break;

      default:
        break;
    }
    this.getAcqiredRightsAggregationData();
  }

  getJoinedString(arr: any[], key: string, joinString: string) {
    return arr.map((d) => d[key]).join(joinString);
  }

  applyFilter() {
    this._loading = true;
    this.arAggregationData = null;
    if (this.current_page_num === 0) {
      this.current_page_num = 1;
    }
    this.searchQuery = '';
    Object.keys(this.searchFields).forEach((key) => {
      if (this.searchFields[key]) {
        this.searchQuery += '&' + key + '=' + this.searchFields[key].trim();
      }
    });
    this.getAcqiredRightsAggregationData();
  }

  advSearchTrigger(event) {
    this.searchFields = event;
    this.applyFilter();
  }

  getProductDetails(aggrights) {
    this._loading = true;
    this.productService.getProductsByAggrID(aggrights.aggregation_name).subscribe(
      (res) => {
        this.productsListByAggrID = res.acqRights;
        this._loading = false;
      },
      (err) => {
        console.log('Products could not be fetched!');
        this._loading = false;
      }
    );
  }

  openAggregationDetailsDialog(aggregation: any): void {
    const dialogRef = this.dialog.open(ProductAggregationDetailsComponent, {
      width: '850px',
      autoFocus: false,
      disableClose: true,
      data: {
        productName: aggregation.product_names,
        aggregationName: aggregation.aggregation_name,
        aggregationID: aggregation.ID,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  openDialog(value, name): void {
    const dialogRef = this.dialog.open(MoreDetailsComponent, {
      width: '850px',
      disableClose: true,
      data: {
        datakey: value,
        dataName: name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
