import { KpiTileComponent } from './kpi-tile/kpi-tile.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { ProductService } from 'src/app/core/services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { EquipmentsService } from 'src/app/core/services/equipments.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedService } from 'src/app/shared/shared.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AccountService, CommonService } from '@core/services';
import { DataManagementService } from '@core/services/data-management.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent, KpiTileComponent],
      imports: [
        CustomMaterialModule,
        SharedModule,
        HttpClientModule,
        RouterTestingModule,
        FormsModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        ProductService,
        SharedService,
        EquipmentsService,
        CommonService,
        AccountService,
        DataManagementService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
  // Overview tab
  // it("should have tab with label 'Overview'", () => {
  //   const firstTab = fixture.nativeElement.querySelector('.mat-tab-link');
  //   expect(firstTab.innerText).toBe('Overview');
  // });

  // it("should have all elements of 'Overview' displayed properly if it is the selected tab", () => {
  //   component.currentTab = 'Overview';
  //   component.currentScope = localStorage.getItem('scope');
  //   console.log(fixture.nativeElement);
  //   const tileHeaders = fixture.nativeElement.querySelectorAll('.tileHeader');
  //   expect(tileHeaders[0].innerText).toBe('Compliance');
  //   expect(tileHeaders[1].innerText).toBe('Quality');
  //   expect(tileHeaders[2].innerText).toBe('Editors');
  //   expect(tileHeaders[3].innerText).toBe('Products');
  //   expect(tileHeaders[4].innerText).toBe('Owned Licenses');
  //   expect(tileHeaders[5].innerText).toBe('Maintenance Licenses');
  //   expect(tileHeaders[6].innerText).toBe('Shared Licenses');
  //   expect(tileHeaders[7].innerText).toBe('Received Licenses');
  //   expect(tileHeaders[8].innerText).toBe('Underusage Amount');
  //   expect(tileHeaders[9].innerText).toBe('Counterfeiting Amount');
  //   expect(tileHeaders[10].innerText).toBe('Scope Expense');
  //   expect(tileHeaders[11].innerText).toBe('Software License Composition');
  //   expect(tileHeaders[12].innerText).toBe('Equipment Details');
  //   expect(tileHeaders[13].innerText).toBe('Number of Products Per Editor');
  // });

  // // Quality tab
  // it("should have tab with label 'Quality'", () => {
  //   const firstTab = fixture.nativeElement.querySelectorAll('.mat-tab-link')[1];
  //   expect(firstTab.innerText).toBe('Quality');
  // });

  // it("should have all elements of 'Quality' displayed properly if it is the selected tab", () => {
  //   component.currentTab = 'Quality';
  //   const tileHeaders = fixture.nativeElement.querySelectorAll('.tileHeader');
  //   // expect(tileHeaders[9].innerText).toBe('Not Deployed Productsinfo');
  //   // expect(tileHeaders[10].innerText).toBe('Not Licensed Productsinfo');
  //   // expect(tileHeaders[11].innerText).toBe(
  //   //   'Last Injection Failures(Last 30 days)info'
  //   // );
  //   // expect(tileHeaders[12].innerText).toBe('Development Rate Detailsinfo');
  //   // expect(tileHeaders[13].innerText).toBe(
  //   //   'Injection Errors(Last 30 days)info'
  //   // );
  // });

  // // Compliance tab
  // it("should have tab with label 'Compliance'", () => {
  //   const firstTab = fixture.nativeElement.querySelectorAll('.mat-tab-link')[2];
  //   expect(firstTab.innerText).toBe('Compliance');
  // });

  // it("should have all elements of 'Compliance' displayed properly if it is the selected tab", () => {
  //   component.currentTab = 'Compliance';
  //   const tileHeaders = fixture.nativeElement.querySelectorAll('.tileHeader');
  //   // expect(tileHeaders[14].innerText).toBe(
  //   //   'Under-usage : Financial Volumeinfo'
  //   // );
  //   // expect(tileHeaders[15].innerText).toBe(
  //   //   'Counterfeiting : Financial Volumeinfo'
  //   // );
  //   // expect(tileHeaders[16].innerText).toBe(
  //   //   'Under-usage : Number of Licenseinfo'
  //   // );
  //   // expect(tileHeaders[17].innerText).toBe(
  //   //   'Counterfeiting : Number of Licenseinfo'
  //   // );
  // });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
