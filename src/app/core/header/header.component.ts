import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { GroupService } from '../services/group.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/shared/shared.service';
import { AccountService } from '../services/account.service';
import { AboutComponent } from 'src/app/modules/home/pages/about/about/about.component';

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
  releaseNotes: any;
  // futures2021: any;
  futures2022: any;

  constructor(
    public router: Router,
    private authservice: AuthService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private accountService: AccountService,
    private groupService: GroupService
  ) {
    this.releaseNotes =
      localStorage.getItem('releaseNotes') === 'undefined'
        ? []
        : localStorage.getItem('releaseNotes');
    // this.futures2021 =
    //   localStorage.getItem('futures2021') === 'undefined'
    //     ? []
    //     : localStorage.getItem('futures2021');
    this.futures2022 =
      localStorage.getItem('futures2022') === 'undefined'
        ? []
        : localStorage.getItem('futures2022');
    translate.addLangs(['en', 'fr']);
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
        releaseNotes: this.releaseNotes,
        // 'futures2021': this.futures2021,
        futures2022: this.futures2022,
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
