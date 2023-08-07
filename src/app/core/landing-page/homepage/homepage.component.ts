import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import {
  AboutFuture,
  ProductCatalogEditor,
  ProductCatalogProductSet,
  ProductCatalogTab,
  ProductCatalogTabs,
  TabsFlow,
} from '@core/modals';
import { CommonService, ProductCatalogService } from '@core/services';
import {
  LOCAL_KEYS,
  PRODUCT_CATALOG_TABS,
} from '@core/util/constants/constants';
import { TranslateService } from '@ngx-translate/core';
import { AboutsComponent } from '../abouts/abouts.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  currLang = 'en';
  userLang: string;
  releaseNotes: string[];
  future: AboutFuture[];
  copyRight: string;
  loginStatus: boolean = false;
  selectedTab: PRODUCT_CATALOG_TABS = PRODUCT_CATALOG_TABS.EDITOR;
  selectedProductId: string = '';
  selectedEditorId: string = '';
  editorData: ProductCatalogEditor = null;

  productCatalogTabs: ProductCatalogTabs[] = [
    { title: PRODUCT_CATALOG_TABS.EDITOR, alias: null },
    { title: PRODUCT_CATALOG_TABS.PRODUCT, alias: null },
  ];
  accessToken: string = null;
  from: PRODUCT_CATALOG_TABS;
  productInfo: ProductCatalogProductSet;
  editorInfo: ProductCatalogEditor;
  editorSet: PRODUCT_CATALOG_TABS[] = [
    PRODUCT_CATALOG_TABS.EDITOR,
    PRODUCT_CATALOG_TABS.EDITOR_DETAIL,
    PRODUCT_CATALOG_TABS.PRODUCT_DETAIL,
  ];
  productSet: PRODUCT_CATALOG_TABS[] = [
    PRODUCT_CATALOG_TABS.PRODUCT,
    PRODUCT_CATALOG_TABS.PRODUCT_DETAIL,
  ];

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private router: Router,
    private cs: CommonService,
    private auth: AuthService,
    private cd: ChangeDetectorRef,
    private pc: ProductCatalogService
  ) { }
  ngOnInit(): void {
    this.userLang = localStorage.getItem('language')
      ? localStorage.getItem('language')
      : 'en';

    this.translate.setDefaultLang(this.userLang);
    this.currLang = this.userLang;
    this.loginStatus = this.getLoginStatus();
    this.fetchAboutData();
    this.allStream();
  }

  login() {
    this.router.navigate(['/login']);
  }

  checkLanguage() {
    if (localStorage.getItem('language') === 'en') {
      this.currLang = localStorage.getItem('language');
    } else {
      if (localStorage.getItem('language') === 'fr') {
        this.currLang = localStorage.getItem('language');
      } else {
        /* this.currLang = language;
                localStorage.setItem('language', language); */
      }
    }
  }

  updateUserLanguage(language: string) {
    this.currLang = language;
    localStorage.setItem('language', language);
    this.translate.use(language);
  }

  fetchAboutData(): void {
    try {
      this.releaseNotes =
        JSON.parse(this.cs.getLocalData(LOCAL_KEYS.RELEASE_NOTES)) || [];
    } catch (e) {
      this.releaseNotes = [];
    }

    try {
      this.future = JSON.parse(this.cs.getLocalData(LOCAL_KEYS.FUTURE)) || [];
    } catch (e) {
      this.future = [];
    }
    this.copyRight = this.cs.getLocalData(LOCAL_KEYS.COPYRIGHT) || '';
  }

  openAboutUs() {
    this.dialog.open(AboutsComponent, {
      width: '600px',
      maxHeight: '85vh',
      autoFocus: false,
      data: {
        release_notes: this.releaseNotes,
        future: this.future,
        copyright: this.copyRight,
      },
    });
  }

  isSelected(tabName: string): boolean {
    if (this.selectedTab == tabName) {
      return true;
    }
    return false;
  }

  get isInEditorSet(): boolean {
    return this.editorSet.includes(this.selectedTab);
  }

  get isEditor(): boolean {
    return this.selectedTab === PRODUCT_CATALOG_TABS.EDITOR;
  }

  get isEditorDetail(): boolean {
    return this.selectedTab === PRODUCT_CATALOG_TABS.EDITOR_DETAIL;
  }

  get isProductDetail(): boolean {
    return this.selectedTab === PRODUCT_CATALOG_TABS.PRODUCT_DETAIL;
  }

  get isInProductSet(): boolean {
    return this.productSet.includes(this.selectedTab);
  }

  get isProduct(): boolean {
    return this.selectedTab === PRODUCT_CATALOG_TABS.PRODUCT;
  }

  get fromProduct(): boolean {
    return this.from === PRODUCT_CATALOG_TABS.PRODUCT;
  }

  get fromEditor(): boolean {
    return this.from === PRODUCT_CATALOG_TABS.EDITOR;
  }

  private getLoginStatus(): boolean {
    this.accessToken = localStorage.getItem('access_token');
    if (!this.accessToken) return false;
    let tokenData: {
      Locale: string;
      Role: string;
      Socpes: string[];
      UserID: string;
      exp: number;
      iat: number;
      iss: string;
      sub: string;
    };
    try {
      tokenData = JSON.parse(atob(this.accessToken.split('.')[1]));
    } catch (e) {
      return false;
    }

    if (tokenData.exp * 1000 <= Date.now()) return false;
    return true;
  }

  navigateToProduct(editor: ProductCatalogEditor): void {
    this.editorData = editor;
    this.selectedTab = PRODUCT_CATALOG_TABS.PRODUCT;
  }

  resetEditor(active: boolean): void {
    this.editorData = null;
  }

  allStream(): void {
    this.pc.getNewTab().subscribe((tabFlow: TabsFlow) => {
      this.from = tabFlow.from;
      this.productCatalogTabs.push({ title: tabFlow.tabName, alias: tabFlow.alias });
      const uniqueProductCatalogTabs: ProductCatalogTabs[] = [];
      this.productCatalogTabs.forEach((tab: ProductCatalogTabs) => {
        if (!uniqueProductCatalogTabs.some((t: ProductCatalogTabs) => t.title === tab.title))
          uniqueProductCatalogTabs.push(this.getLatestTabMatchingWithTitle(tab));
      })
      this.productCatalogTabs = uniqueProductCatalogTabs;
      this.selectedTab = tabFlow.tabName;
    });
  }

  private getLatestTabMatchingWithTitle(tab: ProductCatalogTabs): ProductCatalogTabs {
    let lastTab: ProductCatalogTabs = tab;

    for (let i = this.productCatalogTabs.length; i > 0; i--) {
      if (this.productCatalogTabs?.[i]?.title === tab.title) {
        lastTab = this.productCatalogTabs[i];
        break;
      }
    }
    return lastTab;
  }

  closeTab(index: number): void {
    this.productCatalogTabs.splice(index, 1);
    this.selectedTab = this.afterCloseTab();

  }

  private afterCloseTab(): PRODUCT_CATALOG_TABS {
    if (this.productCatalogTabs.some((tab: ProductCatalogTabs) => tab.title === this.selectedTab))
      return this.selectedTab;
    if (this.productCatalogTabs.some((tab: ProductCatalogTabs) => tab.title === this.from)) return this.from;
    if (this.editorSet.includes(this.selectedTab))
      return PRODUCT_CATALOG_TABS.EDITOR;
    return PRODUCT_CATALOG_TABS.PRODUCT;
  }

  changeTab(tabTitle: PRODUCT_CATALOG_TABS): void {
    this.selectedTab = tabTitle;
    this.cd.detectChanges();
  }

  ngOnDestroy(): void { }
}
