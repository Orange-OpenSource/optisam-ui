import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  currentTab: any;

  constructor(private router: Router) {
    this.currentTab = this.router.getCurrentNavigation()?.extras?.state?.tab || 'Profile Settings';
  }

  ngOnInit() { }

}
