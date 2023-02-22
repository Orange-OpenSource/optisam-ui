import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicationService } from 'src/app/core/services/application.service';
import { Router } from '@angular/router';
import { MoreDetailsComponent } from '../../../dialogs/product-details/more-details.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ViewEditorDetailsApplComponent } from '../view-editor-details-appl/view-editor-details-appl.component';

@Component({
  selector: 'app-apl-details',
  templateUrl: './apl-details.component.html',
  styleUrls: ['./apl-details.component.scss'],
})
export class AplDetailsComponent implements OnInit {
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

  displayedColumns: string[] = [
    // 'swidTag',
    'name',
    'Editor',
    'Edition',
    'Version',
    'totalCost',
    'numofEquipments',
  ];
  _loading: Boolean;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  dialogRef: any;

  constructor(
    private applicationservice: ApplicationService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    console.log("working")
    this.page_size = 50;
    this._loading = true;
    this.RenderDataTable();
  }
  RenderDataTable() {
    this.aplName = localStorage.getItem('appName');
    this.key = localStorage.getItem('key');
    this.applicationservice
      .getproductdetails(this.key, this.page_size, 1, 'name', 'asc')
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
  openDialog(value, name): void {
    localStorage.setItem('prodName', name);
    const dialogRef = this.dialog.open(MoreDetailsComponent, {
      width: '850px',
      disableClose: true,
      data: {
        datakey: value,
        dataName: name,
        appID: localStorage.getItem('key'),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  openEditorDialog(data:any){
    this.dialogRef=this.dialog.open(ViewEditorDetailsApplComponent,{
      width: '1300px',
      disableClose: true,
      data: data
    });

    this.dialogRef.afterClosed().subscribe((result) => {});
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
