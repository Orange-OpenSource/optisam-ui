import { Component, OnInit, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  currentTab: any;
  
  constructor() { }

  ngOnInit() {
    this.currentTab = 'Profile Settings';
  }
}
