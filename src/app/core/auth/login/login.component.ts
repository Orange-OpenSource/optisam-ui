import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '../../services/account.service';
import jwt_decode from 'jwt-decode';
import { AboutData } from '@core/modals';
import { CommonService } from '@core/services';
import { LOCAL_KEYS } from '@core/util/constants/constants';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isPasswordShow: any = false;
  loginForm: FormGroup;
  errorMsg: string;
  lang: any;
  invalid: any = false;
  public currLang: any = 'en';
  public userLang: any;
  error_code: any;
  loading: Boolean = false;
  firstLogInFlag: any = 'false';
  version: any;
  decodedScopes: any;
  cookieInfoAcknowledged: boolean;

  constructor(
    private authservice: AuthService,
    private accountservice: AccountService,
    private router: Router,
    private translate: TranslateService,
    private cs: CommonService
  ) {
    localStorage.clear();
    this.getMetaInfo();
    translate.addLangs(['en', 'fr']);
    this.userLang = localStorage.getItem('language')
      ? localStorage.getItem('language')
      : 'en';
    this.currLang = this.userLang;
    this.translate.setDefaultLang(this.userLang);
  }
  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  getMetaInfo() {
    this.getVersion();
    this.getAbout();
  }
  getVersion() {
    this.accountservice.getVersion().subscribe(
      (res) => {
        this.version = res;
        this.cs.setLocalData(LOCAL_KEYS.VERSION, this.version);
      },
      (err) => {
        this.version = err.error.text;
        this.cs.setLocalData(LOCAL_KEYS.VERSION, this.version);
      }
    );
  }
  getAbout() {
    //TODO
    localStorage.setItem('copyright', 'Copyright © Orange 2021');
    this.accountservice.getAbout().subscribe(
      (res: AboutData) => {
        this.cs.setLocalData(LOCAL_KEYS.COPYRIGHT, res?.copyright || '');
        this.cs.setLocalData(
          LOCAL_KEYS.RELEASE_NOTES,
          JSON.stringify(res?.release_notes || [])
        );
        this.cs.setLocalData(
          LOCAL_KEYS.FUTURE,
          JSON.stringify(res?.future || [])
        );
      },
      (err) => {
        this.cs.setLocalData(LOCAL_KEYS.COPYRIGHT, err.error.text);
        this.cs.setLocalData(LOCAL_KEYS.RELEASE_NOTES, err.error.text);
        this.cs.setLocalData(LOCAL_KEYS.FUTURE, err.error.text);
      }
    );
  }

  toggleShowPassword() {
    this.isPasswordShow = !this.isPasswordShow;
  }
  updateUserLanguage(language: string) {
    localStorage.setItem('language', language);
    this.currLang = language;
    this.translate.use(language);
  }
  onSubmit() {
    const val = this.loginForm.value;
    let token;
    const email = val.email.trim();
    if (val.email && val.password) {
      this.loading = true;
      this.authservice.login(email, val.password).subscribe(
        (res) => {
          console.log(res);

          token = res.access_token;
          const decodedToken = jwt_decode(token);
          if (decodedToken['Socpes'] != null) {
            this.decodedScopes = decodedToken['Socpes'].sort();
          }
          if (this.decodedScopes && this.decodedScopes.length > 0) {
            localStorage.setItem('scope', this.decodedScopes[0]);
          }
        },
        (err: any) => {
          this.displayErrorMessage(err);
          this.loading = false;
        },
        () => {
          if (token) {
            localStorage.setItem('access_token', token);
            if (localStorage.getItem('access_token')) {
              this.authservice.sendMessage(true);
            } else {
              this.authservice.sendMessage(false);
            }
            localStorage.setItem('email', email);
            this.accountservice.getUserInfo(email).subscribe(
              (res: any) => {
                this.currLang = res.locale;
                this.lang = res.locale;
                this.firstLogInFlag = res.first_login;
                localStorage.setItem('first_name', res.first_name);
                localStorage.setItem('last_name', res.last_name);
                localStorage.setItem(
                  'profile_pic',
                  res.profile_pic ? res.profile_pic : ''
                );
                localStorage.setItem('role', res.role);
                localStorage.setItem('firstLogin', this.firstLogInFlag);
                this.updateUserLanguage(this.currLang);
                if (this.firstLogInFlag) {
                  this.router.navigate(['/optisam/changePassword']);
                } else if (
                  !this.decodedScopes ||
                  this.decodedScopes.length === 0
                ) {
                  this.router.navigate(['/optisam/sm']);
                } else {
                  this.router.navigate(['/optisam/productCatalog']);
                }
                this.loading = false;
              },
              (error) => {
                console.log(
                  'There was an error while retrieving Posts !!!' + error
                );
                this.loading = false;
              }
            );
          }
        }
      );
    }
  }
  private displayErrorMessage(err: any): void {
    if (err.error_code === 1) {
      this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS';
    } else if (err.error_code === 2) {
      this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-BlOCKED';
    } else if (err.error_code === 3) {
      this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-ADMIN';
    } else {
      this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-NETWORK';
    }
  }
  closeInfoBanner() {
    this.cookieInfoAcknowledged = true;
  }
}
