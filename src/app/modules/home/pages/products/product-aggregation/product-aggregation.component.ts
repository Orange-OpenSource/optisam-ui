import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { ProductService } from 'src/app/core/services/product.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { ProductAggregationDetailsComponent } from '../../../dialogs/product-aggregation-details/product-aggregation-details.component';
import { MoreDetailsComponent } from '../../../dialogs/product-details/more-details.component';

@Component({
  selector: 'app-product-aggregation',
  templateUrl: './product-aggregation.component.html',
  styleUrls: ['./product-aggregation.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*', minHeight: '*'})),
      transition('expanded => collapsed', animate('200ms ease-out')),
      transition('collapsed => expanded', animate('200ms ease-in'))
    ])
  ]
})
export class ProductAggregationComponent implements OnInit {
  public searchValue: any = {};
  productAggregationData: any;
  searchKey: string;
  swidTag: any;
  length ;
  pageSize = 10;
  sort_order: any;
  sort_by: any;
  selected: any;
  page_size: any;
  pageEvent: any;
  current_page_num: any;
  filteringOrder: any;


  displayedColumns: string[] = ['swidTag', 'aggregateName', 'editor' , 'total_cost', 'num_applications', 'num_equipments'];
  expandDisplayedColumns: string[] = ['swidTag', 'name', 'editor' , 'totalCost', 'numOfApplications', 'numofEquipments'];
  sortColumn: string[] = ['aggregateName', 'editor' , 'total_cost', 'num_applications', 'num_equipments'];
  tableKeyLabelMap: any = {
      'swidTag':  'SwidTag',
      'name': 'Product Name',
      'editor': 'Editor',
      'version': 'Release',
      'total_cost': 'Total cost(€)',
      'totalCost': 'Total cost(€)',
      'numOfApplications': 'Number of applications',
      'numofEquipments': 'Number of equipment',
      'num_applications': 'Number of applications',
      'num_equipments': 'Number of equipment',
      'aggregateName': 'Aggregation Name'
    };
  _loading: Boolean;

  advanceSearchModel: any = {
    title: 'Search by Aggregation Name',
    primary: 'search_params.name.filteringkey',
    other: [
      {key: 'search_params.swidTag.filteringkey', label: 'SWIDtag'},
      {key: 'search_params.name.filteringkey', label: 'Aggregation name'},
      {key: 'search_params.editor.filteringkey', label: 'Editor name'}
    ]
  };
  searchFields: any = {};
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  expandedRow: any;
  searchQuery: string;
  sortQuery: string;

  constructor(
    private productservice: ProductService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.current_page_num = 1;
    this.page_size = 10;
   }

  ngOnInit() {
    this.getProductAggregationData();
  }

  getProductAggregationData() {
    this._loading = true;
    let query = '?page_num=' + this.current_page_num + '&page_size=' + this.page_size;
    query += (this.searchQuery ? this.searchQuery : '');
    query += (this.sortQuery ? this.sortQuery : '');
    this.productservice.getAggregationProducts(query).subscribe(
      (res: any) => {
        this.productAggregationData = new MatTableDataSource(res.aggregations);
        this.productAggregationData.sort = this.sort;
        this.length = res.totalRecords;
        this._loading = false;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
        this._loading = false;
      });
  }

  getPaginatorData(ev) {
    // console.log('event-pagination', ev);
    this.page_size = ev.pageSize;
    this.current_page_num = ev.pageIndex + 1;
    this.getProductAggregationData();
  }

  sortData(ev) {
    // console.log('event-sorting', ev);
    if (!ev.direction) {
      return false;
    }
    this.sortQuery = '&sorto_order=' + ev.direction.toUpperCase() + '&srt_by=';
    switch (ev.active) {
      case 'aggregateName':
        this.sortQuery += 'NAME';
        break;

      case 'editor':
      case 'total_cost':
      case 'num_applications':
      case 'num_equipments':
        this.sortQuery += ev.active.toUpperCase();
        break;

      default:
        break;
    }
    this.getProductAggregationData();
  }

  openProductDetailsDialog(value, name): void {
    const dialogRef = this.dialog.open(MoreDetailsComponent, {
      width: '850px',
      data: {
          datakey : value,
          dataName : name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openAggregationDetailsDialog(aggregation: any): void {
    const dialogRef = this.dialog.open(ProductAggregationDetailsComponent, {
      width: '850px',
      data: {
        productName : aggregation.product_name,
        aggregationName : aggregation.name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getSwidTags(products: any[]) {
    return products.map(d => d.swidTag).join(', ');
  }

  productApl(swidTag, prodName) {
    localStorage.setItem('prodName', prodName);
    localStorage.setItem('swidTag', swidTag);
    this.router.navigate(['/optisam/pr/products', swidTag]);
  }
  productEqui(swidTag, prodName) {
    localStorage.setItem('prodName', prodName);
    localStorage.setItem('swidTag', swidTag);
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
      this.searchQuery += '&' + key + '=' + this.searchFields[key];
    });
    this.getProductAggregationData();
  }

  advSearchTrigger(event) {
    // console.log('trigger event => ', event);
    this.searchFields = event;
    this.applyFilter();
  }

}
