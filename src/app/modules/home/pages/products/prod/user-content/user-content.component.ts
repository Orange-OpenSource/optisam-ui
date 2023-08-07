import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TabMenu } from '@core/modals';

@Component({
  selector: 'app-user-content',
  templateUrl: './user-content.component.html',
  styleUrls: ['./user-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserContentComponent implements OnInit {
  tabMenus: TabMenu[] = [
    {
      title: 'Nominative Users',
      link: '/optisam/dm/nominative-users',
      show: true,
    },

    {
      title: 'Concurrent Users',
      link: '/optisam/dm/concurrent-users',
      show: true,
    },
  ];
  activeTitle: string = this.tabMenus[0].title;

  constructor() {}

  ngOnInit(): void {}
}
