import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {
  @Input() aggregationMaintenance: any;
  constructor() {}

  ngOnInit() {
    console.log('aggregationMaitenance', this.aggregationMaintenance);
  }

  isDateLessThanToday(dateString: string): boolean {
    // Return false if there is no date string provided
    if (!dateString) {
      return false;
    }

    const endOfMaintenanceDate = new Date(dateString);
    const today = new Date();

    // Compare year, month, and day values of both dates
    const endOfMaintenanceYear = endOfMaintenanceDate.getUTCFullYear();
    const endOfMaintenanceMonth = endOfMaintenanceDate.getUTCMonth();
    const endOfMaintenanceDay = endOfMaintenanceDate.getUTCDate();

    const todayYear = today.getUTCFullYear();
    const todayMonth = today.getUTCMonth();
    const todayDay = today.getUTCDate();

    if (endOfMaintenanceYear < todayYear) {
      return true;
    } else if (endOfMaintenanceYear === todayYear) {
      if (endOfMaintenanceMonth < todayMonth) {
        return true;
      } else if (endOfMaintenanceMonth === todayMonth) {
        return endOfMaintenanceDay < todayDay;
      }
    }

    return false;
  }
}
