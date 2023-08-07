import { Component, Input, OnInit } from '@angular/core';
import { ProductCatalogTab } from '@core/modals';
import { PRODUCT_CATALOG_TABS } from '@core/util/constants/constants';

@Component({
  selector: 'app-header-info',
  templateUrl: './header-info.component.html',
  styleUrls: ['./header-info.component.scss'],
})
export class HeaderInfoComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  productCatalogTabs: ProductCatalogTab[] = [
    { tabName: PRODUCT_CATALOG_TABS.EDITOR, link: '/optisam/pc/editors' },
    { tabName: PRODUCT_CATALOG_TABS.PRODUCT, link: '/optisam/pc/products' },
  ];
  @Input() currentTab: PRODUCT_CATALOG_TABS = PRODUCT_CATALOG_TABS.EDITOR;
}
