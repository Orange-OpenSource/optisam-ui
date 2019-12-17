import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/core/services/account.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  egMsg: Boolean = false;
  frMsg: Boolean = false;
  public currLang = 'en';
  public userLang;
  tablist = ['Language', 'Change Password'];
  currentTab = 'Language';
  constructor(private accountService: AccountService , private translate: TranslateService) {
    translate.addLangs(['en', 'fr']);
   }
  selectedLang: string;
  ngOnInit() {
    this.selectedLang = localStorage.getItem('language');
  }
  Updatelang() {
    const EmailID = localStorage.getItem('email');
    const selectedLang = this.selectedLang;
    this.accountService.updateLang(selectedLang).subscribe(res => {
      const strRes = JSON.stringify(res);
      const obj = JSON.parse(strRes);
      if (obj.success === true) {
        this.updateUserLanguage(selectedLang);
        if (selectedLang === 'en') {
          this.egMsg = true;
          this.frMsg = false;
        } else {
          if (selectedLang === 'fr') {
            this.egMsg = false;
            this.frMsg = true;
          } else {
            this.egMsg = false;
            this.frMsg = false;

          }
        }
       setTimeout(() => {
        this.egMsg = false;
        this.frMsg = false;
       }, 2000);

      }

    });
  }

  updateUserLanguage(language: string) {
    localStorage.setItem('language', language);
    this.currLang = language;
    this.translate.use(language);
  }
}
