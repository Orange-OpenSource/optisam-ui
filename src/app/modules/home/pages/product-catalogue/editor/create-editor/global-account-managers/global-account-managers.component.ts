import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormGroup } from '@angular/forms';
import { GlobalAccountManager } from '@core/modals';
import { SingleGlobalAccountManagerComponent } from './single-global-account-manager/single-global-account-manager.component';

@Component({
  selector: 'app-global-account-managers',
  templateUrl: './global-account-managers.component.html',
  styleUrls: ['./global-account-managers.component.scss'],
})
export class GlobalAccountManagersComponent implements OnInit {
  @Input() accountManagerData: GlobalAccountManager[] = null;
  globalAccountManagerGroup: FormGroup;
  AccountManager: FormArray;
  constructor(private container: ControlContainer) {}

  ngOnInit(): void {
    this.globalAccountManagerGroup = this.container.control as FormGroup;
    this.AccountManager = this.globalAccountManagerGroup?.get(
      'globalAccountManager'
    ) as FormArray;
    for (let data of this.accountManagerData || []) {
      this.addNewGlobalAccountManager(data);
    }
  }

  addNewGlobalAccountManager(data: GlobalAccountManager = null): void {
    this.AccountManager.push(
      SingleGlobalAccountManagerComponent.addGlobalAccountManager(data)
    );
  }
}
