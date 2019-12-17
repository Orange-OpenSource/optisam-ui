import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isPasswordShow = false;
  loginForm: FormGroup;
  errorMsg: string;
  lang: any;
  invalid = false;
  public currLang = 'en';
  public userLang;
  error_code: any;
  loading = false;
  constructor(private authservice: AuthService, private accountservice: AccountService,
    private router: Router, private translate: TranslateService) {
    translate.addLangs(['en', 'fr']);
    this.userLang = localStorage.getItem('language') ? localStorage.getItem('language') : 'en';
    this.currLang = this.userLang;
    this.translate.setDefaultLang(this.userLang);

  }
  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required]),
    });
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
    if (val.email && val.password) {
      this.loading = true;
      this.authservice.login(val.email, val.password).subscribe(res => {
        token = res.access_token;
       // this.authservice.
      },
        // (error) => this.errorMsg = error,
        (err: any) => {
          this.displayErrorMessage(err);
          this.loading = false;
      },
        () => {
          if (token) {
            localStorage.setItem('access_token', token);
            localStorage.setItem('email', val.email);
            // console.log('callinggetlang');
            this.accountservice.getUpdatedLang()
              .subscribe(
                (res1: any) => {
                  this.lang = res1.locale;
                  localStorage.setItem('role', res1.role);
               /*  this.authservice.getAceessRigthypes().subscribe(res => {
                console.log('test-------', res);
                }); */
                  // console.log(this.lang);
                  this.currLang = this.lang;
                  this.updateUserLanguage(this.currLang);
                  this.router.navigate(['/optisam/dashboard']);
                },
                error => {
                  console.log('There was an error while retrieving Posts !!!' + error);
                  this.loading = false;
                });
          }
        });
    }
  }
  private displayErrorMessage(err: any): void {
   if (
        err.error_code === 1
    ) {
      this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS';
    } else if (
      err.error_code === 2
    ) {
        this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-BlOCKED';
    } else if (
      err.error_code === 3
  ) {
      this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-ADMIN';
  } else {
        this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS';
    }
}
}
