import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataManagementService } from 'src/app/core/services/data-management.service';

@Component({
  selector: 'app-list-inventory-logs',
  templateUrl: './list-inventory-logs.component.html',
  styleUrls: ['./list-inventory-logs.component.scss'],
})
export class ListInventoryLogsComponent implements OnInit {
  _loading: Boolean;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'deletion_type',
    'created_by',
    'status',
    'created_on',
  ];
  length: any;
  pageSize: any;
  currentPage: any;
  sortBy: any;
  sortOrder: any;

  constructor(private dataManagementService: DataManagementService) {}

  ngOnInit(): void {
    this.currentPage = 1;
    this.pageSize = 50;
    this.sortBy = 'created_on';
    this.sortOrder = 'asc';
    this.getDeletionLogs();
  }
  formatAsColumnName(property) {
    switch (property) {
      case 'deletion_type':
        return 'Data';
      case 'created_by':
        return 'Requester';
      case 'created_on':
        return 'Date';
      default:
        return (
          property.substr(0, 1).toUpperCase() +
          property.substr(1, property.length - 1)
        );
    }
  }

  getDeletionLogs() {
    this._loading = true;
    this.dataManagementService
      .getDeletionLogs(
        this.sortBy,
        this.sortOrder,
        this.currentPage,
        this.pageSize
      )
      .subscribe(
        (res) => {
          if (res.deletions && Object.keys(res.deletions).length > 0) {
            this.dataSource = new MatTableDataSource(res.deletions);
            // this.displayedColumns = Object.keys(res.deletions);
          }
          this.length = res.totalRecords;
          this._loading = false;
        },
        (err) => {
          this._loading = false;
          console.log(
            'Some error occured! Could not fetch failed records info.'
          );
        }
      );
  }

  getPaginatorData(event) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getDeletionLogs();
  }

  sortData(ev) {
    this.sortBy = ev.active;
    this.sortOrder = ev.direction || 'asc';
    this.getDeletionLogs();
  }
}
