// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { ProductService } from 'src/app/core/services/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MoreDetailsComponent } from '../../../dialogs/product-details/more-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-prod',
  templateUrl: './prod.component.html',
  styleUrls: ['./prod.component.scss']
})
export class ProdComponent implements OnInit {
  public searchValue: any = {};

  MyDataSource: any;
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
  dialogRef:any;


  displayedColumns: string[] = ['swidTag', 'name', 'version', 'editor', 'category', 'totalCost',
   'numOfApplications', 'numofEquipments'];
  _loading: Boolean;

  advanceSearchModel: any = {
    title: 'Search by Product Name',
    primary: 'name',
    other: [
      {key: 'swidTag', label: 'SWIDtag'},
      {key: 'name', label: 'Product name'},
      {key: 'editor', label: 'Editor name'}
    ]
  };
  searchFields: any = {};
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private productservice: ProductService, 
    public dialog: MatDialog, 
    private router: Router) {
      this._loading = true;
      this.current_page_num = 1;
      const state = window.history.state||{};
      if(state['swidTag'] != undefined || state['name'] != undefined || state['editor'] != undefined) {
        this.searchFields = state;
        this.applyFilter();
      }
      else {        
        this.RenderDataTable();
      }
     }
  ngOnInit() {
  }

  openDialog(value, name): void {
    this.dialogRef = this.dialog.open(MoreDetailsComponent, {
      width: '850px',
      disableClose: true,
      data: {
          datakey : value,
          dataName : name
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
    });
  }
  RenderDataTable() {
    this.productservice.getProducts(10, 1).subscribe(
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
  getPaginatorData(event) {
    this._loading = true;
    this.MyDataSource = null;
    const page_num = event.pageIndex;
    this.current_page_num = page_num;
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.sort_order = localStorage.getItem( 'product_direction');
    this.sort_by = localStorage.getItem( 'product_active');
    if (this.sort_by === '' || this.sort_by === null) {
      this.sort_by = 'name';
    }
    if (this.sort_order === '' || this.sort_order === null) {
      this.sort_order = 'asc';
    }
    this.productservice.filteredData(page_num + 1, this.pageSize,
      this.sort_by, this.sort_order, this.searchFields.swidTag ,
      this.searchFields.name, this.searchFields.editor).subscribe(
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
    localStorage.setItem('product_direction', sort.direction);
    localStorage.setItem('product_active', sort.active);
    this.productservice.filteredData(this.current_page_num, this.pageSize,
      sort.active, sort.direction, this.searchFields.swidTag ,
      this.searchFields.name, this.searchFields.editor).subscribe(
      (res: any) => {
        this.MyDataSource = new MatTableDataSource(res.products);
        this.MyDataSource.sort = this.sort;
        this._loading = false;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
        this._loading = false;
      });
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
    if (this.current_page_num === 0) {
      this.current_page_num = 1;
    }
    this.productservice.filteredData(this.current_page_num, this.pageSize,
      this.sort_by, this.sort_order, this.searchFields.swidTag ,
      this.searchFields.name, this.searchFields.editor).subscribe(
        (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.products);
          this.MyDataSource.sort = this.sort;
          this.length = res.totalRecords;
          this._loading = false;
        }
      );
  }
  productApl(swidTag, prodName) {
    localStorage.setItem('prodName', prodName);
    localStorage.setItem('swidTag', swidTag);
    console.log(JSON.stringify(this.searchFields))
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
    this.applyFilter();
  }
}
