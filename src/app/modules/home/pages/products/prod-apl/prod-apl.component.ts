import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-prod-apl',
  templateUrl: './prod-apl.component.html',
  styleUrls: ['./prod-apl.component.scss'],
})
export class ProdAplComponent implements OnInit {
  MyDataSource: any;
  searchKey: string;
  length;
  pageSize = 50;
  page_size: any;
  pageEvent: any;
  sort_order: any;
  sort_by: any;
  applicationId: any;
  saveSelectedAppName: string;
  saveSelectedOwner: string;
  current_page_num: any;
  filteringOrder: any;
  ownerPlaceholder: any;
  prodName: any;
  swidTag: any;

  displayedColumns: string[] = [
    'name',
    'num_of_instances',
    'owner',
    'num_of_equipments',
  ];
  _loading: Boolean;

  advanceSearchModel: any = {
    title: 'Search by Application Name',
    primary: 'appName',
    other: [
      { key: 'appName', label: 'Application name' },
      { key: 'owner', label: 'Owner' },
    ],
  };
  searchFields: any = {};
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private productservice: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this._loading = true;
    this.swidTag = this.route.snapshot.paramMap.get('swidTag');
    this.prodName = localStorage.getItem('prodName');
    this.current_page_num = 1;
    this.sort_by = 'name';
    this.sort_order = 'asc';
    const state = window.history.state;
    if (state['appName'] != undefined || state['owner'] != undefined) {
      this.searchFields = state;
      this.applyFilter();
    } else {
      this.RenderDataTable();
    }
  }

  ngOnInit() {}

  RenderDataTable() {
    this.productservice
      .getprodApplications(
        this.swidTag,
        this.pageSize,
        1,
        this.sort_order,
        this.sort_by
      )
      .subscribe(
        (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.applications);
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
    this.productservice
      .getprodApplications(
        this.swidTag,
        this.pageSize,
        page_num + 1,
        this.sort_order,
        this.sort_by
      )
      .subscribe(
        (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.applications);
          this._loading = false;
        },
        (error) => {
          console.log('There was an error while retrieving Posts !!!' + error);
          this._loading = false;
        }
      );
  }
  sortData(sort) {
    this._loading = true;
    this.MyDataSource = null;
    this.sort_order = sort.direction;
    this.sort_by = sort.active;
    const swidTag = this.route.snapshot.paramMap.get('swidTag');
    localStorage.setItem('prodApl_direction', sort.direction);
    localStorage.setItem('prodApl_active', sort.active);
    this.productservice
      .getprodApplications(
        this.swidTag,
        this.pageSize,
        this.current_page_num,
        this.sort_order,
        this.sort_by
      )
      .subscribe(
        (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.applications);
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
    const swidTag = this.route.snapshot.paramMap.get('swidTag');
    this.current_page_num = 1;
    this.productservice
      .prodAplfilteredData(
        swidTag,
        this.current_page_num,
        this.pageSize,
        this.sort_by,
        this.sort_order,
        this.searchFields.appName?.trim(),
        this.searchFields.owner?.trim()
      )
      .subscribe((res: any) => {
        this.MyDataSource = new MatTableDataSource(res.applications);
        this.MyDataSource.sort = this.sort;
        this.length = res.totalRecords;
        this._loading = false;
      });
  }
  clearFilter() {
    this.saveSelectedAppName = undefined;
    this.saveSelectedOwner = undefined;
    this.applyFilter();
  }
  productInstances(app_id, appName) {
    const swidTag = this.route.snapshot.paramMap.get('swidTag');
    localStorage.setItem('appName', appName);
    localStorage.setItem('key', app_id);
    localStorage.setItem('aplFilter', JSON.stringify(this.searchFields));
    this.router.navigate(['/optisam/pr/instances', swidTag, app_id]);
  }

  advSearchTrigger(event) {
    this.searchFields = event;
    this.applyFilter();
  }

  backToProductsPage() {
    const filters = JSON.parse(localStorage.getItem('prodFilter'));
    this.router.navigateByUrl('/optisam/pr/products', {
      state: {
        name: filters['name'],
        swidTag: filters['swidTag'],
        editor: filters['editor'],
      },
    });
  }
}
