import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AccountService, ProductService } from '@core/services';
import { Group, GroupCompliance } from '@core/services/group-compliance';
import * as Chart from 'chart.js';
import * as d3 from 'd3';
import { ComplianceChartComponent } from './compliance-chart/compliance-chart.component';
import { UnderusageComponent } from './compliance-chart/underusage/underusage.component';
import { SoftwareExpenditureComponent } from './software-expenditure/software-expenditure.component';
import { Observable, Subscription, of } from 'rxjs';

@Component({
  selector: 'app-group-compliance',
  templateUrl: './group-compliance.component.html',
  styleUrls: ['./group-compliance.component.scss'],
})
export class GroupComplianceComponent implements OnInit, OnDestroy {
  @ViewChild('softExpend') softExpend: SoftwareExpenditureComponent;
  @ViewChild('groupComp') groupComp: ComplianceChartComponent;
  @ViewChild('underUsage') underUsage: UnderusageComponent;
  simulateObj: any = {};
  selectedEditor: string = null;

  groupList: Array<Group> = [];
  selectedScopeNames: string[];
  selectedScopeCodes: string[];
  scopeNamesString: string;
  editorObserver$!: Subscription;

  constructor(private accountService: AccountService, private productService: ProductService) {
    this.accountService.getGroups().subscribe(
      (res: GroupCompliance) => {
        this.groupList = res.complience_groups;
        this.groupList.sort((a: Group, b: Group) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }


  ngOnInit(): void {
    this.editorObserver$ = this.productService.getGroupComplianceSelectedEditor().subscribe((editor: string) => {
      this.selectedEditor = editor;
    })
  }



  selectionChanged(ev: any, type: string) {
    if (ev.value === '') {
      this.softExpend.resetGraphs();
      this.groupComp.resetGraphs();
      this.scopeNamesString = '';
      this.selectedScopeNames = [];
      this.underUsage.selectionChanged('clear', []);
    } else {
      this.productService.setGroupComplianceSelectedEditor('');
      // this.selectionChanged(event, 'group');
      // this.softExpend.selectionChanged(event);
      // this.groupComp.selectionChanged(event, 'group');
      this.selectedScopeCodes = ev.value.scope_code;
      this.selectedScopeNames = ev.value.scope_name;
      this.scopeNamesString = this.selectedScopeNames.join();
      this.underUsage.selectionChanged(ev, this.selectedScopeCodes);
    }
  }


  ngOnDestroy(): void {
    this.editorObserver$.unsubscribe();
  }
}
