import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { PasswordAction } from '@core/modals';
import { CommonService } from '@core/services';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-reset-password',
  templateUrl: './user-reset-password.component.html',
  styleUrls: ['./user-reset-password.component.scss']
})
export class UserResetPasswordComponent implements OnInit {
  invalidRequest: boolean = true;
  user: string;
  token: string;
  loginStatus: boolean;
  userLang!: string;
  currLang: string = 'en';
  type: PasswordAction;


  constructor(private router: Router, private routes: ActivatedRoute, private authService: AuthService, private translate: TranslateService, private cs: CommonService) {
    translate.addLangs(['en', 'fr']);
    this.userLang = this.cs.getLocalData(LOCAL_KEYS.LANGUAGE) || 'en'
    this.translate.setDefaultLang(this.userLang);
  }



  ngOnInit(): void {

    this.routes.data.subscribe(({ data, type }) => {
      this.invalidRequest = data?.invalid;
      this.user = data?.user || null;
      this.token = data?.token || null;
      this.type = type;
    })

    this.authService.getLoginToken().subscribe((status: boolean) => {
      this.loginStatus = status;
    })

  }

  login() {
    this.router.navigate(['/login']);
  }

  updateUserLanguage(language: string) {
    this.cs.setLocalData(LOCAL_KEYS.LANGUAGE, language);
    this.currLang = language;
    this.translate.use(language);
  }

  checkLanguage(): void {
    this.currLang = this.cs.getLocalData(LOCAL_KEYS.LANGUAGE) || 'en';
  }


}

