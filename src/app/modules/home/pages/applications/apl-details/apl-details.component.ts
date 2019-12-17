import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { ApplicationService } from 'src/app/core/services/application.service';
import { Router } from '@angular/router';
import { MoreDetailsComponent } from '../../../dialogs/product-details/more-details.component';


@Component({
  selector: 'app-apl-details',
  templateUrl: './apl-details.component.html',
  styleUrls: ['./apl-details.component.scss']
})
export class AplDetailsComponent implements OnInit {
  MyDataSource: any;
  searchKey: string;
  length ;
  pageSize = 10;
  sort_order: any;
  sort_by: any;
  page_size: any;
  pageEvent: any;
  sortData: any;
  applicationId: any;
  aplName: any;
  key: any;

  displayedColumns: string[] = ['swidTag', 'name', 'Editor', 'Edition', 'Version', 'totalCost', 'numOfInstances', 'numofEquipments'] ;
  _loading: Boolean;

  constructor(private applicationservice: ApplicationService, private router: Router
    , public dialog: MatDialog) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this._loading = true;
    this.RenderDataTable();
  }
  RenderDataTable() {
    this.aplName = localStorage.getItem('aplName');
    this.key = localStorage.getItem('key');
    this.applicationservice.getproductdetails(this.key).subscribe(
      (res: any) => {
        this.MyDataSource = new MatTableDataSource(res.products);
        this.MyDataSource.sort = this.sort;
        this.length = res.totalRecords;
        this._loading = false;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
        this._loading = false;
      });
  }
  openDialog(value, name): void {
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



}


