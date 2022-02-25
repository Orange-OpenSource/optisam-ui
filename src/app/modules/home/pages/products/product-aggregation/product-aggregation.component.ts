import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Router } from '@angular/router';
import { ProductAggregationDetailsComponent } from '../../../dialogs/product-aggregation-details/product-aggregation-details.component';
import { MoreDetailsComponent } from '../../../dialogs/product-details/more-details.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-product-aggregation',
  templateUrl: './product-aggregation.component.html',
  styleUrls: ['./product-aggregation.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*', minHeight: '*' })),
      transition('expanded => collapsed', animate('200ms ease-out')),
      transition('collapsed => expanded', animate('200ms ease-in')),
    ]),
  ],
})
export class ProductAggregationComponent implements OnInit {
  public searchValue: any = {};
  productAggregationData: any;
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

  displayedColumns: string[] = [
    'swidTag',
    'aggregation_name',
    'editor',
    'total_cost',
    'num_applications',
    'num_equipments',
  ];
  expandDisplayedColumns: string[] = [
    'swidTag',
    'Name',
    'version',
    'editor',
    'totalCost',
    'num_applications',
    'num_equipments',
  ];
  sortColumn: string[] = [
    'aggregation_name',
    'editor',
    'total_cost',
    'num_applications',
    'num_equipments',
  ];
  tableKeyLabelMap: any = {
    swidTag: 'SwidTag',
    // swidtags: 'SwidTag',
    Name: 'Product Name',
    version: 'Version',
    editor: 'Editor',
    total_cost: 'Total cost',
    totalCost: 'Total cost',
    numOfApplications: 'Application Count',
    numofEquipments: 'Equipment Count',
    num_applications: 'Application Count',
    num_equipments: 'Equipment Count',
    aggregation_name: 'Aggregation Name',
  };
  _loading: Boolean;

  advanceSearchModel: any = {
    title: 'Search by Aggregation Name',
    primary: 'name',
    other: [
      { key: 'swidTag', label: 'SWIDtag' },
      { key: 'name', label: 'Aggregation name' },
      { key: 'editor', label: 'Editor name' },
    ],
  };
  searchFields: any = {};
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  expandedRow: any;
  searchQuery: string;
  sortQuery: string;
  aggregationDetails: any;

  constructor(
    private productservice: ProductService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.current_page_num = 1;
    this.page_size = 50;
    const state = window.history.state || {};
    if (
      state['swidTag'] != undefined ||
      state['name'] != undefined ||
      state['editor'] != undefined
    ) {
      this.searchFields = state;
      this.applyFilter();
    } else {
      this.getProductAggregationData();
    }
  }

  ngOnInit() {}

  getProductAggregationData() {
    this._loading = true;
    let query =
      '?page_num=' + this.current_page_num + '&page_size=' + this.page_size;
    query += this.searchQuery ? this.searchQuery : '';
    query += this.sortQuery
      ? this.sortQuery
      : '&sort_order=asc&sort_by=aggregation_name';
    this.productservice.getAggregationProducts(query).subscribe(
      (res: any) => {
        this.productAggregationData = new MatTableDataSource(res.aggregations);
        this.productAggregationData.sort = this.sort;
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
    this.getProductAggregationData();
  }

  sortData(ev) {
    if (!ev.direction) {
      return false;
    }
    this.sortQuery = '&sort_order=' + ev.direction + '&sort_by=';
    switch (ev.active) {
      case 'aggregation_name':
        this.sortQuery += ev.active;
        break;
      case 'editor':
        this.sortQuery += 'product_editor';
        break;
      case 'total_cost':
        this.sortQuery += 'cost';
        break;
      case 'num_applications':
        this.sortQuery += 'num_of_applications';
        break;
      case 'num_equipments':
        this.sortQuery += 'num_of_equipments';
        break;

      default:
        break;
    }
    this.getProductAggregationData();
  }

  openProductDetailsDialog(value, name): void {
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

  openAggregationDetailsDialog(aggregation: any): void {
    const dialogRef = this.dialog.open(ProductAggregationDetailsComponent, {
      width: '850px',
      autoFocus: false,
      disableClose: true,
      data: {
        productName: aggregation.product_name,
        aggregationName: aggregation.name,
        aggregationID: aggregation.ID,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  aggrAplDetails(swidtags) {
    localStorage.setItem('aggrSwidTags', swidtags);
  }

  prodAggrApplications(aggrName) {
    localStorage.setItem('prodAggrFilter', JSON.stringify(this.searchFields));
    this.router.navigate([
      '/optisam/pr/products/aggregations',
      aggrName,
      'applications',
    ]);
  }

  prodAggrEquipments(aggrName) {
    localStorage.setItem('prodAggrFilter', JSON.stringify(this.searchFields));
    this.router.navigate([
      '/optisam/pr/products/aggregations',
      aggrName,
      'equipments',
    ]);
  }

  productApl(swidTag, prodName) {
    localStorage.setItem('prodName', prodName);
    localStorage.setItem('swidTag', swidTag);
    localStorage.setItem('prodAggrFilter', JSON.stringify(this.searchFields));
    this.router.navigate(['/optisam/pr/products', swidTag]);
  }
  productEqui(swidTag, prodName) {
    localStorage.setItem('prodName', prodName);
    localStorage.setItem('swidTag', swidTag);
    localStorage.setItem('prodAggrFilter', JSON.stringify(this.searchFields));
    this.router.navigate(['/optisam/pr/products/equi', swidTag]);
  }

  applyFilter() {
    this._loading = true;
    this.productAggregationData = null;
    if (this.current_page_num === 0) {
      this.current_page_num = 1;
    }
    this.searchQuery = '';
    this.sortQuery = '';
    Object.keys(this.searchFields).forEach((key) => {
      if (this.searchFields[key]) {
        this.searchQuery +=
          '&search_params.' +
          key +
          '.filteringkey=' +
          this.searchFields[key]?.trim();
      }
    });
    this.getProductAggregationData();
  }

  advSearchTrigger(event) {
    this.searchFields = event;
    this.applyFilter();
  }

  expandAggregation(product) {
    this._loading = true;
    this.aggregationDetails = null;
    this.expandedRow = this.expandedRow === product ? null : product;
    this.productservice.getAggregationProductDetails(product.aggregation_name).subscribe(
      (res) => {
        this.aggregationDetails = res.products;
        this._loading = false;
      },
      (error) => {
        this._loading = false;
        console.log('There was an error while retrieving Products !!!' + error);
      }
    );
  }

  closeAggregation() {
    this.expandedRow = null;
  }
}
