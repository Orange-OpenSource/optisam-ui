import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { PasswordAction } from '@core/modals';
import { CommonService } from '@core/services';
import { LOCAL_KEYS, QP } from '@core/util/constants/constants';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-user-activation',
  templateUrl: './user-activation.component.html',
  styleUrls: ['./user-activation.component.scss']
})
export class UserActivationComponent implements OnInit {
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

    this.routes.data.subscribe(({ data: { token, user, invalid, type } }) => {
      this.invalidRequest = invalid;
      this.user = user;
      this.token = token;
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
