import { Subscription } from 'rxjs';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import {
  AboutFuture,
  ProductCatalogEditor,
  ProductCatalogTab,
} from '@core/modals';
import { CommonService } from '@core/services';
import {
  LOCAL_KEYS,
  PRODUCT_CATALOG_TABS,
} from '@core/util/constants/constants';
import { AboutComponent } from '@home/pages/about/about/about.component';
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
  selectedTab: string = PRODUCT_CATALOG_TABS.EDITOR;
  selectedProductId: string = '';
  selectedEditorId: string = '';
  editorData: ProductCatalogEditor = null;

  productCatalogTabs: string[] = [
    PRODUCT_CATALOG_TABS.EDITOR,
    PRODUCT_CATALOG_TABS.PRODUCT,
  ];
  accessToken: string = null;

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private router: Router,
    private cs: CommonService,
    private auth: AuthService,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.userLang = localStorage.getItem('language')
      ? localStorage.getItem('language')
      : 'en';

    this.translate.setDefaultLang(this.userLang);
    this.currLang = this.userLang;
    this.loginStatus = this.getLoginStatus();
    this.fetchAboutData();
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

  get isEditor(): boolean {
    return this.selectedTab === PRODUCT_CATALOG_TABS.EDITOR;
  }

  get isProduct(): boolean {
    return this.selectedTab === PRODUCT_CATALOG_TABS.PRODUCT;
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

  ngOnDestroy(): void {}
}
