import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductCatalogProduct } from '@core/modals';
import { CRUD } from '@core/util/constants/constants';

@Component({
  selector: 'app-view-product-catalog-product-dialog',
  templateUrl: './view-product-catalog-product-dialog.component.html',
  styleUrls: ['./view-product-catalog-product-dialog.component.scss'],
})
export class ViewProductCatalogProductDialogComponent implements OnInit {
  displayedColumns: string[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  
  productName: string;
  versions:string[];
  endOfLife:string[]
  endOfSupport:string[]
  openSource:string
  openLicences:string
  crudValue: CRUD = CRUD.READ;
  _loading:any=false
  ngOnInit(): void {
    console.log(this.data)
    this.displayedColumns = [
      'name',
      'Swid Tag Version',
      'End of Support',
      'End of Life'
  ];
  if(!this.data.hasOwnProperty('version')){
this.versions=[]
  }else{
    this.versions=this.data?.version?.map((x)=>x.name)
  }
  console.log(this.data)
    
    console.log(this.versions)
    this.endOfSupport=this.data?.version?.map((x)=>x.endOfSupport)
    this.endOfLife=this.data?.version?.map((x)=>x.endOfLife)
    this.openSource=this.data?.openSource?.isOpenSource
    this.openLicences=this.data?.openSource?.openLicences
    this.productName = this.data?.name;
  }

  openLink(url: string){
    window.open(url, "_blank");
  }
}
