import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicationService } from 'src/app/core/services/application.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-apl-product-details',
  templateUrl: './apl-product-details.component.html',
  styleUrls: ['./apl-product-details.component.scss'],
})
export class AplProductDetailsComponent implements OnInit {
  MyDataSource: any;
  searchKey: string;
  length;
  pageSize = 50;
  sort_order: any;
  sort_by: any;
  page_size: any;
  pageEvent: any;
  sortData: any;
  applicationId: any;
  aplName: any;
  key: any;
  inst_id: any;

  displayedColumns: string[] = [
    'swidTag',
    'name',
    'Editor',
    'Edition',
    'Version',
    'totalCost',
    // 'numofEquipments',
  ];
  _loading: Boolean;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private applicationservice: ApplicationService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.page_size = 50;
    this._loading = true;
    this.RenderDataTable();
  }

  RenderDataTable() {
    this.aplName = localStorage.getItem('appName');
    this.key = localStorage.getItem('key');
    this.inst_id = localStorage.getItem('instanceID');
    console.log('inst', this.inst_id);
    this.applicationservice
      .getproductCountDetails(
        this.key,
        this.page_size,
        1,
        'name',
        'asc',
        this.inst_id
      )
      .subscribe(
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
  getEquipData(value) {
    console.log(value);
    localStorage.setItem('prodName', value.name);
    const key = localStorage.getItem('key');
    const swidTag = value.swidTag;
    this.router.navigate(['/optisam/apl/applications', key, swidTag]);
  }

  backToApplication() {
    const filters = JSON.parse(localStorage.getItem('aplFilter'));
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
