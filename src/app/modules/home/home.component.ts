import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public navigationLoading: Boolean;
  navigationSubscription: Subscription;
  constructor(
    private sharedService: SharedService
  ) {
    this.navigationLoading = false;
    this.navigationSubscription = this.sharedService.navigationLoading().subscribe(data => {
      this.navigationLoading = data;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.navigationSubscription.unsubscribe();
  }
}
