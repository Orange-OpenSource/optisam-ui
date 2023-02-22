import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductCatalogTab } from '@core/modals/product-catalog.modal';
import { PRODUCT_CATALOG_TABS } from '@core/util/constants/constants';
import { CoreFactorUploadComponent } from '@home/pages/core-factor-management/core-factor-upload/core-factor-upload.component';
import { FileUploadComponent } from '../../file-upload/file-upload.component';

@Component({
  selector: 'app-header-product-catalog',
  templateUrl: './header-product-catalog.component.html',
  styleUrls: ['./header-product-catalog.component.scss'],
})
export class HeaderProductCatalogComponent implements OnInit {
  @ViewChild('FileUpload')  fileUploadInput: ElementRef<HTMLInputElement>;
  productCatalogTabs: ProductCatalogTab[] = [
    { tabName: PRODUCT_CATALOG_TABS.EDITOR, link: '/optisam/pc/editors' },
    { tabName: PRODUCT_CATALOG_TABS.PRODUCT, link: '/optisam/pc/products' },
  ];
  @Input() currentTab: PRODUCT_CATALOG_TABS = PRODUCT_CATALOG_TABS.EDITOR;
  sharedService: any;
 

  

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  uploadFile(){
    let dialogRef = this.dialog.open(FileUploadComponent, {
      minHeight: '400px',
      maxHeight: '70vh',
      width: '480px',
      data:"yes",
      disableClose: true,
      panelClass: ['ps', 'scroll-container'],
    });
  }

  

  

  


}
