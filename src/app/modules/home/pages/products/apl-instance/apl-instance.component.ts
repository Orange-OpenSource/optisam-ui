import { ProductService } from 'src/app/core/services/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-apl-instance',
  templateUrl: './apl-instance.component.html',
  styleUrls: ['./apl-instance.component.scss'],
})
export class AplInstanceComponent implements OnInit {
  public searchValue: any = {};

  MyDataSource: any;
  searchKey: string;
  swidTag: any;
  app_id: any;
  aplName: any;
  page_size: any;
  pageEvent: any;
  length;
  pageSize = 50;
  sort_order: any;
  sort_by: any;
  current_page_num: any;
  prodName: any;
  appName: any;

  displayedColumns: string[] = [
    'instance_id',
    'environment',
    'num_of_products',
    'num_of_equipments',
  ];
  _loading: Boolean;
  constructor(
    private productservice: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  ngOnInit() {
    this._loading = true;
    this.current_page_num = 1;
    this.swidTag = this.route.snapshot.paramMap.get('swidTag');
    this.app_id = this.route.snapshot.paramMap.get('app_id');
    this.RenderDataTable();
  }
  RenderDataTable() {
    this.prodName = localStorage.getItem('prodName');
    this.appName = localStorage.getItem('appName');
    this.productservice
      .getprodInstances(this.swidTag, this.app_id, this.pageSize, 1)
      .subscribe(
        (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.instances);
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
    this.sort_order = localStorage.getItem('instance_direction');
    this.sort_by = localStorage.getItem('instance_active');
    if (this.sort_by === '' || this.sort_by === null) {
      this.sort_by = 'instance_id';
    }
    if (this.sort_order === '' || this.sort_order === null) {
      this.sort_order = 'asc';
    }
    this.productservice
      .getInstancesSort(
        this.swidTag,
        this.app_id,
        this.pageSize,
        page_num + 1,
        this.sort_by,
        this.sort_order
      )
      .subscribe((res: any) => {
        this.MyDataSource = new MatTableDataSource(res.instances);
        this.MyDataSource.sort = this.sort;
        this._loading = false;
      });
  }
  sortData(sort) {
    this._loading = true;
    this.MyDataSource = null;
    localStorage.setItem('instance_direction', sort.direction);
    localStorage.setItem('instance_active', sort.active);
    this.productservice
      .getInstancesSort(
        this.swidTag,
        this.app_id,
        this.pageSize,
        this.current_page_num,
        sort.active,
        sort.direction
      )
      .subscribe(
        (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.instances);
          this.MyDataSource.sort = this.sort;
          this._loading = false;
        },
        (error) => {
          console.log('There was an error while retrieving Posts !!!' + error);
          this._loading = false;
        }
      );
  }
  gotoApplications() {
    const filters = JSON.parse(localStorage.getItem('aplFilter'));
    if (this.swidTag) {
      this.router.navigate(['/optisam/pr/products', this.swidTag], {
        state: { appName: filters['appName'], owner: filters['owner'] },
      });
    } else {
      this.router.navigate(['/optisam/apl/applications'], {
        state: {
          appName: filters['appName'],
          owner: filters['owner'],
          domain: filters['domain'],
          risk: filters['risk'],
        },
      });
    }
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

  getEquipData(value) {
    localStorage.setItem('instanceID', value.id);
    const key = localStorage.getItem('key');
    if (this.swidTag) {
      this.router.navigate([
        '/optisam/pr/apl/instances',
        this.swidTag,
        key,
        value.id,
      ]);
    } else {
      this.router.navigate(['/optisam/apl/instances', key, value.id]);
    }
  }
}
