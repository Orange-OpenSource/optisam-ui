import { Component } from '@angular/core';
// import {TranslateService} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { SharedService } from './shared/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title:any = 'OpTISAM';

  constructor(
    private router: Router,
    private sharedService: SharedService
    ) {
      router.events.subscribe((event: Event) => {
        switch (true) {
          case event instanceof NavigationStart:
            this.sharedService.startLoading();
            break;

          case event instanceof NavigationEnd:
          case event instanceof NavigationCancel:
          case event instanceof NavigationError:
            this.sharedService.endLoading();
            break;

          default:
            break;
        }
      });
  }
}
