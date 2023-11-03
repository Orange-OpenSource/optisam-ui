import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { CommonService } from '@core/services';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header-without-login',
  templateUrl: './header-without-login.component.html',
  styleUrls: ['./header-without-login.component.scss']
})
export class HeaderWithoutLoginComponent implements OnInit {

  loginStatus: boolean;
  userLang!: string;
  currLang: string = 'en';

  constructor(private router: Router, private routes: ActivatedRoute, private authService: AuthService, private translate: TranslateService, private cs: CommonService) {
    translate.addLangs(['en', 'fr']);
    this.userLang = this.cs.getLocalData(LOCAL_KEYS.LANGUAGE) || 'en'
    this.translate.setDefaultLang(this.userLang);
  }

  ngOnInit(): void {
    this.authService.getLoginToken().subscribe((status: boolean) => {
      this.loginStatus = status;
    })
  }

  login(): void {
    this.router.navigate(['/login'])
  }

  updateUserLanguage(language: string) {
    this.cs.setLocalData(LOCAL_KEYS.LANGUAGE, language);
    this.currLang = language;
    this.translate.use(language);
  }

  checkLanguage(): void {
    this.currLang = this.cs.getLocalData(LOCAL_KEYS.LANGUAGE) || 'en';
  }

  navigate(navigateTo: string): void {
    this.router.navigate([navigateTo]);
  }


}
