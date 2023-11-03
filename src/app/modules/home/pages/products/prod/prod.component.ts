import { CommonService } from '@core/services';
import { ProductService } from 'src/app/core/services/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MoreDetailsComponent } from '../../../dialogs/product-details/more-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  AdvanceSearchModel,
  ConcurrentUserListResponse,
  ConcurrentUsersExportParams,
  ErrorResponse,
  NominativeUsersExportParams,
  Product,
  ProductLocation,
  ProductType,
  Products,
} from '@core/modals';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ViewProductCatalogProductDialogComponent } from '@home/pages/product-catalogue/products/product-list/view-product-catalog-product-dialog/view-product-catalog-product-dialog.component';
import { ViewProductsComponent } from './view-products/view-products.component';
import { ProductUserType, LOCAL_KEYS } from '@core/util/constants/constants';

@Component({
  selector: 'app-prod',
  templateUrl: './prod.component.html',
  styleUrls: ['./prod.component.scss'],
})
export class ProdComponent implements OnInit {
  public searchValue: any = {};

  MyDataSource: any;
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
  dialogRef: any;

  displayedColumns: string[] = [
    'name',
    'version',
    'editor',
    'location',
    // 'category',
    'totalCost',
    'numofUsers',
    'numOfApplications',
    'numofEquipments',
  ];
  _loading: Boolean;

  advanceSearchModel: AdvanceSearchModel = {
    title: 'Search by Product Name',
    primary: 'name',
    other: [
      { key: 'name', label: 'Product name' },
      { key: 'editor', label: 'Editor name' },
      {
        key: 'location',
        label: 'Location',
        type: 'select',
        selection: [
          { key: 'On Premise', value: ProductLocation.ON_PREMISE },
          { key: 'SAAS', value: ProductLocation.SAAS },
        ],
      },
    ],
  };
  searchFields: any = {};
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private router: Router,
    private cd: CommonService
  ) {
    this._loading = true;
    this.current_page_num = 1;
    const state = {}; //window.history.state || {};
    if (
      state['swidTag'] != undefined ||
      state['name'] != undefined ||
      state['editor'] != undefined
    ) {
      this.searchFields = state;
      this.applyFilter();
    } else {
      this.RenderDataTable();
    }
  }
  ngOnInit() { }

  get productUserType(): string[] {
    return Object.values(ProductUserType);
  }

  get onPremise(): ProductLocation {
    return ProductLocation.ON_PREMISE;
  }

  get saas(): ProductLocation {
    return ProductLocation.SAAS;
  }

  openDialog(value, name): void {
    console.log(value, name);
    this.dialogRef = this.dialog.open(MoreDetailsComponent, {
      width: '1300px',
      disableClose: true,
      data: {
        datakey: value,
        dataName: name,
      },
    });

    this.dialogRef.afterClosed().subscribe((result) => { });
  }

  openUserDetails(product: Product): void {
    this.dialog.open(UserDetailsComponent, {
      disableClose: true,
      width: '95vw',
      panelClass: 'full-width-dialog',
      data: { productType: ProductType.INDIVIDUAL, product },
    });
  }
  openEditorDialog(data: any) {
    this.dialogRef = this.dialog.open(ViewProductsComponent, {
      width: '1300px',
      disableClose: true,
      data: data,
    });
    this.dialogRef.afterClosed().subscribe((result) => { });
  }

  RenderDataTable() {
    this.productService.getProducts(this.pageSize, 1).subscribe(
      (res: any) => {
        this.MyDataSource = new MatTableDataSource(res.products);
        this.MyDataSource.sort = this.sort;
        this.length = res.totalRecords;
        this._loading = false;
      },
      (error) => {
        console.log('There was an error while retrieving Posts !!!' + error);
        this._loading = false;
      }
    );
  }
  getPaginatorData(event) {
    this._loading = true;
    this.MyDataSource = null;
    const page_num = event.pageIndex;
    this.current_page_num = page_num + 1;
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.sort_order = localStorage.getItem('product_direction');
    this.sort_by = localStorage.getItem('product_active');
    if (this.sort_by === '' || this.sort_by === null) {
      this.sort_by = 'name';
    }
    if (this.sort_order === '' || this.sort_order === null) {
      this.sort_order = 'asc';
    }
    this.productService
      .filteredData(
        page_num + 1,
        this.pageSize,
        this.sort_by,
        this.sort_order,
        this.searchFields.swidTag?.trim(),
        this.searchFields.name?.trim(),
        this.searchFields.editor?.trim(),
        this.searchFields.location?.trim()
      )
      .subscribe((res: any) => {
        this.MyDataSource = new MatTableDataSource(res.products);
        this.MyDataSource.sort = this.sort;
        this._loading = false;
      });
  }
  sortData(sort) {
    console.log(sort);
    this._loading = true;
    this.MyDataSource = null;
    localStorage.setItem('product_direction', sort.direction);
    localStorage.setItem('product_active', sort.active);
    this.productService
      .filteredData(
        this.current_page_num,
        this.pageSize,
        sort.active,
        sort.direction,
        this.searchFields.swidTag?.trim(),
        this.searchFields.name?.trim(),
        this.searchFields.editor?.trim(),
        this.searchFields.location?.trim()
      )
      .subscribe(
        (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.products);
          this.MyDataSource.sort = this.sort;
          this._loading = false;
        },
        (error) => {
          console.log('There was an error while retrieving Posts !!!' + error);
          this._loading = false;
        }
      );
  }

  applyFilter() {
    this._loading = true;
    this.MyDataSource = null;
    this.sort_order = localStorage.getItem('product_direction');
    this.sort_by = localStorage.getItem('product_active');
    if (this.sort_by === '' || this.sort_by === null) {
      this.sort_by = 'name';
    }
    if (this.sort_order === '' || this.sort_order === null) {
      this.sort_order = 'asc';
    }
    this.productService
      .filteredData(
        this.current_page_num,
        this.pageSize,
        this.sort_by,
        this.sort_order,
        this.searchFields.swidTag?.trim(),
        this.searchFields.name?.trim(),
        this.searchFields.editor?.trim(),
        this.searchFields.location?.trim()
      )
      .subscribe((res: any) => {
        this.MyDataSource = new MatTableDataSource(res.products);
        this.MyDataSource.sort = this.sort;
        this.length = res.totalRecords;
        this._loading = false;
      });
  }
  productApl(swidTag, prodName) {
    localStorage.setItem('prodName', prodName);
    localStorage.setItem('swidTag', swidTag);
    console.log(JSON.stringify(this.searchFields));
    localStorage.setItem('prodFilter', JSON.stringify(this.searchFields));
    this.router.navigate(['/optisam/pr/products', swidTag]);
  }
  productEqui(swidTag, prodName) {
    localStorage.setItem('prodName', prodName);
    localStorage.setItem('swidTag', swidTag);
    localStorage.setItem('prodFilter', JSON.stringify(this.searchFields));
    this.router.navigate(['/optisam/pr/products/equi', swidTag]);
  }

  advSearchTrigger(event) {
    this.searchFields = event;
    this.current_page_num = 1;
    this.applyFilter();
  }
}
