import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { GroupService } from '../services/group.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/shared/shared.service';
import { AccountService } from '../services/account.service';
import { AboutComponent } from 'src/app/modules/home/pages/about/about/about.component';
import { AboutFuture, MenuItemImg, MenuItemMat } from '@core/modals';
import { CommonService } from '@core/services';
import { DEFAULT_LANGUAGES, LOCAL_KEYS, MENU_ROUTER_LINKS } from '@core/util/constants/constants';
import { isSpecificScopeType } from '@core/util/common.functions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public name: string;
  public email: string;
  public userName;
  token: string;
  public currLang = 'en';
  public userLang;
  public role: String;
  @Output() toggleSidebar = new EventEmitter();
  public sidebarFlag = false;
  scopesList: any[] = [];
  selectedScope: any;
  newScope: any;
  scopesListOriginal: any = [];
  releaseNotes: string[];
  // futures2021: any;
  future: AboutFuture[];
  copyRight: string;

  menuItems: Array<MenuItemMat | MenuItemImg> = [
    {
      id: 'nav-acq-rights-management',
      matTooltip: 'HEADER.MENU_ITEM.ACQUIRED_RIGHTS',
      routerLink: MENU_ROUTER_LINKS.acquiredRightsManagement,
      auth: ['ADMIN', 'SUPER_ADMIN'],
      menuItemName: 'HEADER.MENU_ITEM.ACQUIRED_RIGHTS',
      isMatIcon: false,
      imgSrc: `/assets/images/acquired-rights-admin.svg`,
    },
    {
      id: 'nav-metrics-management',
      matTooltip: 'HEADER.MENU_ITEM.METRICS',
      routerLink: MENU_ROUTER_LINKS.metricsManagement,
      auth: ['ADMIN', 'SUPER_ADMIN'],
      isMatIcon: false,
      imgSrc: `/assets/images/Metrics-ManagementSmall.png`,
      menuItemName: 'HEADER.MENU_ITEM.METRICS',
    },
    {
      id: 'nav-equipment-management',
      matTooltip: 'HEADER.MENU_ITEM.EQUIPMENTS',
      routerLink: MENU_ROUTER_LINKS.equipmentsManagement,
      auth: ['ADMIN', 'SUPER_ADMIN'],
      menuItemName: 'HEADER.MENU_ITEM.EQUIPMENTS',
      isMatIcon: false,
      imgSrc: '/assets/images/Equipment-managementSmall.png',
    },
    {
      id: 'nav-scope-management',
      matTooltip: 'HEADER.MENU_ITEM.SCOPES',
      routerLink: MENU_ROUTER_LINKS.scopesManagement,
      auth: ['ADMIN', 'SUPER_ADMIN'],
      isMatIcon: false,
      imgSrc: '/assets/images/scope-management.svg',
      menuItemName: 'HEADER.MENU_ITEM.SCOPES',
    },
    {
      id: 'nav-product-catalog-management',
      matTooltip: 'HEADER.MENU_ITEM.PRODUCT_CATALOG',
      routerLink: MENU_ROUTER_LINKS.productCatalogManagement,
      auth: ['ADMIN', 'SUPER_ADMIN'],
      isMatIcon: true,
      matIconName: 'shopping_cart',
      menuItemName: 'HEADER.MENU_ITEM.PRODUCT_CATALOG',
    },

    {
      id: 'nav-aggregation-management',
      matTooltip: 'HEADER.MENU_ITEM.AGGREGATION',
      routerLink: MENU_ROUTER_LINKS.aggregationManagement,
      auth: ['ADMIN', 'SUPER_ADMIN'],
      menuItemName: 'HEADER.MENU_ITEM.AGGREGATION',
      isMatIcon: true,
      matIconName: 'devices_other',
    },
    {
      id: 'nav-group-management',
      matTooltip: 'HEADER.MENU_ITEM.GROUP',
      routerLink: MENU_ROUTER_LINKS.groupManagement,
      auth: ['ADMIN', 'SUPER_ADMIN'],
      isMatIcon: true,
      matIconName: 'group_add',
      menuItemName: 'HEADER.MENU_ITEM.GROUP',
    },
    {
      id: 'nav-inventory-management',
      matTooltip: 'HEADER.MENU_ITEM.INVENTORY',
      routerLink: MENU_ROUTER_LINKS.inventoryManagement,
      auth: ['ADMIN', 'SUPER_ADMIN'],
      isMatIcon: true,
      matIconName: 'cloud_upload',
      menuItemName: 'HEADER.MENU_ITEM.INVENTORY',
    },
    {
      id: 'nav-obsolescence-management',
      matTooltip: 'HEADER.MENU_ITEM.OBSOLESCENCE',
      routerLink: MENU_ROUTER_LINKS.obsolescenceManagement,
      auth: ['ADMIN', 'SUPER_ADMIN'],
      isMatIcon: true,
      matIconName: 'warning',
      menuItemName: 'HEADER.MENU_ITEM.OBSOLESCENCE',
    },
    {
      id: 'nav-user-management',
      matTooltip: 'HEADER.MENU_ITEM.USERS',
      routerLink: MENU_ROUTER_LINKS.usersManagement,
      auth: ['ADMIN', 'SUPER_ADMIN'],
      isMatIcon: true,
      matIconName: 'person',
      menuItemName: 'HEADER.MENU_ITEM.USERS',
    },
    {
      id: 'nav-configuration-management',
      matTooltip: 'HEADER.MENU_ITEM.SIMULATIONS',
      routerLink: MENU_ROUTER_LINKS.simulatorsManagement,
      auth: ['ADMIN', 'SUPER_ADMIN'],
      isMatIcon: true,
      matIconName: 'settings',
      menuItemName: 'HEADER.MENU_ITEM.SIMULATIONS',
    },
  ];

  constructor(
    public router: Router,
    private authservice: AuthService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private accountService: AccountService,
    private groupService: GroupService,
    private cs: CommonService
  ) {
    translate.addLangs(DEFAULT_LANGUAGES);
    this.userLang = localStorage.getItem('language')
      ? localStorage.getItem('language')
      : 'en';
    this.currLang = this.userLang;
    this.translate.setDefaultLang(this.userLang);
    this.getScopesList();
  }

  ngOnInit() {
    this.token = localStorage.getItem(this.authservice.access_token);
    const emailId = localStorage.getItem('email') || '';
    this.userName = emailId.substring(0, emailId.lastIndexOf('@'));
    this.role = localStorage.getItem('role');
    this.fetchAboutData();
  }

  get inventoryManagementLink(): string {
    return this.allowedScope
      ? '/optisam/dm/metadata'
      : '/optisam/dm/globaldata';
  }

  get allowedScope(): boolean {
    return isSpecificScopeType();
  }

  get navMenuItems(): Array<MenuItemMat | MenuItemImg> {
    // return sorted menu by the menu name.
    return this.menuItems.sort(
      (a: MenuItemMat | MenuItemImg, b: MenuItemMat | MenuItemImg) => {
        return a.menuItemName > b.menuItemName
          ? 1
          : a.menuItemName === b.menuItemName
          ? 0
          : -1;
      }
    );
  }

  menuOpened(): void {
    //TODO: look for a better solution for inventory management link navigation for specific/generic scopetypes.

    this.menuItems = this.menuItems.map((menu) => {
      if (menu.id === 'nav-inventory-management') {
        menu.routerLink = this.inventoryManagementLink;
      }
      return menu;
    });
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
  logout() {
    localStorage.clear();
    localStorage.setItem('access_token', '');
    localStorage.setItem('role', '');
    localStorage.getItem('access_token');
    this.router.navigate(['/']);
    this.authservice.sendMessage(false);
  }
  langchange() {
    localStorage.getItem('access_token');
    this.router.navigate(['/optisam/settings']);
  }
  toggleSideNavbar() {
    this.sidebarFlag = !this.sidebarFlag;
    this.toggleSidebar.emit(this.sidebarFlag.toString());
  }
  getScopesList() {
    this.accountService.getScopesList().subscribe(
      (res) => {
        res.scopes.map((s) => {
          this.scopesListOriginal.push(s);
        });
        this.scopesListOriginal.sort((a, b) =>
          a.scope_code > b.scope_code ? 1 : -1
        );
        const existingScope = this.scopesListOriginal.filter(
          (s) => s.scope_code === localStorage.getItem('scope')
        )[0];
        this.selectedScope = existingScope
          ? existingScope
          : this.scopesListOriginal[0];
        this.scopesList = this.scopesListOriginal.filter(
          (s) => s.scope_code !== this.selectedScope.scope_code
        );
        localStorage.setItem('scope', this.selectedScope.scope_code);
        localStorage.setItem(
          'scopeType',
          this.selectedScope.scope_type || 'GENERIC'
        );
      },
      (err) => {
        console.log('Error fetching list of scopes ', err);
      }
    );
  }
  setScope(scope, warningMsg, dashboardMsg) {
    const currentRoute = this.router.url;
    if (scope.scope_code !== this.selectedScope.scope_code) {
      this.newScope = scope;
      if (currentRoute !== '/optisam/dashboard') {
        this.openModal(warningMsg, '40%');
      } else {
        this.openModal(dashboardMsg, '40%');
      }
    }
  }

  changeScope() {
    this.selectedScope = this.newScope;
    this.scopesList = this.scopesListOriginal.filter(
      (s) => s !== this.selectedScope
    );
    localStorage.setItem('scope', this.selectedScope.scope_code);
    localStorage.setItem(
      'scopeType',
      this.selectedScope.scope_type || 'GENERIC'
    );
    this.sharedService.emitScopeChange(this.newScope.scope_code);
  }
  backToHome() {
    this.router.navigate(['/']);
  }

  // About Us
  openAboutUs() {
    this.dialog.open(AboutComponent, {
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

  openModal(templateRef, width) {
    let dialogRef = this.dialog.open(templateRef, {
      width: width,
      disableClose: true,
    });
  }
}
