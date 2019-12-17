import { ProductService } from 'src/app/core/services/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { MoreDetailsComponent } from '../../../dialogs/product-details/more-details.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-apl-instance',
  templateUrl: './apl-instance.component.html',
  styleUrls: ['./apl-instance.component.scss']
})
export class AplInstanceComponent implements OnInit {
  public searchValue: any = {};

  MyDataSource: any;
  searchKey: string;
  swidTag: any;
  aplName: any;
  page_size: any;
  pageEvent: any;
  length;
  pageSize = 10;
  sort_order: any;
  sort_by: any;
  current_page_num: any;
  prodName: any;
  appName: any;

  displayedColumns: string[] = ['name',  'environment',  'numofProducts' , 'numofEquipments', ];
  _loading: Boolean;
  constructor(private productservice: ProductService, private router: Router, private route: ActivatedRoute) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit() {
    this._loading = true;
    this.current_page_num = 1;
    this.RenderDataTable();
  }
  RenderDataTable() {
    const swidTag = (this.route.snapshot.paramMap.get('swidTag'));
    const app_id = (this.route.snapshot.paramMap.get('app_id'));
    this.prodName = localStorage.getItem('prodName');
    this.appName = localStorage.getItem('appName');
    this.productservice.getprodInstances(swidTag, app_id, 10, 1).subscribe(
      (res: any) => {
        this.MyDataSource = new MatTableDataSource(res.instances);
        this.MyDataSource.sort = this.sort;
        this.length = res.totalRecords;
        this._loading = false;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
        this._loading = false;
      });
  }
  getPaginatorData(event) {
    this._loading = true;
    this.MyDataSource = null;
    const swidTag = (this.route.snapshot.paramMap.get('swidTag'));
    const app_id = (this.route.snapshot.paramMap.get('app_id'));
    const page_num = event.pageIndex;
    this.current_page_num = page_num;
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.sort_order = localStorage.getItem( 'instance_direction');
    this.sort_by = localStorage.getItem( 'instance_active');
    if (this.sort_by === '' || this.sort_by === null) {
      this.sort_by = 'name';
    }
    if (this.sort_order === '' || this.sort_order === null) {
      this.sort_order = 'asc';
    }
    this.productservice.getInstancesSort(swidTag, app_id, page_num + 1, this.pageSize,
      this.sort_by, this.sort_order).subscribe(
        (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.products);
          this.MyDataSource.sort = this.sort;
          this._loading = false;
        }
      );
    }
  sortData(sort) {
    this._loading = true;
    this.MyDataSource = null;
    const swidTag = (this.route.snapshot.paramMap.get('swidTag'));
    // console.log(swidTag);
    const app_id = (this.route.snapshot.paramMap.get('app_id'));
    localStorage.setItem('instance_direction', sort.direction);
    localStorage.setItem('instance_active', sort.active);
    this.productservice.getInstancesSort(swidTag, app_id, this.pageSize, this.current_page_num,
      sort.active, sort.direction).subscribe(
      (res: any) => {
        this.MyDataSource = new MatTableDataSource(res.instances);
        this.MyDataSource.sort = this.sort;
        this._loading = false;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
        this._loading = false;
      });
    }
    gotoApplications() {
      this.swidTag = localStorage.getItem( 'swidTag');
      this.router.navigate(['/optisam/pr/products', this.swidTag]);
      }
}

